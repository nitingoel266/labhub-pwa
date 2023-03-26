import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { deviceConnected, deviceStatus, deviceStatusUpdate, deviceDataFeed, deviceDataFeedUpdate } from './status';
import { DeviceStatus, DeviceDataFeed } from '../types/common';
import { TOPIC_DEVICE_STATUS, TOPIC_DEVICE_STATUS_UPDATE, TOPIC_DEVICE_DATA_FEED, TOPIC_DEVICE_DATA_FEED_UPDATE } from '../utils/const';
import { getClientId } from './utils';
import { navStatus, navStatusUpdate } from './status-client';
import { delay } from '../utils/utils';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let subs1: Subscription;
let subs2: Subscription;

let clientSubs1: Subscription;

export const initSetup = async (): Promise<boolean> => {
  const clientId = getClientId();
  if (!clientId) return false;

  // simulate delay
  await delay(500);
 
  socket = io('http://localhost:4000', { query: { clientId } });

  socket.on('connect', () => {
    // console.log(socket.connected, socket.id);
    deviceConnected.next(true);
  });
  socket.on('disconnect', (reason) => {
    // console.log('disconnected:', reason);
    deviceConnected.next(false);
  });

  socket.on(TOPIC_DEVICE_STATUS, (value: DeviceStatus) => {
    deviceStatus.next(value);
  });

  socket.on(TOPIC_DEVICE_DATA_FEED, (value: DeviceDataFeed) => {
    deviceDataFeed.next(value);
  });

  subs1 = deviceStatusUpdate.subscribe((value) => {
    if (value) {
      socket.emit(TOPIC_DEVICE_STATUS_UPDATE, value);
    }
  });

  subs2 = deviceDataFeedUpdate.subscribe((value) => {
    if (value) {
      socket.emit(TOPIC_DEVICE_DATA_FEED_UPDATE, value);
    }
  });

  clientSubs1 = navStatusUpdate.subscribe((value) => {
    if (value) {
      navStatus.next({ ...navStatus.value, ...value });
    }
  });

  return true;
};

export const uninitSetup = async () => {
  if (subs1) subs1.unsubscribe();
  if (subs2) subs2.unsubscribe();
  if (socket) socket.disconnect();

  if (clientSubs1) clientSubs1.unsubscribe();
};

type DefaultEventsMap = any;
