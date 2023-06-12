import { LABHUB_SERVICE, LEADER_ID_CHAR, EXPERIMENT_STATUS_CHAR } from "./const";
import { getValueFromDataView } from "./gatt/utils";
import { getShortHexCode } from "./gatt/map";
import { getClientId, getClientType } from "../labhub/utils";
import { getDataRate, getDataSample, getOperation } from "./device-utils";
import { getDeviceStatusValue, isReusedClientId, removeMember } from "./device-actions";
import { topicDeviceDataFeed, topicDeviceStatus } from "./topics";
import { DeviceDataFeed, DeviceStatus, HeaterSelect, LeaderOperation, SensorSelect, SetupData, SensorDataStream, HeaterDataStream, RgbDataStream } from "../types/common";
import { ExperimentDataType, TimerControl } from "./device-types";
import { delay, Log, roundTwoDec } from "../utils/utils";
import { getCachedCharacteristic, readCharacteristicValue } from "./read-write";
import { stopRgbExperiment } from "../labhub/actions";
import { getTemperatureValue, getVoltageValue } from "../labhub/actions-client";
import { deviceDataFeedUpdate } from "../labhub/status";

let prevSampleIndex = -1;
let prevLeaderOperation: LeaderOperation = null;

export async function setupLeaderIdNotify(server: BluetoothRemoteGATTServer | null) {
  const serviceId = LABHUB_SERVICE;
  const characteristicId = LEADER_ID_CHAR;

  let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  try {
    characteristic = await getCachedCharacteristic(server, serviceId, characteristicId);
    if (!characteristic) {
      throw new Error(`Unable to get characteristic: ${getShortHexCode(serviceId)}, ${getShortHexCode(characteristicId)}`);
    }

    characteristic.addEventListener('characteristicvaluechanged', handleLeaderIdChanged);
    await characteristic.startNotifications();

    Log.debug('Notifications setup successfully for leader_notify!');
  } catch (e) {
    Log.error("[ERROR:setupLeaderIdNotify]", e);
    return null;
  }

  return characteristic;
}

export async function cleanupLeaderIdNotify(characteristic: BluetoothRemoteGATTCharacteristic | null) {  
  try {
    if (characteristic) {
      characteristic.removeEventListener('characteristicvaluechanged', handleLeaderIdChanged);
      if (characteristic.service.device.gatt?.connected) {
        await characteristic.stopNotifications();
      }

      Log.debug('Notifications cleanup successful for leader_notify!');
    }
  } catch (e) {
    Log.error("[ERROR:cleanupLeaderIdNotify]", e);
    return;
  }

  characteristic = null;
}

function handleLeaderIdChangedBase(leaderId: string, manual = false) {
  // NOTE: Though the condition is put here, it cannot be fully trusted because of possible race conditions
  // So, proper handling has been done in the conditions for if-else block below
  // However, if it is called manually (manual === true), then it is safe to say that there are no race conditions
  if (getClientType() === 'leader') return;

  let handled = false;
  const clientId = getClientId();
  const reusedClientId = isReusedClientId();
  const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

  if (deviceStatusValue.leaderSelected && leaderId === '0' && clientId && clientId !== deviceStatusValue.leaderSelected) {
    handled = true;
    deviceStatusValue.leaderSelected = null;
    topicDeviceStatus.next(deviceStatusValue);
  } else if (deviceStatusValue.leaderSelected === null && leaderId && leaderId !== '0' && clientId) {
    if (leaderId !== clientId) {
      handled = true;
      deviceStatusValue.leaderSelected = leaderId;
      topicDeviceStatus.next(deviceStatusValue);
    } else if (manual && reusedClientId) {
      handled = true;
      removeMember(deviceStatusValue.membersJoined, clientId);
      deviceStatusValue.leaderSelected = leaderId;
      topicDeviceStatus.next(deviceStatusValue);
      Log.debug('Automatically upgraded to leader status:', clientId);
    }
  }

  if (!handled) {
    // Log.error('handleLeaderIdChangedBase: Unhandled value!', clientId, leaderId, deviceStatusValue.leaderSelected);
  }
}

function handleLeaderIdChanged(event: any) {
  const dataView = event.target.value;
  const leaderIdn = getValueFromDataView(dataView, 'int16') as number;

  Log.debug('handleLeaderIdChanged:', leaderIdn);
  const leaderId = `${leaderIdn}`;
  handleLeaderIdChangedBase(leaderId);
}

