import { deviceStatus } from './status';
import { LABHUB_CLIENT_ID } from '../utils/const';
import { ClientType } from '../types/common';

export const getClientId = (): string | null => {
  const clientIdx = localStorage.getItem(LABHUB_CLIENT_ID);
  let clientId = null;
  if (clientIdx) {
    clientId = Number.parseInt(clientIdx, 10) || null; // NOTE: 0, NaN -> null
    if (!clientId) {
      console.error('[ERROR] Invalid clientId encountered in localStorage! [1]');
      return null;
    }
  }

  if (clientId) {
    // Validate client ID
    const uint16Array = Uint16Array.of(clientId);
    if (clientId !== uint16Array[0]) {
      console.error('[ERROR] Invalid clientId encountered in localStorage! [2]');
      return null;
    }  
  }
  return clientId === null ? clientId : `${clientId}`;
};

const setClientId = (clientId?: number): string | null => {
  if (clientId === undefined) {
    // Generate a new client ID
    const uint16 = Math.floor(Math.random() * (2 ** 16 - 1)) + 1; // 1-65535
    const uint16Array = Uint16Array.of(uint16);
    clientId = uint16Array[0];  
  } else {
    // Validate client ID
    const uint16Array = Uint16Array.of(clientId);
    if (clientId !== uint16Array[0]) {
      console.error('[ERROR] Invalid clientId passed!');
      return null;
    }
  }

  localStorage.setItem(LABHUB_CLIENT_ID, `${clientId}`);
  const retVal = getClientId();
  if (!retVal) {
    console.error('Error retrieving set clientId from localStorage:', clientId);
  }
  return retVal;
};

export const assertClientId = (): string | null => {
  let clientId = getClientId();
  if (!clientId) {
    clientId = setClientId();
  }
  return clientId;
};

export const clearClientId = () => {
  localStorage.removeItem(LABHUB_CLIENT_ID);
};

export const getClientType =  (): ClientType => {
  const clientId = getClientId();
  if (!clientId) return null;
  const leaderSelected = deviceStatus.value?.leaderSelected;
  const membersJoined = deviceStatus.value?.membersJoined;
  if (leaderSelected === clientId) {
    return 'leader';
  } else if (membersJoined && membersJoined.includes(clientId)) {
    return 'member';
  } else {
    return null;
  }
};
