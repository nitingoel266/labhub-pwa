import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { DeviceStatus, DeviceStatusUpdate, DeviceDataFeed, DeviceDataFeedUpdate, ClientChannelRequest, ClientChannelResponse } from '../types/common';

export const deviceStatusUpdate = new BehaviorSubject<DeviceStatusUpdate | null>(null);
export const deviceDataFeedUpdate = new BehaviorSubject<DeviceDataFeedUpdate | null>(null);
export const clientChannelResponse = new BehaviorSubject<ClientChannelResponse | null>(null);
export const clientChannelRequest = new BehaviorSubject<ClientChannelRequest | null>(null);

export const connectionAttemptOngoing = new BehaviorSubject<boolean>(false);
export const applicationMessage = new BehaviorSubject<string | AppMessageInfo | null>(null);
export const pwaInstallPromotion = new BehaviorSubject<boolean>(false);
export const swInstallStatus = new BehaviorSubject<'success' | 'error' | 'offline' | null | undefined>(undefined);
export const swPendingUpdate = new BehaviorSubject<boolean>(false);
export const deviceConnected = new BehaviorSubject<boolean>(false);
export const deviceStatus = new BehaviorSubject<DeviceStatus | null>(null);
export const deviceDataFeed = new BehaviorSubject<DeviceDataFeed>({
  sensor: null,
  heater: null,
  rgb: null,
});

const getValueHook = <T>(behaviorSubject: BehaviorSubject<any>) => () => {
  const [value, setValue] = useState(behaviorSubject.value);

  useEffect(() => {
    const subs = behaviorSubject.subscribe((value) => setValue(value));
    return () => subs.unsubscribe();
  }, []);

  return [value as T];
};

export const useDeviceConnected = getValueHook<boolean>(deviceConnected);
export const useDeviceStatus = getValueHook<DeviceStatus | null>(deviceStatus);
export const useDeviceDataFeed = getValueHook<DeviceDataFeed>(deviceDataFeed);
export const useConnectionStablished = getValueHook<boolean>(connectionAttemptOngoing);
export const usePwaInstallPromotion = getValueHook<boolean>(pwaInstallPromotion);
export const useSwInstallStatus = getValueHook<'success' | 'error' | 'offline' | null | undefined>(swInstallStatus);
export const useSwPendingUpdate = getValueHook<boolean>(swPendingUpdate);

export const useAppMessage = () => {
  const [value, setValue] = useState<AppMessageInfo | null>(() => assertAppMessage(applicationMessage.value));

  useEffect(() => {
    const subs = applicationMessage.subscribe((value) => setValue(assertAppMessage(value)));
    return () => subs.unsubscribe();
  }, []);

  return [value];
};

function assertAppMessage(value: string | AppMessageInfo | null) {
  if (typeof value === 'string') {
    return { type: 'error', message: value } as AppMessageInfo;
  } else {
    return value;
  }
}

export const getDeviceApiResponse = (): DeviceApiResponse => {
  return {
    version: '2.11',
    forceUpdate: false,
  };
};

export interface DeviceApiResponse {
  version: string;
  forceUpdate: boolean;
}

export interface AppMessageInfo {
  type: 'info' | 'warn' | 'error';
  message: string;
}
