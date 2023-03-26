import { deviceStatus, deviceStatusUpdate, deviceDataFeedUpdate } from './status';
import { getClientId, getClientType } from './utils';
import { SensorSelect, SetupData, HeaterSelect, RgbFuncSelect } from '../types/common';

export const joinAsLeader = () => {
  const clientId = getClientId();
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (!clientId || leaderSelected || getClientType() !== 'member') {
    console.warn("Can't join as leader. clientType:", getClientType());
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
  if (getClientType() !== 'leader') return;
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

export const startHeaterExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ heaterExperiment: true });
};

export const stopHeaterExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ heaterExperiment: false });
};

export const startRgbExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataFeedUpdate.next({ rgbExperiment: true });
};
