import { deviceStatus, deviceStatusUpdate, deviceDataFeedUpdate } from './status';
import { getClientId, getClientType } from './utils';
import { SensorSelect, SetupData, HeaterSelect, RgbFuncSelect } from '../types/common';
import { Log } from '../utils/utils';

export const joinAsLeader = () => {
  const clientId = getClientId();
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (!clientId || leaderSelected || getClientType() !== 'member') {
    Log.warn("Can't join as leader. clientType:", getClientType());
  } else {
    deviceStatusUpdate.next({ leaderSelected: clientId });
  }
};

export const resetLeader = () => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ leaderSelected: null });
};

// export const joinAsMember = () => {
//   const leaderSelected = deviceStatus.value?.leaderSelected;
//   if (!leaderSelected || getClientType() !== null) return;
//   const clientId = getClientId();
//   if (clientId) deviceStatusUpdate.next({ memberJoined: clientId });
// };

// export const unjoinMember = () => {
//   if (getClientType() !== 'member') return;
//   const clientId = getClientId();
//   if (clientId) deviceStatusUpdate.next({ memberUnjoin: clientId });
// };

export const setupData = (data?: SetupData) => {
  if (getClientType() !== 'leader') return;
  const setupData: SetupData = data || { dataRate: 1, dataSample: 'cont' };
  deviceStatusUpdate.next({ setupData });
};

export const resetAll = () => {
  // NOTE: resetAll() must be called only by leader,
  // that too when the client first acquires leader role
  // if (getClientType() !== 'leader') return;  // disabled due to possible race condition
  deviceStatusUpdate.next({ resetAll: true });
};

export const simulateSensor = (sensor: SensorSelect) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ sensorConnected: sensor });
};

export const changeSetpointTemp = (temp: number) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ setpointTemp: temp });
};

export const simulateHeater = (device: HeaterSelect) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ heaterConnected: device });
};

export const calibrateRgb = () => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ rgbCalibrated: true });
};

export const simulateRgb = (select: RgbFuncSelect) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ rgbConnected: select });
};

export const startSensorExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ sensorExperiment: true });
};

export const stopSensorExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ sensorExperiment: false });
};

export const startHeaterExperiment = (probe = false) => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ heaterExperiment: true, probe });
};

export const stopHeaterExperiment = (probe = false) => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ heaterExperiment: false, probe });
};

export const startRgbExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ rgbExperiment: true });
};

export const stopRgbExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ rgbExperiment: false });
};

export const setScreenNumber = (screenNumber: number) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ screenNumber });
};
