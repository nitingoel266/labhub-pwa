import { applicationMessage, clientChannelResponse, deviceStatus, resetStatus } from "../labhub/status";
import { clearClientId, getClientId, setClientId, getClientType } from "../labhub/utils";
import { clearCharacteristicsCache, readCharacteristicValue, writeCharacteristicValue } from "./read-write";
import { getArrayBuffer, getByteArray, getDataRateN, getDataSampleN, getOperationN } from "./device-utils";
import { initialDeviceStatus } from "./status";
import { topicDeviceStatus, resetTopics } from "./topics";
import { LABHUB_SERVICE, STUDENT_ID_CHAR, LEADER_ID_CHAR, EXPERIMENT_CONTROL_CHAR, EXPERIMENT_DATA_SERIES_CHAR, LEADER_STATUS_CHAR } from "./const";
import { DeviceDataFeedUpdate, DeviceStatus, DeviceStatusUpdate, SetupData, ClientChannelRequest, ClientChannelResponse, RgbFuncSelect } from "../types/common";
import { ControlOperation, ExperimentControl, TimerControl, LeaderStatus } from "./device-types";
import { getValueFromDataView } from "./gatt/utils";
import { resetAll } from "../labhub/actions";
import { Log } from "../utils/utils";

let reusedClientId = false;

/**
 * 
 * @param init differentiate b/w initial values or updated values which one should we return 
 * @returns device values
 */
export function getDeviceStatusValue(init = false): DeviceStatus {
  if (init) {
    if (deviceStatus.value) {
      Log.warn('Unexpected! deviceStatus value is supposed to be null here');
    }
    return JSON.parse(JSON.stringify(initialDeviceStatus));
  } else {
    if (!deviceStatus.value) {
      Log.warn('Unexpected! deviceStatus value is supposed to be existing (non-null) here');
    }
    return JSON.parse(JSON.stringify(deviceStatus.value || initialDeviceStatus));
  }
}

/**
 * remove client(member) id when it will disconnect from BLE device
 * @param membersList connected members to BLE device
 * @param clientId current connected device id
 * @returns 
 */
export function removeMember(membersList: string[], clientId: string) {
  if (membersList.includes(clientId as string)) {
    const idx = membersList.indexOf(clientId as string);
    if (idx >= 0) membersList.splice(idx, 1);
  } else {
    Log.warn('[WARN] Unexpected! clientId missing from membersJoined list.');
    return;
  }
  if (membersList.includes(clientId as string)) {
    Log.warn('[WARN] Unexpected! Duplicate clientId found in membersJoined list.');
  }
}

/**
 * Add member id when it is going to connect to BLE Device
 * @param membersList list of client id's connected by BLE device
 * @param clientId current client id that trying to connect to device
 */
function addMember(membersList: string[], clientId: string) {
  if (!membersList.includes(clientId as string)) {
    membersList.push(clientId);
  } else {
    Log.warn('[WARN] Unexpected! clientId already exists in membersJoined list.');
  }
}
  
// request for new client ID
export const requestClientId = async (server: BluetoothRemoteGATTServer, connectionReuse = false) => {
  reusedClientId = false;

  let clientId = connectionReuse ? getClientId() : null;
  if (!clientId) {
    if (connectionReuse) {
      Log.warn('Unexpected! clientId should already exist in case of connection reuse.');
    }

    let success = false;
    const voidClientId = await readCharacteristicValue<number>(server, LABHUB_SERVICE, STUDENT_ID_CHAR, 'int16');
    if (voidClientId === 0) {
      const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, STUDENT_ID_CHAR, 0, 2);
      if (ret1) {
        const clientIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, STUDENT_ID_CHAR, 'int16');
        if (clientIdn) {
          Log.debug('New clientId requested successfully:', clientIdn);
          clientId = setClientId(clientIdn);
          success = true;
        } else {
          Log.error('[ERROR:requestClientId] Unable to get new Student ID from LabHub device [2]');
        }
      } else {
        Log.error('[ERROR:requestClientId] Unable to get new Student ID from LabHub device [1]');
      }
    } else if (voidClientId) {
      Log.error('[ERROR:requestClientId] Cannot request a new clientId! clientId already exists for this connection:', voidClientId);
    } else {
      Log.error('[ERROR:requestClientId] Unable to read/check for clientId value from device:', voidClientId);
    }

    if (!success) {
      applicationMessage.next('Unable to request new clientId.');
    }
  } else {
    reusedClientId = true;
    Log.log('Reusing existing/stored clientId:', clientId);
  }

  if (clientId) {
    const deviceStatusValue = getDeviceStatusValue();

    addMember(deviceStatusValue.membersJoined, clientId);

    topicDeviceStatus.next(deviceStatusValue);
  } else {
    clearClientId();
  }

  return clientId;
}

