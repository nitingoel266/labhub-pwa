import { LABHUB_SERVICE, LEADER_ID_CHAR, EXPERIMENT_STATUS_CHAR } from "./const";
import { getValueFromDataView } from "./gatt/utils";
import { getShortHexCode } from "./gatt/map";
import { getClientId, getClientType } from "../labhub/utils";
import { getDataRate, getDataSample, getOperation } from "./device-utils";
import { getDeviceStatusValue, isReusedClientId, removeMember } from "./device-actions";
import { topicDeviceDataFeed, topicDeviceStatus } from "./topics";
import { DeviceDataFeed, DeviceStatus, HeaterSelect, LeaderOperation, SensorSelect, SetupData, SensorDataStream, HeaterDataStream, RgbDataStream } from "../types/common";
import { ExperimentDataType } from "./device-types";
import { Log } from "../utils/utils";
import { getCachedCharacteristic, readCharacteristicValue } from "./read-write";

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
      Log.debug('Automatically upgraded to leader status!');
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

// TODO: Is it called for leader in action?
function handleExperimentStatusChanged(event: any) {
  const dataView = event.target.value;
  const experimentStatusBuffer = getValueFromDataView(dataView, 'buffer') as ArrayBuffer;

  // TODO: Handle reset of deviceStatus value (at least client-side) when experiment starts/stops!!

  if (experimentStatusBuffer && experimentStatusBuffer.byteLength === 20) {
    const statusDataView = new DataView(experimentStatusBuffer);

    // const timer_control = getValueFromDataView(statusDataView, 'int8', 0) as number;  // TODO: ??
    const operation = getValueFromDataView(statusDataView, 'int8', 1) as number;
    const data_type = getValueFromDataView(statusDataView, 'int8', 2) as number;
    // const status_fault = getValueFromDataView(statusDataView, 'int8', 3) as number;
    const battery_level = getValueFromDataView(statusDataView, 'int8', 4) as number;
    const sensor_attach = getValueFromDataView(statusDataView, 'int8', 5) as number;

    let data_rate = getValueFromDataView(statusDataView, 'int16', 6) as number;
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

    // TODO: Test if ExperimentStatus notify automatically comes when a sensor/heater is connected to the device??

    let sensorConnected: SensorSelect = null;
    if ((sensor_attach & 0x1) === 0x1) {
      sensorConnected = 'temperature';
    } else if ((sensor_attach & 0x2) === 0x2) {
      // TODO?: Clarify only one of 'temperature' (more priority) and 'voltage' is connected at a time
      sensorConnected = 'voltage';
    }
    
    let heaterConnected: HeaterSelect = null;
    if ((sensor_attach & 0x4) === 0x4) {
      // TODO?: How to differentiate b/w 'element' and 'probe'
      heaterConnected = 'probe';
    }

    // TODO [temp]:
    // 1a. data_rate (default) 1 second not coming from device on first notify
    // 1b. setpoint_temp (default) 20*C not coming from device on first notify
    // 2. Unable to write (0,0) pair for data_rate and num_of_samples
    if (data_rate === 0 && num_of_samples === 0) {
      data_rate = 1;
    }

    const setupData: SetupData = {
      dataRate: getDataRate(data_rate),
      dataSample: getDataSample(num_of_samples),
    };

    const setpointTemp = heater_temp_setpoint / 100;

    // --------------------

    const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

    // TODO: Check 0-100(%) or level 0-3 or ???
    deviceStatusValue.batteryLevel = battery_level;

    deviceStatusValue.sensorConnected = sensorConnected;
    deviceStatusValue.heaterConnected = heaterConnected;

    deviceStatusValue.setupData = setupData;
    deviceStatusValue.setpointTemp = setpointTemp;

    // TODO: Is the ExperimentStatus notify really always as a result of new operation??
    deviceStatusValue.operationPrev = deviceStatusValue.operation;
    deviceStatusValue.operation = leaderOperation;

    {
      const { operationPrev, operation } = deviceStatusValue;
      if (operation === 'rgb_measure') {
        if (operationPrev === 'rgb_calibrate') {
          deviceStatusValue.rgbCalibratedAndTested = true;
        } else if (operationPrev === 'rgb_measure') {
          // remains same
        } else {
          deviceStatusValue.rgbCalibratedAndTested = false;
        }
      } else {
        deviceStatusValue.rgbCalibratedAndTested = false;
      }  
    }

    topicDeviceStatus.next(deviceStatusValue);

    // --------------------

    const dataType: ExperimentDataType = data_type;
    let deviceDataFeed: DeviceDataFeed | null = null;

    if ((prevLeaderOperation !== leaderOperation) || (current_sample === 0 && prevSampleIndex > 0)) {
      prevSampleIndex = -1;
    }
    prevLeaderOperation = leaderOperation;

    if (dataType === ExperimentDataType.NONE) {
      deviceDataFeed = {
        sensor: null,
        heater: null,
        rgb: null,
      };
    } else if (dataType === ExperimentDataType.MEASURE) {
      if (prevSampleIndex < current_sample) {
        prevSampleIndex = current_sample;

        // TODO: handle continuous data (and ensure it results in NO duplicates)

        let sensorDataStream: SensorDataStream | null = {
          temperature: null,
          temperatureIndex: null,
          voltage: null,
          voltageIndex: null,
        };
        if (sensorConnected === 'temperature' && leaderOperation === 'measure_temperature') {
          sensorDataStream.temperature = data3 / 100;
          sensorDataStream.temperatureIndex = current_sample;
        } else if (sensorConnected === 'voltage' && leaderOperation === 'measure_voltage') {
          sensorDataStream.voltage = data3 / 100;
          // sensorDataStream.voltage = (data3 / 1000) - 12; //  TODO: 100 vs 1000 w/ -12 adjust
          sensorDataStream.voltageIndex = current_sample;
        } else {
          sensorDataStream = null;
        }

        deviceDataFeed = {
          sensor: sensorDataStream,
          heater: null,
          rgb: null,
        };
      }
    } else if (dataType === ExperimentDataType.HEATER) {
      // TODO: Handle heater element

      // TODO: Ensure continuous data results in NO duplicates

      let heaterDataStream: HeaterDataStream | null = {
        element: null,
        probe: null,
      };
      if (heaterConnected === 'probe' && leaderOperation === 'heater_control') {
        const power = data1 / 1000;
        const probeTemp = data2x === null ? data2x : data2x / 100;

        // TODO: as any ==> probeTemp can be null in case of heater (vs probe confusion!)
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
        rgbDataStream.calibrateTest = [data1x, data2x, data3x];
      } else if (leaderOperation === 'rgb_measure') {
        rgbDataStream.measure = [data1x, data2x, data3x];
      } else {
        rgbDataStream = null;
      }

      deviceDataFeed = {
        sensor: null,
        heater: null,
        rgb: rgbDataStream,
      };
    }

    Log.debug('handleExperimentStatusChanged:', !!deviceDataFeed);
    if (deviceDataFeed) {
      topicDeviceDataFeed.next(deviceDataFeed);
    } else {
      Log.error('handleExperimentStatusChanged: Unhandled value!', deviceDataFeed);
    }
  } else {
    Log.error('[ERROR:handleExperimentStatusChanged] Invalid experimentStatusBuffer:', experimentStatusBuffer?.byteLength);
  }
}