export const requestLeaderId = async (server: BluetoothRemoteGATTServer | null) => {
  const leaderIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');
  if (leaderIdn === undefined) {
    Log.error('[ERROR:fetchLeaderId] Unable to fetch Leader ID from device');
  } else {
    Log.debug('[A] Leader ID read from device:', leaderIdn);

    const leaderId = `${leaderIdn}`;
    handleLeaderIdChangedBase(leaderId, true);
  }
}

// -------------------

export async function setupExperimentStatusNotify(server: BluetoothRemoteGATTServer | null) {
  const serviceId = LABHUB_SERVICE;
  const characteristicId = EXPERIMENT_STATUS_CHAR;

  let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  try {
    characteristic = await getCachedCharacteristic(server, serviceId, characteristicId);
    if (!characteristic) {
      throw new Error(`Unable to get characteristic: ${getShortHexCode(serviceId)}, ${getShortHexCode(characteristicId)}`);
    }

    characteristic.addEventListener('characteristicvaluechanged', handleExperimentStatusChanged);
    await characteristic.startNotifications();

    Log.debug('Notifications setup successfully for experiment_status_notify!');
  } catch (e) {
    Log.error("[ERROR:setupExperimentStatusNotify]", e);
    return null;
  }

  return characteristic;
}

export async function cleanupExperimentStatusNotify(characteristic: BluetoothRemoteGATTCharacteristic | null) {
  try {
    if (characteristic) {
      characteristic.removeEventListener('characteristicvaluechanged', handleExperimentStatusChanged);
      if (characteristic.service.device.gatt?.connected) {
        await characteristic.stopNotifications();
      }

      Log.debug('Notifications cleanup successful for experiment_status_notify!');
    }
  } catch (e) {
    Log.error("[ERROR:cleanupExperimentStatusNotify]", e);
    return;
  }

  characteristic = null;
}

