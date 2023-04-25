import { clientChannelResponse, deviceStatus, resetStatus } from "../labhub/status";
import { clearClientId, getClientId, setClientId, getClientType } from "../labhub/utils";
import { readCharacteristicValue, writeCharacteristicValue } from "./read-write";
import { getArrayBuffer, getByteArray, getDataRateN, getDataSampleN, getOperationN } from "./device-utils";
import { initialDeviceStatus } from "./status";
import { topicDeviceStatus, resetTopics } from "./topics";
import { LABHUB_SERVICE, STUDENT_ID_CHAR, LEADER_ID_CHAR, EXPERIMENT_CONTROL_CHAR, EXPERIMENT_DATA_SERIES_CHAR, LEADER_STATUS_CHAR } from "./const";
import { MOCK_TEST } from "../utils/const";
import { DeviceDataFeedUpdate, DeviceStatus, DeviceStatusUpdate, SetupData, ClientChannelRequest, ClientChannelResponse, RgbFuncSelect } from "../types/common";
import { ControlOperation, ExperimentControl, TimerControl, LeaderStatus } from "./device-types";
import { getValueFromDataView } from "./gatt/utils";
import { resetAll } from "../labhub/actions";
import { Log } from "../utils/utils";

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

function removeMember(membersList: string[], clientId: string) {
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

function addMember(membersList: string[], clientId: string) {
  if (!membersList.includes(clientId as string)) {
    membersList.push(clientId);
  } else {
    Log.warn('[WARN] Unexpected! clientId already exists in membersJoined list.');
  }
}
  
export const requestClientId = async (server: BluetoothRemoteGATTServer, connectionReuse = false) => {
  let clientId = connectionReuse ? getClientId() : null;
  if (!clientId) {
    if (connectionReuse) {
      Log.warn('Unexpected! clientId should already exist in case of connection reuse.');
    }

    // TODO: readCharacteristicValue first to see that clientId is 0??
    // TODO: what happens when 0 clientId is written to existing acive connection??
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, STUDENT_ID_CHAR, 0, 2);
    if (ret1) {
      const clientIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, STUDENT_ID_CHAR, 'int16');
      if (clientIdn) {
        clientId = setClientId(clientIdn);
        Log.debug('New clientId requested successfully!');
      } else {
        Log.error('[ERROR:requestClientId] Unable to get new Student ID from LabHub device [2]');
      }
    } else {
      Log.error('[ERROR:requestClientId] Unable to get new Student ID from LabHub device [1]');
    }
  } else {
    Log.log('Reusing existing/stored clientId!');
  }

  if (!clientId && MOCK_TEST) {
    Log.debug('Using mock clientId!');
    clientId = setClientId();
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

export const disconnectClient = async (server: BluetoothRemoteGATTServer) => {
  const clientId = getClientId();
  if (clientId) {
    const clientIdn = Number.parseInt(clientId, 10);
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, STUDENT_ID_CHAR, clientIdn, 2);

    if (ret1) {
      Log.debug('Client disconnect successful!');
    } else {
      Log.error('[ERROR:disconnectClient] Unable to disconnect client from LabHub device');
      return;
    }
  }
};

