import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import deepEqual from 'deep-equal';
import { deviceConnected, deviceStatus, deviceStatusUpdate, deviceDataFeed, deviceDataFeedUpdate, clientChannelRequest, clientChannelResponse, connectionAttemptOngoing, applicationMessage } from './status';
import { DeviceStatus, DeviceDataFeed, ClientChannelResponse } from '../types/common';
import { TOPIC_DEVICE_STATUS, TOPIC_DEVICE_STATUS_UPDATE, TOPIC_DEVICE_DATA_FEED, TOPIC_DEVICE_DATA_FEED_UPDATE, TOPIC_CLIENT_CHANNEL } from '../utils/const';
import { assertClientId, clearClientId } from './utils';
import { Log } from '../utils/utils';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let subs1: Subscription;
let subs2: Subscription;
let subs3: Subscription;

let clientSubs1: Subscription;

export const initSetup = async (): Promise<boolean> => {
  const clientId = assertClientId();
  if (!clientId) {
    applicationMessage.next('localStorage not supported in this browser');
    return false;
  }

  connectionAttemptOngoing.next(true);
 
  socket = io('http://localhost:4000', { query: { clientId } });

  socket.on('connect', () => {
    // Log.log(socket.connected, socket.id);
    deviceConnected.next(true);
  });
  socket.on('disconnect', (reason) => {
    // Log.log('disconnected:', reason);
    deviceConnected.next(false);
  });

  socket.on(TOPIC_DEVICE_STATUS, (value: DeviceStatus) => {
    const newValue = { ...value, batteryLevel: deviceStatus.value?.batteryLevel };
    if (!deepEqual(newValue, deviceStatus.value, { strict: true })) {
      Log.debug('TOPIC_DEVICE_STATUS:', value);
    }

    deviceStatus.next(value);
  });

  socket.on(TOPIC_DEVICE_DATA_FEED, (value: DeviceDataFeed) => {
    Log.debug('TOPIC_DEVICE_DATA_FEED:', value);
    deviceDataFeed.next(value);
  });

  subs1 = deviceStatusUpdate.subscribe((value) => {
    Log.debug('TOPIC_DEVICE_STATUS_UPDATE:', value);
    if (value) {
      socket.emit(TOPIC_DEVICE_STATUS_UPDATE, value);
    }
  });

  subs2 = deviceDataFeedUpdate.subscribe((value) => {
    Log.debug('TOPIC_DEVICE_DATA_FEED_UPDATE:', value);
    if (value) {
      socket.emit(TOPIC_DEVICE_DATA_FEED_UPDATE, value);
    }
  });

  subs3 = clientChannelRequest.subscribe((value) => {
    Log.debug('TOPIC_CLIENT_CHANNEL:', value);
    if (value) {
      socket.emit(TOPIC_CLIENT_CHANNEL, value, (response: ClientChannelResponse) => {
        // Acknowledgement (with response) from server
        clientChannelResponse.next(response);
      });
    }
  });

  connectionAttemptOngoing.next(false);
  return true;
};

export const uninitSetup = async () => {
  clearClientId();

  if (subs1) subs1.unsubscribe();
  if (subs2) subs2.unsubscribe();
  if (subs3) subs3.unsubscribe();
  if (socket) socket.disconnect();

  if (clientSubs1) clientSubs1.unsubscribe();
};

type DefaultEventsMap = any;