async function handleExperimentStatusChanged(event: any) {
  const dataView = event.target.value;
  const experimentStatusBuffer = getValueFromDataView(dataView, 'buffer') as ArrayBuffer;

  if (experimentStatusBuffer && experimentStatusBuffer.byteLength === 20) {
    const statusDataView = new DataView(experimentStatusBuffer);

    const timer_control = getValueFromDataView(statusDataView, 'int8', 0) as number;
    const operation = getValueFromDataView(statusDataView, 'int8', 1) as number;
    const data_type = getValueFromDataView(statusDataView, 'int8', 2) as number;
    // const status_fault = getValueFromDataView(statusDataView, 'int8', 3) as number;
    const battery_level = getValueFromDataView(statusDataView, 'int8', 4) as number;
    const sensor_attach = getValueFromDataView(statusDataView, 'int8', 5) as number;

    const data_rate = getValueFromDataView(statusDataView, 'int16', 6) as number;
    const num_of_samples = getValueFromDataView(statusDataView, 'int16', 8) as number;
    const current_sample = getValueFromDataView(statusDataView, 'int16', 10) as number;
    const heater_temp_setpoint = getValueFromDataView(statusDataView, 'int16', 12) as number;

    // const data = getValueFromDataView(statusDataView, 'buffer', 14) as ArrayBuffer;
    const data1 = getValueFromDataView(statusDataView, 'int16', 14) as number;
    const data2 = getValueFromDataView(statusDataView, 'int16', 16) as number;
    const data3 = getValueFromDataView(statusDataView, 'int16', 18) as number;

    const data1x = (data1 & 0xffff) === 0xffff ? null : data1;
    const data2x = (data2 & 0xffff) === 0xffff ? null : data2;
    const data3x = (data3 & 0xffff) === 0xffff ? null : data3;

    const leaderOperation: LeaderOperation = getOperation(operation);

    const temperatureSensor = (sensor_attach & 0x1) === 0x1;
    const voltageSensor = (sensor_attach & 0x2) === 0x2;
    const heaterSensor = (sensor_attach & 0x4) === 0x4;

    let sensorConnected: SensorSelect = null;
    if (temperatureSensor) {
      sensorConnected = 'temperature';
    } else if (voltageSensor) {
      sensorConnected = 'voltage';
    }
    
    let heaterConnected: HeaterSelect = null;
    if (heaterSensor) {
      if (temperatureSensor) {
        heaterConnected = 'probe';
      } else {
        heaterConnected = 'element';
      }
    }

    const setupData: SetupData = {
      dataRate: getDataRate(data_rate),
      dataSample: getDataSample(num_of_samples),
    };

    const setpointTemp = heater_temp_setpoint / 100;

    // --------------------

    const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

    deviceStatusValue.batteryLevel = battery_level;  // 0-100 (0-100%)

    deviceStatusValue.sensorConnected = sensorConnected;
    deviceStatusValue.heaterConnected = heaterConnected;

    deviceStatusValue.setupData = setupData;
    deviceStatusValue.setpointTemp = setpointTemp;

    if (!deviceStatusValue.operation && leaderOperation && timer_control !== TimerControl.STOP_RESET) {
      deviceStatusValue.operation = leaderOperation;
    } else if (deviceStatusValue.operation && (deviceStatusValue.operation !== leaderOperation || timer_control === TimerControl.STOP_RESET)) {
      deviceStatusValue.operationPrev = deviceStatusValue.operation;
      deviceStatusValue.operation = null;
    }

    // --------------------

    const dataType: ExperimentDataType = data_type;
    let deviceDataFeed: DeviceDataFeed | null = null;
    let rgbCalibratedAndTested = false;

    if ((prevLeaderOperation !== leaderOperation) || (current_sample === 0 && prevSampleIndex > 0)) {
      prevSampleIndex = -1;
    }
    prevLeaderOperation = leaderOperation;

    if (dataType === ExperimentDataType.NONE) {
      rgbCalibratedAndTested = deviceStatusValue.rgbCalibratedAndTested;  // let it be unchanged

      deviceDataFeed = {
        sensor: null,
        heater: null,
        rgb: null,
      };
    } else if (dataType === ExperimentDataType.MEASURE) {
      if (prevSampleIndex < current_sample) {
        let sensorDataStream: SensorDataStream | null = {
          temperature: null,
          temperatureIndex: null,
          voltage: null,
          voltageIndex: null,
        };
        if (sensorConnected === 'temperature' && leaderOperation === 'measure_temperature') {
          if (prevSampleIndex + 1 !== current_sample) {
            Log.warn(`Missing temperatureIndex: ${current_sample - 1} [${prevSampleIndex}, ${current_sample}]`);
          }

          const tempData = Math.round(data3 / 100);  // temperature is C * 100, not C

          // sensorDataStream.temperature = tempData;
          // sensorDataStream.temperatureIndex = current_sample;

          if (current_sample > 0) {
            sensorDataStream.temperature = tempData;
            sensorDataStream.temperatureIndex = current_sample - 1;
          } else {
            sensorDataStream = null;
          }

          // async function forceEmit(index: number) {
          //   const lastValue = await getTemperatureValue(index);
        
          //   const sensorDataStreamPrev = JSON.parse(JSON.stringify(sensorDataStream));
          //   sensorDataStreamPrev.temperature = lastValue;
          //   sensorDataStreamPrev.temperatureIndex = index;
          //   const deviceDataFeedPrev = {
          //     sensor: sensorDataStreamPrev,
          //     heater: null,
          //     rgb: null,
          //   };            
          //   topicDeviceDataFeed.next(deviceDataFeedPrev);
          //   await delay(100);
          // }

          // if (current_sample === 0) {
          //   sensorDataStream = null;
          // } else if (current_sample === 1) {
          //   const lastValue = await getTemperatureValue(current_sample - 1);

          //   sensorDataStream.temperature = lastValue;
          //   sensorDataStream.temperatureIndex = current_sample - 1;
          // } else if (current_sample === 2) {
          //   await forceEmit(current_sample - 1);

          //   sensorDataStream.temperature = tempData;
          //   sensorDataStream.temperatureIndex = current_sample;
          // } else {
          //   sensorDataStream.temperature = tempData;
          //   sensorDataStream.temperatureIndex = current_sample;
          // }
        } else if (sensorConnected === 'voltage' && leaderOperation === 'measure_voltage') {
          if (prevSampleIndex + 1 !== current_sample) {
            Log.warn(`Missing voltageIndex: ${current_sample - 1} [${prevSampleIndex}, ${current_sample}]`);
          }

          const voltageData = roundTwoDec(data3 / 1000 - 12);  // voltage is (V + 12) * 1000

          if (current_sample > 0) {
            sensorDataStream.voltage = voltageData;
            sensorDataStream.voltageIndex = current_sample - 1;  
          } else {
            sensorDataStream = null;
          }

          // async function forceEmit(index: number) {
          //   const lastValue = await getVoltageValue(index);
        
          //   const sensorDataStreamPrev = JSON.parse(JSON.stringify(sensorDataStream));
          //   sensorDataStreamPrev.voltage = lastValue;
          //   sensorDataStreamPrev.voltageIndex = index;
          //   const deviceDataFeedPrev = {
          //     sensor: sensorDataStreamPrev,
          //     heater: null,
          //     rgb: null,
          //   };            
          //   topicDeviceDataFeed.next(deviceDataFeedPrev);
          //   await delay(100);
          // }

          // if (current_sample === 0) {
          //   sensorDataStream = null;
          // } else if (current_sample === 1) {
          //   const lastValue = await getVoltageValue(current_sample - 1);

          //   sensorDataStream.voltage = lastValue;
          //   sensorDataStream.voltageIndex = current_sample - 1;
          // } else if (current_sample === 2) {
          //   await forceEmit(current_sample - 1);

          //   sensorDataStream.voltage = voltageData;
          //   sensorDataStream.voltageIndex = current_sample;
          // } else {
          //   sensorDataStream.voltage = voltageData;
          //   sensorDataStream.voltageIndex = current_sample;
          // }
        } else {
          sensorDataStream = null;
        }

        deviceDataFeed = {
          sensor: sensorDataStream,
          heater: null,
          rgb: null,
        };
        prevSampleIndex = current_sample;
      }
    } else if (dataType === ExperimentDataType.HEATER) {
      let heaterDataStream: HeaterDataStream | null = {
        element: null,
        probe: null,
      };
      if (!deviceDataFeedUpdate?.value?.probe && leaderOperation === 'heater_control') {
        const power = data1 / 1000;
        heaterDataStream.element = [power];
      } else if (heaterConnected === 'probe' && leaderOperation === 'heater_probe') {
        const power = data1 / 1000;
        const probeTemp = data2x === null ? data2x : data2x;  // temperature is C, not C * 100
        heaterDataStream.probe = [power, probeTemp as any];
      } else {
        heaterDataStream = null;
      }

      deviceDataFeed = {
        sensor: null,
        heater: heaterDataStream,
        rgb: null,
      };
    } else if (dataType === ExperimentDataType.RGB) {
      let rgbDataStream: RgbDataStream | null = {
        calibrateTest: null,
        measure: null,
      };
      if (leaderOperation === 'rgb_calibrate') {
        rgbCalibratedAndTested = true;
        rgbDataStream.calibrateTest = [data1x, data2x, data3x];
        if (data1x !== null && data2x !== null && data3x !== null) {
          stopRgbExperiment();
        }
      } else if (leaderOperation === 'rgb_measure') {
        rgbCalibratedAndTested = deviceStatusValue.rgbCalibratedAndTested;  // let it be unchanged
        rgbDataStream.measure = [data1x, data2x, data3x];
        if (data1x !== null && data2x !== null && data3x !== null) {
          stopRgbExperiment();
        }
      } else {
        rgbDataStream = null;
      }

      deviceDataFeed = {
        sensor: null,
        heater: null,
        rgb: rgbDataStream,
      };
    }

    deviceStatusValue.rgbCalibratedAndTested = rgbCalibratedAndTested;

    topicDeviceStatus.next(deviceStatusValue);

    Log.debug('handleExperimentStatusChanged:', !!deviceDataFeed, data1, data2, data3, '#', data_type, operation, timer_control, current_sample);

    if (deviceDataFeed) {
      topicDeviceDataFeed.next(deviceDataFeed);
    } else {
      // Log.error('handleExperimentStatusChanged: Unhandled value!', deviceDataFeed);
    }
  } else {
    Log.error('[ERROR:handleExperimentStatusChanged] Invalid experimentStatusBuffer:', experimentStatusBuffer?.byteLength);
  }
}