export const resetClient = (softReset = false) => {
  resetTopics();
  resetStatus();

  if (softReset) {
    Log.debug('Client (soft) reset complete!');
  } else {
    clearClientId();
    Log.debug('Client reset complete!');
  }
};

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
          if (leaderIdn === undefined && MOCK_TEST) {
            leaderIdn = 0;
          }

          if (leaderIdn === 0) {
            let ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, LEADER_ID_CHAR, candidate, 2);

            if (ret1) {
              Log.debug('New Leader ID set in device');
            } else {
              Log.debug('Unable to set new Leader ID in device');
            }
            if (!ret1 && MOCK_TEST) {
              ret1 = true;
            }

            if (ret1) {
              let leaderIdn2 = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');

              if (leaderIdn2 === undefined) {
                Log.debug('Unable to verify set Leader ID in device');
              } else {
                Log.debug('New Leader ID verification successful!', leaderIdn2);
              }
              if (leaderIdn2 === undefined && MOCK_TEST) {
                leaderIdn2 = candidate;
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
  
          if (leaderIdn === undefined && MOCK_TEST) {
            leaderId = clientId;
          }
  
          if (leaderId !== '0' && leaderId === clientId && deviceStatusValue[key] === clientId) {
            let ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, LEADER_ID_CHAR, 0, 2);
            if (ret1) {
              Log.debug('Leader ID successfully released from device');
            } else {
              Log.debug('Unable to release Leader ID from device');
            }

            if (!ret1 && MOCK_TEST) {
              ret1 = true;
            }
  
            if (ret1) {
              let leaderIdn = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_ID_CHAR, 'int16');
              if (leaderIdn === 0) {
                Log.debug('Leader ID release from device verified sucessfully');
              } else {
                Log.debug('Unable to verify Leader ID release from device');
              }

              if (leaderIdn === undefined && MOCK_TEST) {
                leaderIdn = 0;
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
        // (default) 0=stop/reset
        const timerControlN: TimerControl = TimerControl.STOP_RESET;

        // (default) OP_IDLE (0)
        const operationN: ControlOperation = getOperationN(deviceStatusValue.operation || /*idle*/null);

        // (default) 1 second:
        let dataRateN = getDataRateN(deviceStatusValue.setupData.dataRate || 1);

        // (default) 0=continuous:
        let dataSampleN = getDataSampleN(deviceStatusValue.setupData.dataSample || 'cont');

        // (default) 20*C
        let heaterSetpointTempN = deviceStatusValue.setpointTemp || 20;

        if (key === 'resetAll') {
          // TODO:check-reset?already-done?:Leader dispatches ExperimentControl struct to device with all experiment related values reset
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
          heater_temp_setpoint: heaterSetpointTempN * 100,
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
          // TODO1: Can we get away with rgbConnected and simulateRgb() 
          // TODO2: I don't think so! Stuctural changes required!! e.g. rgbExperiment: boolean --> 'calibrate_test' | 'measure' | null
          deviceStatusValue.rgbConnected = value as RgbFuncSelect;
          topicDeviceStatus.next(deviceStatusValue);
        }
      }
    }
  }
};

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

  const { sensorExperiment, heaterExperiment, rgbExperiment } = updValue;

  if (sensorExperiment !== undefined) {
    if (deviceStatusValue.sensorConnected === 'temperature') {
      operationN = ControlOperation.OP_MEASURE_TEMPERATURE;
    } else if (deviceStatusValue.sensorConnected === 'voltage') {
      operationN = ControlOperation.OP_MEASURE_VOLTAGE;
    }

    if (sensorExperiment === false) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (sensorExperiment === true) {
      // TODO?: Handle value 2 (TimerControl.RESTART)
      timerControlN = TimerControl.RUN;
    }
  } else if (heaterExperiment !== undefined) {
    if (deviceStatusValue.heaterConnected === 'probe') {
      operationN = ControlOperation.OP_HEATER_MANUAL_CONTROL;
    }
    // TODO?: How to differentiate b/w 'element' and 'probe'
    // else if (deviceStatusValue.heaterConnected === 'element') {
    //   operationN = ControlOperation.OP_HEATER_MANUAL_CONTROL;
    // }

    if (heaterExperiment === false) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (heaterExperiment === true) {
      // TODO?: Handle value 2 (TimerControl.RESTART)
      timerControlN = TimerControl.RUN;
    }
  } else if (rgbExperiment !== undefined) {
    if (deviceStatusValue.rgbConnected === 'calibrate_test') {
      operationN = ControlOperation.OP_RGB_CALIBRATE;
    } else if (deviceStatusValue.rgbConnected === 'measure') {
      operationN = ControlOperation.OP_RGB_MEASURE;
    }

    if (rgbExperiment === false) {
      timerControlN = TimerControl.STOP_RESET;
    } else if (rgbExperiment === true) {
      // TODO?: Handle value 2 (TimerControl.RESTART)
      timerControlN = TimerControl.RUN;
    }
  }

  const experimentControl: ExperimentControl = {
    timer_control: timerControlN,
    operation: operationN,        
    data_rate: dataRateN,
    num_of_samples: dataSampleN,
    heater_temp_setpoint: heaterSetpointTempN * 100,
  };

  await dispatchExperimentControl(server, experimentControl);
};

async function dispatchExperimentControl(server: BluetoothRemoteGATTServer | null, experimentControl: ExperimentControl) {
  const { timer_control, operation, data_rate, num_of_samples, heater_temp_setpoint } = experimentControl;

  const a1 = getByteArray(timer_control);
  const a2 = getByteArray(operation);

  const b1 = getByteArray(data_rate, 2);
  const b2 = getByteArray(num_of_samples, 2);
  const b3 = getByteArray(heater_temp_setpoint, 2);

  const controlStruct: ArrayBuffer | null = getArrayBuffer(a1, a2, b1, b2, b3);
  if (controlStruct !== null) {
    const ret1 = await writeCharacteristicValue(server, LABHUB_SERVICE, EXPERIMENT_CONTROL_CHAR, controlStruct);
    if (ret1) {
      Log.debug('Experiment control struct sent to device!');
    } else {
      Log.error('[ERROR:dispatchExperimentControl] Unable to write to experiment control characteristic');
    }
  } else {
    Log.error('[ERROR:dispatchExperimentControl] Unable to create control struct:', [!!a1, !!a2, !!b1, !!b2, !!b3]);
  }
}

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
    clientChannelResp.temperatureLog = temperatureLog;
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

        // const index = getValueFromDataView(dataSeriesView, 'int16', 0) as number;
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

async function getLeaderScreen(server: BluetoothRemoteGATTServer | null): Promise<number | null> {
  const screenNumber = await readCharacteristicValue<number>(server, LABHUB_SERVICE, LEADER_STATUS_CHAR, 'int16');
  if (screenNumber === undefined) {
    Log.error('[ERROR:getLeaderScreen] Unable to read leader status characteristic');
    return null;
  }

  Log.debug('leaderStatus (screen_number) fetched from device');
  return screenNumber;
}
