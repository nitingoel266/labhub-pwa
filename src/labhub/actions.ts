import { deviceStatus, deviceStatusUpdate, deviceDataStatusUpdate } from './status';
import { getClientId, getClientType } from './utils';
import { SensorSelect, SetupData } from '../types/common';

export const joinAsLeader = () => {
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (leaderSelected || getClientType() !== null) return;
  const clientId = getClientId();
  if (clientId) deviceStatusUpdate.next({ leaderSelected: clientId });
};

export const resetLeader = () => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ leaderSelected: null });
};

export const joinAsMember = () => {
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (!leaderSelected || getClientType() !== null) return;
  const clientId = getClientId();
  if (clientId) deviceStatusUpdate.next({ memberJoined: clientId });
};

export const unjoinMember = () => {
  if (getClientType() !== 'member') return;
  const clientId = getClientId();
  if (clientId) deviceStatusUpdate.next({ memberUnjoin: clientId });
};

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

export const startSensorExperiment = () => {
  if (getClientType() !== 'leader') return;
  deviceDataStatusUpdate.next({ sensorExperiment: true });
};
