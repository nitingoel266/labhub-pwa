import { LABHUB_CLIENT_ID } from '../utils/const';
import { deviceStatusUpdate } from './status';
import { SetupData } from '../types/common';

export const joinAsLeader = () => {
  const leaderId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (leaderId) deviceStatusUpdate.next({ leaderSelected: leaderId });
};

export const resetLeader = () => {
  deviceStatusUpdate.next({ leaderSelected: null });
};

export const joinAsMember = () => {
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (clientId) deviceStatusUpdate.next({ memberJoined: clientId });
};

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  deviceStatusUpdate.next({ modeSelected: mode });
};

export const setSelectedFunction = (func: 'data_setup' | 'sensors' | 'heater' | 'rgb_spect' | null) => {
  deviceStatusUpdate.next({ funcSelected: func });
};

export const setupData = (data?: SetupData) => {
  const setupData: SetupData = data || { dataRate: 1, dataSample: 'cont' };
  deviceStatusUpdate.next({ setupData });
};

export const resetAll = () => {
  deviceStatusUpdate.next({ resetAll: true });
};
