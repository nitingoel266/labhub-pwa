import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { DeviceStatus, DeviceStatusUpdate, DeviceDataStatusUpdate, DeviceDataFeed } from '../types/common';

export const socketConnected = new BehaviorSubject<boolean | null>(null);
export const deviceStatus = new BehaviorSubject<DeviceStatus | null>(null);
export const deviceStatusUpdate = new BehaviorSubject<DeviceStatusUpdate | null>(null);
export const deviceDataStatusUpdate = new BehaviorSubject<DeviceDataStatusUpdate | null>(null);

export const deviceDataFeed = new BehaviorSubject<DeviceDataFeed>({
  sensor: null,
  heater: null,
  rgb: null,
});

export const useSocketConnected = () => {
  const [connected, setConnected] = useState(socketConnected.value);

  useEffect(() => {
    const subs = socketConnected.subscribe(value => setConnected(value));
    return () => subs.unsubscribe();
  }, []);

  return [connected];
};

export const useDeviceStatus = () => {
  const [status, setStatus] = useState(deviceStatus.value);

  useEffect(() => {
    const subs = deviceStatus.subscribe(value => setStatus(value));
    return () => subs.unsubscribe();
  }, []);

  return [status];
};

export const useDeviceDataFeed = () => {
  const [data, setData] = useState(deviceDataFeed.value);

  useEffect(() => {
    const subs = deviceDataFeed.subscribe(value => setData(value));
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

export interface DeviceApiResponse {
  version: string;
  forceUpdate: boolean;
}
