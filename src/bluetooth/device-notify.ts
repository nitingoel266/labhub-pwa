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

/**
 * 
 * @param server  :- get BLE Device characteristics and manage characteristics when changes
 * @returns :- return characteristics of the BLE device by BluetoothRemoteGATTService
 */
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

// remove leader_notify values
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

/**
 * 
 * @param leaderId :- leaderId
 * @param manual 
 * @returns  :- return new leader id after creation 
 */
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

// manage the leader id when leader gets changed
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

/**
 * notify when any experiment is start or stop 
 * @param server  :- characterstic values of the BLE device
 * @returns :- return characterstic fron cached(previoisly saved)
 */
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

// remove event listner for the experiment status either it is stop or start
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

/**
 * get the values for the device status and experiment status, values and populate them to the locale state variables
 * @param event characterstic provided by the BLE device for experiments and changes
 */
async function handleExperimentStatusChanged(event: any) {
  const dataView = event.target.value; // characterstic values in binary format

  // getValueFromDataView :- extract values for the status and experiment from binary bytes and store them in state
  const experimentStatusBuffer = getValueFromDataView(dataView, 'buffer') as ArrayBuffer;

  if (experimentStatusBuffer && experimentStatusBuffer.byteLength === 20) {
    const statusDataView = new DataView(experimentStatusBuffer);

    const timer_control = getValueFromDataView(statusDataView, 'int8', 0) as number; // get 0 git value for data timer
    const operation = getValueFromDataView(statusDataView, 'int8', 1) as number; // get 1 bit value for operations
    const data_type = getValueFromDataView(statusDataView, 'int8', 2) as number; // get 2 bit value for data tpe
    const status_fault = getValueFromDataView(statusDataView, 'int8', 3) as number; // get 3 bit value for battery charging status
    const battery_level = getValueFromDataView(statusDataView, 'int8', 4) as number; // get 4th bit valuefor battery percentage
    const sensor_attach = getValueFromDataView(statusDataView, 'int8', 5) as number; // get 5thbit value for sensor verifaction

    const data_rate = getValueFromDataView(statusDataView, 'int16', 6) as number; // get 2 bit values for data rate
    const num_of_samples = getValueFromDataView(statusDataView, 'int16', 8) as number;
    const current_sample = getValueFromDataView(statusDataView, 'int16', 10) as number;
    const heater_temp_setpoint = getValueFromDataView(statusDataView, 'int16', 12) as number;

    // const data = getValueFromDataView(statusDataView, 'buffer', 14) as ArrayBuffer;
    const data1 = getValueFromDataView(statusDataView, 'int16', 14) as number; // get 2 bit values for the heater, rgb
    const data2 = getValueFromDataView(statusDataView, 'int16', 16) as number; // get 2 bit value for rgb second value
    const data3 = getValueFromDataView(statusDataView, 'int16', 18) as number; // get 2 bit value for rgb third value

    const data1x = (data1 & 0xffff) === 0xffff ? null : data1; // check weather value is abailable for data1 or it is 1111(in binary means no value) means null for rgb values
    const data2x = (data2 & 0xffff) === 0xffff ? null : data2;
    const data3x = (data3 & 0xffff) === 0xffff ? null : data3;

    const leaderOperation: LeaderOperation = getOperation(operation); // identify which operation weare going to perform

    // const timmerRun = (status_fault & 0x1) === 0x1;
    const charging = (status_fault & 0x2) === 0x2; // identify battery charging status by second bit
    // const chargeFault = (status_fault & 0x4) === 0x4;
    Log.debug("Battery Charging Status ",charging,status_fault)
    const temperatureSensor = (sensor_attach & 0x1) === 0x1; // identify temperature sensor is connected or not (if one byte value is 1 or 0)
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

    const setupData: SetupData = { // set the data setup values from characterstics
      dataRate: getDataRate(data_rate),
      dataSample: getDataSample(num_of_samples),
    };

    // const setpointTemp = heater_temp_setpoint / 100;
    const setpointTemp = heater_temp_setpoint;

    // --------------------

    const deviceStatusValue: DeviceStatus = getDeviceStatusValue(); // get initial device status

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
        let probeTemp = data2x === null ? data2x : data2x;  // temperature is C * 100, not C
        if (probeTemp !== null) probeTemp = Number((probeTemp / 100).toFixed(1));
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
        const data1xUpdatedValue = data1x !== null ? Number(Number((Number(data1x) - 500)/100).toFixed(1)) : data1x;
        const data2xUpdatedValue = data2x !== null ? Number(Number((Number(data2x) - 500)/100).toFixed(1)) : data2x;
        const data3xUpdatedValue = data3x !== null ? Number(Number((Number(data3x) - 500)/100).toFixed(1)) : data3x;

        // rgbDataStream.measure = [data1x, data2x, data3x];// previous values
        rgbDataStream.measure = [data1xUpdatedValue, data2xUpdatedValue, data3xUpdatedValue]; // updated one on 27th-jun-23

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

    topicDeviceStatus.next(deviceStatusValue); // update the device status value to local state var 

    Log.debug('handleExperimentStatusChanged:', !!deviceDataFeed, data1, data2, data3, '#', data_type, operation, timer_control, current_sample);

    if (deviceDataFeed) {
      topicDeviceDataFeed.next(deviceDataFeed); //update the device feed values to local state var
    } else {
      // Log.error('handleExperimentStatusChanged: Unhandled value!', deviceDataFeed);
    }
  } else {
    Log.error('[ERROR:handleExperimentStatusChanged] Invalid experimentStatusBuffer:', experimentStatusBuffer?.byteLength);
  }
}
