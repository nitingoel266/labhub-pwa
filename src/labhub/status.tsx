import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { DeviceStatus, DeviceStatusUpdate } from '../types/common';

export const deviceStatus = new BehaviorSubject<DeviceStatus | null>(null);
export const deviceStatusUpdate = new BehaviorSubject<DeviceStatusUpdate | null>(null);

export const useDeviceStatus = () => {
  const [status, setStatus] = useState(deviceStatus.value);

  useEffect(() => {
    const subs = deviceStatus.subscribe(value => setStatus(value));
    return () => subs.unsubscribe();
  }, []);

  return [status];
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
