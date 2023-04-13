import short from 'short-uuid';
import { clientChannelRequest, clientChannelResponse } from './status';
import { navStatusUpdate } from './status-client';
import { ClientChannelRequest, ClientChannelResponse } from '../types/common';

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  navStatusUpdate.next({ modeSelected: mode });
};

export const setSelectedFunction = (func: 'data_setup' | 'sensor' | 'heater' | 'rgb_spect' | null) => {
  navStatusUpdate.next({ funcSelected: func });
};

const doClientAction = async (reqValue: ClientChannelRequest) => {
  let channelResp: ClientChannelResponse | null = null;

  const { requestId, temperatureIndex, voltageIndex, getScreenNumber } = reqValue;

  try {
    if (temperatureIndex !== undefined) {
      clientChannelRequest.next({ requestId, temperatureIndex });
    } else if (voltageIndex !== undefined) {
      clientChannelRequest.next({ requestId, voltageIndex });
    } else if (getScreenNumber === true) {
      clientChannelRequest.next({ requestId, getScreenNumber });
    } else {
      return Promise.reject(`Client action type missing! ${JSON.stringify(reqValue)}`);
    }
  
    channelResp = await new Promise((resolve, reject) => {
      let timeout: NodeJS.Timeout;
      const subs = clientChannelResponse.subscribe((value) => {  
        if (value && value.requestId === requestId) {
          if (timeout !== undefined) clearTimeout(timeout);
          subs.unsubscribe();
          resolve(value);
        }
      });
      timeout = setTimeout(() => {
        subs.unsubscribe();
        reject('clientChannelRequest timeout!');
      }, 10000);
    });
  } catch (e) {
    console.error(e);
  }

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
  return channelResp?.voltageLog ?? null;
};

export const getScreenNumber = async () => {
  const requestId = short.generate();
  const channelResp = await doClientAction({ requestId, getScreenNumber: true });
  return channelResp?.screenNumber ?? null;
};