// handle client id when it get's disconnected
export const disconnectClient = async (server: BluetoothRemoteGATTServer) => {
  const clientId = getClientId();
  if (clientId) {
    const clientIdn = Number.parseInt(clientId, 10);
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, STUDENT_ID_CHAR, clientIdn, 2);

    if (ret1) {
      Log.debug('Client disconnect successful!');
      clearClientId();
    } else {
      Log.error('[ERROR:disconnectClient] Unable to disconnect client from LabHub device');
      return;
    }
  } else {
    Log.warn('[disconnectClient] clientId missing!');
  }
};

export const isReusedClientId = () => reusedClientId;

export const resetClient = (softReset = false) => {
  resetTopics();
  resetStatus();

  if (softReset) {
    Log.debug('Client (soft) reset complete!');
  } else {
    clearClientId();
    clearCharacteristicsCache();
    Log.debug('Client reset complete!');
  }
};

// notify the BLE device when we try to change status, update value, start/stop experiment with help of dispatchExperimentControl
export const handleDeviceStatusUpdate = async (server: BluetoothRemoteGATTServer | null, updValue: DeviceStatusUpdate | null) => {
  if (!deviceStatus.value) return;

  if (!server || !updValue) return;
  
  // handle multiple keys passed at the same time
  for (const [key, value] of Object.entries(updValue)) {
    const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

    if (key === 'leaderSelected') {
      if (value !== null && deviceStatusValue[key] === null) {
        const candidate = Number.parseInt(value, 10) || null;
        const clientId = getClientId();

        if (candidate && value === clientId) {
          let leaderIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');
          Log.debug('[B] Leader ID read from device:', leaderIdn);

          if (leaderIdn === 0) {
            let ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, LEADER_ID_CHAR, candidate, 2);

            if (ret1) {
              Log.debug('New Leader ID set in device');
            } else {
              Log.debug('Unable to set new Leader ID in device:', clientId);
            }

            if (ret1) {
              let leaderIdn2 = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');

              if (leaderIdn2 === undefined) {
                Log.error('[ERROR:handleDeviceStatusUpdate] Unable to verify set Leader ID in device');
              } else {
                Log.debug('New Leader ID verification successful!', leaderIdn2);
              }

              if (leaderIdn2 === candidate) {
                removeMember(deviceStatusValue.membersJoined, value as string);
                deviceStatusValue[key] = value as string;
                topicDeviceStatus.next(deviceStatusValue);

                // The new leader calls resetAll() here which sends deviceStatusUpdate with `resetAll` key which
                // dispatches ExperimentControl struct to device with all experiment related values reset
                resetAll();
              } else {
                Log.error('[ERROR:handleDeviceStatusUpdate] Unable to verify new leader in LabHub device!', key);
              }
            } else {
              Log.error('[ERROR:handleDeviceStatusUpdate] Unable to set new leader in LabHub device!', key);
            }
          } else if (leaderIdn === undefined) {
            Log.error('[ERROR:handleDeviceStatusUpdate] Unable to read Leader Id!', leaderIdn, key);
          } else {
            Log.error('[ERROR:handleDeviceStatusUpdate] Leader slot not available! Current leader:', leaderIdn, key);
          }
        } else {
          Log.error('[ERROR:handleDeviceStatusUpdate] Invalid leader candidate:', candidate, key);
        }
      } else if (value === null && deviceStatusValue[key]) {
        const clientId = getClientId();
        if (clientId === null) {
          Log.error('[ERROR:handleDeviceStatusUpdate] Unable to get clientId:', clientId, key);
        } else {
          const leaderIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');
          let leaderId = `${leaderIdn}`;
          Log.debug('[C] Leader ID read from device:', leaderId);

          if (leaderId !== '0' && leaderId === clientId && deviceStatusValue[key] === clientId) {
            let ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, LEADER_ID_CHAR, 0, 2);
            if (ret1) {
              Log.debug('Leader ID successfully released from device');
            } else {
              Log.debug('Unable to release Leader ID from device');
            }
  
            if (ret1) {
              let leaderIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');
              if (leaderIdn === 0) {
                Log.debug('Leader ID release from device verified sucessfully');
              } else {
                Log.debug('Unable to verify Leader ID release from device');
              }
  
              if (leaderIdn === 0) {
                const clientId = deviceStatusValue[key] as string;
  
                deviceStatusValue[key] = null;
                if (clientId) addMember(deviceStatusValue.membersJoined, clientId);
    
                topicDeviceStatus.next(deviceStatusValue);  
              } else {
                Log.error('[ERROR:handleDeviceStatusUpdate] Unable to verify release of leader role, leaderIdn:', leaderIdn, key);
              }
            } else {
              Log.error('[ERROR:handleDeviceStatusUpdate] Unable to release leader role in LabHub device!', key);
            }
          } else {
            Log.error('[ERROR:handleDeviceStatusUpdate] Unexpected leaderId:', leaderId, key);
          }
        }
      }
    } else if (key === 'resetAll' || key === 'setupData' || key === 'setpointTemp') {
      if (getClientType() === 'leader') {
        const activeOperation = deviceStatusValue.operation;

        // (default) 0=stop/reset
        const timerControlN: TimerControl = activeOperation ? TimerControl.RUN : TimerControl.STOP_RESET;

        // (default) OP_IDLE (0)
        const operationN: ControlOperation = getOperationN(activeOperation || /*idle*/null);

        // (default) 1 second:
        let dataRateN = getDataRateN(deviceStatusValue.setupData.dataRate || 1);

        // (default) 0=continuous:
        let dataSampleN = getDataSampleN(deviceStatusValue.setupData.dataSample || 'cont');

        // (default) 20*C
        let heaterSetpointTempN = deviceStatusValue.setpointTemp || 20;

        if (key === 'resetAll') {
          Log.debug('resetAll dispatched by leader');
        } else if (key === 'setupData') {
          const { dataRate, dataSample } = value as SetupData;
          dataRateN = getDataRateN(dataRate);
          dataSampleN = getDataSampleN(dataSample);
        } else if (key === 'setpointTemp') {
          heaterSetpointTempN = value as number;
        } else {
          Log.error('[ERROR:handleDeviceStatusUpdate] Invalid key passed:', key);
        }

        const experimentControl: ExperimentControl = {
          timer_control: timerControlN,
          operation: operationN,        
          data_rate: dataRateN,
          num_of_samples: dataSampleN,
          heater_temp_setpoint: heaterSetpointTempN,
        };

        await dispatchExperimentControl(server, experimentControl);
      } else {
        Log.error('[ERROR:handleDeviceStatusUpdate] Must be a leader to perform this action:', getClientType(), key);
      }
    } else if (key === 'screenNumber') {
      if (getClientType() === 'leader') {
        if (typeof value === 'number') {
          const leaderStatus: LeaderStatus = { screen_number: value };
          await dispatchLeaderStatus(server, leaderStatus);
        } else {
          Log.error('[ERROR:handleDeviceStatusUpdate] Invalid screen number:', value);          
        }
      } else {
        Log.error('[ERROR:handleDeviceStatusUpdate] Must be a leader to perform this action:', getClientType(), key);
      }
    } else {
      /* Local (client-side) deviceStaus update */
      if (key === 'rgbCalibrated' || key === 'rgbConnected') {
        if (key === 'rgbCalibrated') {
          // TODO: This is client-side as of now! (till we understand how to get tick values?)
          deviceStatusValue.rgbCalibrated = value as boolean;
          topicDeviceStatus.next(deviceStatusValue);
        } else if (key === 'rgbConnected') {
          // TODO: Can we get away with rgbConnected and simulateRgb() 
          // TODO: No! Stuctural changes required!! e.g. rgbExperiment: boolean --> 'calibrate_test' | 'measure' | null
          deviceStatusValue.rgbConnected = value as RgbFuncSelect;
          topicDeviceStatus.next(deviceStatusValue);
        }
      }
    }
  }
};

