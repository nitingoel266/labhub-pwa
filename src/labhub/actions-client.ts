import short from 'short-uuid';
import { applicationMessage, clientChannelRequest, clientChannelResponse } from './status';
import { ClientChannelRequest, ClientChannelResponse } from '../types/common';
import { Log, roundTwoDec } from '../utils/utils';

const doClientAction = async (reqValue: ClientChannelRequest) => {
  let channelResp: ClientChannelResponse | null = null;

  const { requestId, temperatureIndex, voltageIndex, getScreenNumber } = reqValue;

  try {
    if (temperatureIndex !== undefined) {
      Log.debug('clientChannelRequest:temperatureIndex:', temperatureIndex);
      clientChannelRequest.next({ requestId, temperatureIndex });
    } else if (voltageIndex !== undefined) {
      Log.debug('clientChannelRequest:voltageIndex:', voltageIndex);
      clientChannelRequest.next({ requestId, voltageIndex });
    } else if (getScreenNumber === true) {
      Log.debug('clientChannelRequest:getScreenNumber:', getScreenNumber);
      clientChannelRequest.next({ requestId, getScreenNumber });
    } else {
      return Promise.reject(`Client action type missing! ${JSON.stringify(reqValue)}`);
    }
  
    channelResp = await new Promise((resolve, reject) => {
      let unsubscribed = false;
      const timeout = setTimeout(() => {
        subs.unsubscribe();
        unsubscribed = true;
        reject('clientChannelRequest timeout!');
      }, 10000);
      const subs = clientChannelResponse.subscribe((value) => {  
        if (value && value.requestId === requestId) {
          clearTimeout(timeout);
          resolve(value);
        }
      });
      setTimeout(() => {
        if (!unsubscribed) {
          subs.unsubscribe();
        }
      }, 10000);
    });
  } catch (e) {
    Log.error('[ERROR:doClientAction]', e);
    applicationMessage.next((e as any).message || `${e}`);
  }

  Log.debug('channelRespponse:', channelResp);
  return channelResp;
};

export const getTemperatureLog = async (temperatureIndex: number) => {
  const requestId = short.generate();
  const channelResp = await doClientAction({ requestId, temperatureIndex });
  return channelResp?.temperatureLog ?? null;
};

export const getVoltageLog = async (voltageIndex: number) => {
  const requestId = short.generate();
  const channelResp = await doClientAction({ requestId, voltageIndex });

  let voltageLog = null;
  if (channelResp?.voltageLog) {
    voltageLog = channelResp.voltageLog.map(v => roundTwoDec(v / 1000 - 12));
  }
  return voltageLog;
};

export const getTemperatureValue = async (sampleIndex: number) => {
  return (await getTemperatureLog(sampleIndex + 1) || [])[sampleIndex] || null;
};

export const getVoltageValue = async (sampleIndex: number) => {
  return (await getVoltageLog(sampleIndex + 1) || [])[sampleIndex] || null;
};

export const getScreenNumber = async () => {
  const requestId = short.generate();
  const channelResp = await doClientAction({ requestId, getScreenNumber: true });
  return channelResp?.screenNumber ?? null;
};
