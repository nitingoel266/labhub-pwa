import { LABHUB_CLIENT_ID } from '../utils/const';
import { deviceStatus, deviceStatusUpdate, deviceDataStatusUpdate } from './status';
import { SensorSelect, SetupData, ClientType } from '../types/common';

export const getClientType =  (): ClientType => {
  const leaderSelected = deviceStatus.value?.leaderSelected;
  const membersJoined = deviceStatus.value?.membersJoined;
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (leaderSelected && clientId) {
    if (leaderSelected === clientId) {
      return 'leader';
    } else if (membersJoined && membersJoined.includes(clientId)) {
      return 'member';
    }
  }
  return null;
};

export const joinAsLeader = () => {
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (leaderSelected || getClientType() !== null) return;
  const leaderId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (leaderId) deviceStatusUpdate.next({ leaderSelected: leaderId });
};

export const resetLeader = () => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ leaderSelected: null });
};

export const joinAsMember = () => {
  const leaderSelected = deviceStatus.value?.leaderSelected;
  if (!leaderSelected || getClientType() !== null) return;
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (clientId) deviceStatusUpdate.next({ memberJoined: clientId });
};

export const unjoinMember = () => {
  if (getClientType() !== 'member') return;
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (clientId) deviceStatusUpdate.next({ memberUnjoin: clientId });
};

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ modeSelected: mode });
};

export const setSelectedFunction = (func: 'data_setup' | 'sensors' | 'heater' | 'rgb_spect' | null) => {
  if (getClientType() !== 'leader') return;
  deviceStatusUpdate.next({ funcSelected: func });
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