// notify the BLE device when we try to run the experiment like start/stop/restart so that it will provide experiment feed with help of dispatchExperimentControl
export const handleDeviceDataFeedUpdate = async (server: BluetoothRemoteGATTServer | null, updValue: DeviceDataFeedUpdate | null) => {
  if (!deviceStatus.value) return;

  if (!server || !updValue) return;

  if (getClientType() !== 'leader') {
    return;
  }

  // const deviceStatusValue: DeviceStatus = deviceStatus.value;
  const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

  // (default) 0=stop/reset
  let timerControlN: TimerControl = TimerControl.STOP_RESET;

  // (default) OP_IDLE (0)
  let operationN: ControlOperation = getOperationN(deviceStatusValue.operation || /*idle*/null);

  // (default) 1 second:
  const dataRateN = getDataRateN(deviceStatusValue.setupData.dataRate || 1);

  // (default) 0=continuous:
  const dataSampleN = getDataSampleN(deviceStatusValue.setupData.dataSample || 'cont');

  // (default) 20*C
  const heaterSetpointTempN = deviceStatusValue.setpointTemp || 20;

  const { sensorExperiment, heaterExperiment, rgbExperiment, probe} = updValue;

  if (sensorExperiment !== undefined) {
    if (deviceStatusValue.sensorConnected === 'temperature') {
      operationN = ControlOperation.OP_MEASURE_TEMPERATURE;
    } else if (deviceStatusValue.sensorConnected === 'voltage') {
      operationN = ControlOperation.OP_MEASURE_VOLTAGE;
    }

    if (sensorExperiment === 0) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (sensorExperiment === 1) {
      timerControlN = TimerControl.RUN;
    } else if (sensorExperiment === 2) {
      timerControlN = TimerControl.RESTART;
    }
  } else if (heaterExperiment !== undefined) {
    if (!probe) { // heater element experiment
      operationN = ControlOperation.OP_HEATER_MANUAL_CONTROL;
    } else { // probe experiment
      operationN = ControlOperation.OP_HEATER_AUTO_CONTROL;
    }

    if (heaterExperiment === false) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (heaterExperiment === true) {
      timerControlN = TimerControl.RUN;
    }
  } else if (rgbExperiment !== undefined) {
    if(deviceStatusValue.rgbConnected === "calibrate") {
      operationN = ControlOperation.OP_RGB_CALIBRATE;
    }else if (deviceStatusValue.rgbConnected === 'calibrate_test') {
      operationN = ControlOperation.OP_RGB_CAL_TEST;
    } else if (deviceStatusValue.rgbConnected === 'measure') {
      operationN = ControlOperation.OP_RGB_MEASURE;
    }

    if (rgbExperiment === false) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (rgbExperiment === true) {
      timerControlN = TimerControl.RUN;
    }
  }

  const experimentControl: ExperimentControl = {
    timer_control: timerControlN,
    operation: operationN,        
    data_rate: dataRateN,
    num_of_samples: dataSampleN,
    heater_temp_setpoint: heaterSetpointTempN, 
  };

  await dispatchExperimentControl(server, experimentControl);
};

