import { Subscription } from 'rxjs';
import { Socket } from 'socket.io-client';
import short from 'short-uuid';
import { deviceStatus, deviceStatusUpdate, deviceDataStream, deviceDataStatusUpdate } from './status';
import { DeviceDataStream, DeviceStatus } from '../types/common';
import { TOPIC_DEVICE_STATUS, TOPIC_DEVICE_STATUS_UPDATE, LABHUB_CLIENT_ID, TOPIC_DEVICE_DATA_STREAM, TOPIC_DEVICE_DATA_STATUS_UPDATE } from '../utils/const';

export const initSetup = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  socket.on(TOPIC_DEVICE_STATUS, (value: DeviceStatus) => {
    deviceStatus.next(value);
  });

  socket.on(TOPIC_DEVICE_DATA_STREAM, (value: DeviceDataStream | null) => {
    deviceDataStream.next(value);
  });

  const subs1 = deviceStatusUpdate.subscribe((value) => {
    if (value) {
      socket.emit(TOPIC_DEVICE_STATUS_UPDATE, value);
    }
  });

  const subs2 = deviceDataStatusUpdate.subscribe((value) => {
    if (value) {
      socket.emit(TOPIC_DEVICE_DATA_STATUS_UPDATE, value);
    }
  });

  const labhubClientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (!labhubClientId) {
    localStorage.setItem(LABHUB_CLIENT_ID, short.generate());
  }

  return [subs1, subs2];
};

export const uninitSetup = (socket: Socket<DefaultEventsMap, DefaultEventsMap>, subs1: Subscription, subs2: Subscription) => {
  subs1.unsubscribe();
  subs2.unsubscribe();
  socket.disconnect();
};

export type DefaultEventsMap = any;
