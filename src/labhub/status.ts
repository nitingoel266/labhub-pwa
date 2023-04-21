import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { DeviceStatus, DeviceStatusUpdate, DeviceDataFeed, DeviceDataFeedUpdate, ClientChannelRequest, ClientChannelResponse } from '../types/common';

export const connectionAttemptOngoing = new BehaviorSubject<boolean>(false);
export const applicationErrorMessage = new BehaviorSubject<string | null>(null);
export const deviceConnected = new BehaviorSubject<boolean>(false);
export const deviceStatus = new BehaviorSubject<DeviceStatus | null>(null);
export const deviceStatusUpdate = new BehaviorSubject<DeviceStatusUpdate | null>(null);
export const deviceDataFeedUpdate = new BehaviorSubject<DeviceDataFeedUpdate | null>(null);
export const clientChannelResponse = new BehaviorSubject<ClientChannelResponse | null>(null);
export const clientChannelRequest = new BehaviorSubject<ClientChannelRequest | null>(null);

export const deviceDataFeed = new BehaviorSubject<DeviceDataFeed>({
  sensor: null,
  heater: null,
  rgb: null,
});

export const useDeviceConnected = () => {
  const [connected, setConnected] = useState(deviceConnected.value);

  useEffect(() => {
    const subs = deviceConnected.subscribe((value) => setConnected(value));
    return () => subs.unsubscribe();
  }, []);

  return [connected];
};

export const useDeviceStatus = () => {
  const [status, setStatus] = useState(deviceStatus.value);

  useEffect(() => {
    const subs = deviceStatus.subscribe(value => setStatus(value === null ? null : {...value}));
    return () => subs.unsubscribe();
  }, []);

  return [status];
};

export const useDeviceDataFeed = () => {
  const [data, setData] = useState(deviceDataFeed.value);

  useEffect(() => {
    const subs = deviceDataFeed.subscribe(value => setData({...value}));
    return () => subs.unsubscribe();
  }, []);

  return [data];
};

export const getDeviceApiResponse = (): DeviceApiResponse => {
  return {
    version: '2.11',
    forceUpdate: false,
  };
};

export const useConnectionStablished = () => {
  const [connected, setConnected] = useState(connectionAttemptOngoing.value);

  useEffect(() => {
    const subs = connectionAttemptOngoing.subscribe((value) => setConnected(value));
    return () => subs.unsubscribe();
  }, []);

  return [connected];
};
export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState(applicationErrorMessage.value);

  useEffect(() => {
    const subs = applicationErrorMessage.subscribe((value) => setErrorMessage(value));
    return () => subs.unsubscribe();
  }, []);

  return [errorMessage];
};
export interface DeviceApiResponse {
  version: string;
  forceUpdate: boolean;
}
