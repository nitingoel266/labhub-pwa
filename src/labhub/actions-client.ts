import short from 'short-uuid';
import { clientChannelRequest, clientChannelResponse } from './status';
import { navStatusUpdate } from './status-client';

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  navStatusUpdate.next({ modeSelected: mode });
};

export const setSelectedFunction = (func: 'data_setup' | 'sensor' | 'heater' | 'rgb_spect' | null) => {
  navStatusUpdate.next({ funcSelected: func });
};

const getSensorLog = async ({temperatureIndex, voltageIndex}: {temperatureIndex?: number, voltageIndex?: number}) => {
  let sensorLog: number[] | null = null;

  try {
    const requestId = short.generate();

    if (temperatureIndex !== undefined) {
      clientChannelRequest.next({ requestId, temperatureIndex });
    } else if (voltageIndex !== undefined) {
      clientChannelRequest.next({ requestId, voltageIndex });
    } else {
      return Promise.reject('temperatureIndex/voltageIndex missing!');
    }
  
    sensorLog = await new Promise((resolve, reject) => {
      let timeout: NodeJS.Timeout;
      const subs = clientChannelResponse.subscribe((value) => {  
        if (value && value.requestId === requestId) {
          if (timeout !== undefined) clearTimeout(timeout);
          subs.unsubscribe();
          if (temperatureIndex !== undefined) {
            resolve(value.temperatureLog);
          } else if (voltageIndex !== undefined) {
            resolve(value.voltageLog);
          }
        }
      });
      timeout = setTimeout(() => {
        subs.unsubscribe();
        reject('clientChannelRequest timeout!');
      }, 5000);
    });
  } catch (e) {
    console.error(e);
  }

  return sensorLog;
};

export const getTemperatureLog = async (temperatureIndex: number) => {
  const temperatureLog = await getSensorLog({ temperatureIndex });
  return temperatureLog;
};

export const getVoltageLog = async (voltageIndex: number) => {
  const voltageLog = await getSensorLog({ voltageIndex });
  return voltageLog;
};
