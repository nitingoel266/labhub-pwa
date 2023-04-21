import { deviceStatus } from './status';
import { LABHUB_CLIENT_ID } from '../utils/const';
import { ClientType } from '../types/common';
import { Log } from '../utils/utils';

export const getClientId = (): string | null => {
  const clientIdx = localStorage.getItem(LABHUB_CLIENT_ID);
  let clientId = null;
  if (clientIdx) {
    clientId = Number.parseInt(clientIdx, 10) || null; // NOTE: 0, NaN -> null
    if (!clientId) {
      Log.error('[ERROR:getClientId] Invalid clientId encountered in localStorage! [1]');
      return null;
    }
  }

  if (clientId) {
    // Validate client ID
    const uint16Array = Uint16Array.of(clientId);
    if (clientId !== uint16Array[0]) {
      Log.error('[ERROR:getClientId] Invalid clientId encountered in localStorage! [2]');
      return null;
    }  
  }
  return clientId === null ? clientId : `${clientId}`;
};

export const setClientId = (clientId?: number): string | null => {
  if (clientId === undefined) {
    // TODO: Generate a new client ID (for mock data purpose)
    // TODO: No longer needed when MOCK_TEST support is removed?
    const uint16 = Math.floor(Math.random() * (2 ** 16 - 1)) + 1; // 1-65535
    const uint16Array = Uint16Array.of(uint16);
    clientId = uint16Array[0];
    
    Log.debug('New client ID created!');
  } else {
    // Validate client ID
    const uint16Array = Uint16Array.of(clientId);
    if (clientId !== uint16Array[0]) {
      Log.error('[ERROR:setClientId] Invalid clientId passed!');
      return null;
    }

    Log.debug('Passed client ID validated!');
  }

  localStorage.setItem(LABHUB_CLIENT_ID, `${clientId}`);
  const retVal = getClientId();
  if (retVal) {
    Log.debug('LABHUB_CLIENT_ID created in localStorage');
  } else {
    Log.error('[ERROR:setClientId] Unable to retrieve set clientId from localStorage:', clientId);
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
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (clientId) {
    localStorage.removeItem(LABHUB_CLIENT_ID);
    Log.debug('LABHUB_CLIENT_ID cleaned up from localStorage');  
  }
};

export const getClientType = (): ClientType => {
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
