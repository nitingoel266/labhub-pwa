import { BehaviorSubject } from 'rxjs';

const initialDeviceStatus: DeviceStatus = {
  deviceName: 'LabHub',
  deviceVersion: '2.10',
  batteryLevel: 75,
  leaderSelected: null,
  membersRegistered: [],
  modeSelected: null,
  functionSelected: null,
};

export const deviceStatus = new BehaviorSubject<DeviceStatus>(initialDeviceStatus);

export const getStatus = (): DeviceStatus => {
  return deviceStatus.value;
};

export const setLeader = (leaderId: string) => {
  deviceStatus.next({ ...deviceStatus.value, leaderSelected: leaderId });
};

export const setSelectedMode = (mode: 'manual' | 'project') => {
  deviceStatus.next({ ...deviceStatus.value, modeSelected: mode });
};

export const setSelectedFunction = (func: string) => {
  deviceStatus.next({ ...deviceStatus.value, functionSelected: func });
};

export const getDeviceApiResponse = (): DeviceApiResponse => {
  return {
    version: '2.10',
    forceUpdate: false,
  };
};

export interface DeviceStatus {
  deviceName: string;
  deviceVersion: string;
  batteryLevel: number;  // in percentage
  leaderSelected: string | null;  // leader ID
  membersRegistered: string[];
  modeSelected: 'manual' | 'project' | null;
  functionSelected: string | null;
}

export interface DeviceApiResponse {
  version: string;
  forceUpdate: boolean;
}