// dispatch all the status and operations to the BLE device
async function dispatchExperimentControl(server: BluetoothRemoteGATTServer | null, experimentControl: ExperimentControl) {
  const { timer_control, operation, data_rate, num_of_samples, heater_temp_setpoint } = experimentControl;
  let dataRate = data_rate;

  // TODO: Tempporary hack to handle device bug!
  // if (dataRate === 0) dataRate = 1;

  Log.debug('experimentControl:', experimentControl);

  const a1 = getByteArray(timer_control);
  const a2 = getByteArray(operation);

  const b1 = getByteArray(dataRate, 2);
  const b2 = getByteArray(num_of_samples, 2);
  const b3 = getByteArray(heater_temp_setpoint * 100, 2);
  // const b3 = getByteArray(heater_temp_setpoint, 2); // changed on 21-07-23

  let success = false;
  const controlStruct: ArrayBuffer | null = getArrayBuffer(a1, a2, b1, b2, b3);
  if (controlStruct !== null) {
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, EXPERIMENT_CONTROL_CHAR, controlStruct);
    if (ret1) {
      Log.debug('Experiment control struct sent to device!');
      success = true;
    } else {
      Log.error('[ERROR:dispatchExperimentControl] Unable to write to experiment control characteristic');
    }
  } else {
    Log.error('[ERROR:dispatchExperimentControl] Unable to create control struct:', [!!a1, !!a2, !!b1, !!b2, !!b3]);
  }

  if (!success) {
    applicationMessage.next('Unable to dispatch experiment control message.');
  }
}

