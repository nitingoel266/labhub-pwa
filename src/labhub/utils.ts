import short from 'short-uuid';
import { deviceStatus } from './status';
import { LABHUB_CLIENT_ID } from '../utils/const';
import { ClientType } from '../types/common';

export const getClientId = () => {
  return localStorage.getItem(LABHUB_CLIENT_ID);
};

export const assertClientId = () => {
  let clientId = getClientId();
  if (!clientId) {
    clientId = short.generate();
    localStorage.setItem(LABHUB_CLIENT_ID, clientId);
  }
  return getClientId();
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
