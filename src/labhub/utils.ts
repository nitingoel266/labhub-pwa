import { deviceStatus } from './status';
import { ClientType } from '../types/common';
import { Log } from '../utils/utils';

let clientIdStore: string | null = null;

export const getClientId = (): string | null => {
  const clientIdx = clientIdStore;
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
  if (clientId) {
    // Validate client ID
    const uint16Array = Uint16Array.of(clientId);
    if (clientId !== uint16Array[0]) {
      Log.error('[ERROR:setClientId] Invalid clientId passed!');
      return null;
    }

    Log.debug('Passed client ID validated!');
  } else if (clientId === undefined) {
    // Generate a new client ID (for mock data purpose)
    const uint16 = Math.floor(Math.random() * (2 ** 16 - 1)) + 1; // 1-65535
    const uint16Array = Uint16Array.of(uint16);
    clientId = uint16Array[0];
    
    Log.debug('New client ID created (for mock data)!');
  } else {
    Log.error('[ERROR:setClientId] Invalid clientId passed:', clientId);
  }

  if (!clientId) {
    return null;
  }

  clientIdStore = `${clientId}`;

  return clientIdStore;
};

export const assertClientId = (): string | null => {
  let clientId = getClientId();
  if (!clientId) {
    clientId = setClientId();
  }
  return clientId;
};

export const clearClientId = () => {
  clientIdStore = null;
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