// update the leader navigation(screen numbers) in to the labhub device for members sync
async function dispatchLeaderStatus(server: BluetoothRemoteGATTServer | null, leaderStatus: LeaderStatus) {
  const { screen_number } = leaderStatus;

  const a1 = getByteArray(screen_number, 2);

  const leaderStatusStruct: ArrayBuffer | null = getArrayBuffer(a1);
  if (leaderStatusStruct !== null) {
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, LEADER_STATUS_CHAR, leaderStatusStruct);
    if (ret1) {
      Log.debug('leaderStatus (screen_number) dispatched to device:', screen_number);
    } else {
      Log.error('[ERROR:dispatchLeaderStatus] Unable to write to leader status characteristic:', screen_number);
    }
  } else {
    Log.error('[ERROR:dispatchLeaderStatus] Unable to create leader status struct:', [!!a1], screen_number);
  }
}

/**
 * get the experiment(graph) log data or members that joins later
 * @param server  BLE charasctistic values
 * @param reqValue index number for logdata
 * @returns return the experiment log data upto provided index number
 */
export const handleClientChannelRequest = async (server: BluetoothRemoteGATTServer | null, reqValue: ClientChannelRequest | null) => {
  if (!deviceStatus.value) return;

  if (!server || !reqValue) return;

  // const deviceStatusValue: DeviceStatus = deviceStatus.value;
  const deviceStatusValue: DeviceStatus = getDeviceStatusValue();

  const { requestId, temperatureIndex, voltageIndex, getScreenNumber } = reqValue;

  const clientChannelResp: ClientChannelResponse = {
    requestId,
    temperatureLog: null,
    voltageLog: null,
    screenNumber: null,
  };
  if (typeof temperatureIndex === 'number' && temperatureIndex >= 0 && deviceStatusValue.sensorConnected === 'temperature') {
    const temperatureLog = await getDataSeries(server, temperatureIndex);
    if (temperatureLog === null) {
      clientChannelResp.temperatureLog = temperatureLog;
    } else {
      clientChannelResp.temperatureLog = temperatureLog.map(v => {
        return Math.round(v / 100);  // temperature is C * 100, not C
      });
    }
    if (temperatureLog) Log.debug('temperatureLog fetched for clientChannel Response:', temperatureLog);
  } else if (typeof voltageIndex === 'number' && voltageIndex >= 0 && deviceStatusValue.sensorConnected === 'voltage') {
    const voltageLog = await getDataSeries(server, voltageIndex);
    clientChannelResp.voltageLog = voltageLog;
    if (voltageLog) Log.debug('voltageLog fetched for clientChannel Response:', voltageLog);
  } else if (getScreenNumber === true) {
    const screenNumber = await getLeaderScreen(server);
    clientChannelResp.screenNumber = screenNumber;
    if (screenNumber !== null) Log.debug('screenNumber fetched for clientChannel Response:', screenNumber);
  }

  clientChannelResponse.next(clientChannelResp);
};

// get the series data(log data) for the temp/voltage experiments
async function getDataSeries(server: BluetoothRemoteGATTServer | null, count: number) {
  const reqCount = Math.ceil(count / 10);
  let dataArray: (number | null)[] = [];

  for (let i = 0; i < reqCount; i++) {
    const startIndex = i * 10;
    const partialArray = await getDataSeriesPartial(server, startIndex);
    if (partialArray === null) {
      Log.error('[ERROR:getDataSeries] Error reading partial data series from index:', startIndex);
      return null;
    }
    dataArray.push(...partialArray);
  }

  dataArray = dataArray.slice(0, count);
  const isSomeNull = dataArray.some(v => v === null);
  if (isSomeNull) {
    Log.error('[ERROR:getDataSeries] Invalid data series read from device:', reqCount, count, dataArray);
    return null;
  }

  Log.debug('Data series read from device:', reqCount, count);
  return dataArray as number[];
}

// help getting the log data for temp/voltage experinents with getDataSeries
async function getDataSeriesPartial(server: BluetoothRemoteGATTServer | null, startIndex: number) {
  const a1 = getByteArray(startIndex, 2);
  const a2 = getByteArray(null, 2, 10);

  const dataSeriesStruct: ArrayBuffer | null = getArrayBuffer(a1, a2);
  if (dataSeriesStruct !== null) {
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, EXPERIMENT_DATA_SERIES_CHAR, dataSeriesStruct);
    if (ret1) {
      const dataSeriesBuffer = await readCharacteristicValue<ArrayBuffer>(server, LABHUB_SERVICE, EXPERIMENT_DATA_SERIES_CHAR, 'buffer');
      if (dataSeriesBuffer && dataSeriesBuffer.byteLength === 22) {
        const dataSeriesView = new DataView(dataSeriesBuffer);

        const index = getValueFromDataView(dataSeriesView, 'int16', 0) as number;
        const data0 = getValueFromDataView(dataSeriesView, 'int16', 2) as number;
        const data1 = getValueFromDataView(dataSeriesView, 'int16', 4) as number;
        const data2 = getValueFromDataView(dataSeriesView, 'int16', 6) as number;
        const data3 = getValueFromDataView(dataSeriesView, 'int16', 8) as number;
        const data4 = getValueFromDataView(dataSeriesView, 'int16', 10) as number;
        const data5 = getValueFromDataView(dataSeriesView, 'int16', 12) as number;
        const data6 = getValueFromDataView(dataSeriesView, 'int16', 14) as number;
        const data7 = getValueFromDataView(dataSeriesView, 'int16', 16) as number;
        const data8 = getValueFromDataView(dataSeriesView, 'int16', 18) as number;
        const data9 = getValueFromDataView(dataSeriesView, 'int16', 20) as number;

        const data0x = (data0 & 0xffff) === 0xffff ? null : data0;
        const data1x = (data1 & 0xffff) === 0xffff ? null : data1;
        const data2x = (data2 & 0xffff) === 0xffff ? null : data2;
        const data3x = (data3 & 0xffff) === 0xffff ? null : data3;
        const data4x = (data4 & 0xffff) === 0xffff ? null : data4;
        const data5x = (data5 & 0xffff) === 0xffff ? null : data5;
        const data6x = (data6 & 0xffff) === 0xffff ? null : data6;
        const data7x = (data7 & 0xffff) === 0xffff ? null : data7;
        const data8x = (data8 & 0xffff) === 0xffff ? null : data8;
        const data9x = (data9 & 0xffff) === 0xffff ? null : data9;

        if (index !== startIndex) {
          Log.warn('Unexpected! Data series requested and received sample index not same:', startIndex, index);
        }

        Log.debug('Partial data series read from device..');
        return [data0x, data1x, data2x, data3x, data4x, data5x, data6x, data7x, data8x, data9x];
      } else {
        Log.error('[ERROR:getDataSeriesPartial] Unable to read data series characteristic');
      }
    } else {
      Log.error('[ERROR:getDataSeriesPartial] Unable to write to data series characteristic');
    }
  } else {
    Log.error('[ERROR:getDataSeriesPartial] Unable to create data series struct:', [!!a1, !!a2]);
  }

  return null;
};

// get the leader screen number to sync for members screen
async function getLeaderScreen(server: BluetoothRemoteGATTServer | null): Promise<number | null> {
  const screenNumber = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_STATUS_CHAR, 'int16');
  if (screenNumber === undefined) {
    Log.error('[ERROR:getLeaderScreen] Unable to read leader status characteristic');
    return null;
  }

  Log.debug('leaderStatus (screen_number) fetched from device');
  return screenNumber;
}
