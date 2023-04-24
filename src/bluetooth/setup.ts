import { Subscription } from "rxjs";
import { initGattMap } from "./gatt/map";
import { handleDeviceInfoService } from "./device-info";
import { topicDeviceDataFeed, topicDeviceStatus } from "./topics";
import { requestClientId, disconnectClient, handleDeviceStatusUpdate, handleDeviceDataFeedUpdate, handleClientChannelRequest, resetClient } from "./device-actions";
import { setupLeaderIdNotify, cleanupLeaderIdNotify, setupExperimentStatusNotify, cleanupExperimentStatusNotify, requestLeaderId } from "./device-notify";
import { DEVICE_INFO_SERVICE, LABHUB_SERVICE } from "./const";
import { Log, timeoutPromise } from "../utils/utils";
import {
  deviceConnected,
  deviceStatus,
  deviceStatusUpdate,
  deviceDataFeed,
  deviceDataFeedUpdate,
  clientChannelRequest,
  applicationMessage,
  connectionAttemptOngoing,
} from "../labhub/status";

let statusPrev = false;
let manualDisconnect = false;

let server: BluetoothRemoteGATTServer | null = null;
let serverPrev: BluetoothRemoteGATTServer | null = null;
let leaderIdCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let leaderIdCharacteristicPrev: BluetoothRemoteGATTCharacteristic | null = null;
let experimentStatusCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let experimentStatusCharacteristicPrev: BluetoothRemoteGATTCharacteristic | null = null;

let topic1: Subscription;
let topic2: Subscription;

let subs1: Subscription;
let subs2: Subscription;
let subs3: Subscription;

initGattMap();

function resetValues() {
  server = null;
  leaderIdCharacteristic = null;
  experimentStatusCharacteristic = null;
}

export const initSetup = async () => {
  serverPrev = server;
  leaderIdCharacteristicPrev = leaderIdCharacteristic;
  experimentStatusCharacteristicPrev = experimentStatusCharacteristic;

  resetValues();

  if (serverPrev) {
    Log.debug("Cleaning up previous bluetooth connection..");
    await onDisconnected(); // softReset (cleanup withot disconnect)
  }

  let status = await initSetupBase();

  if (status && serverPrev) {
    if (server && serverPrev.device.id === server.device.id) {
      Log.debug("Reusing the previous bluetooth connection!");
    } else {
      Log.debug("Disconnecting previous bluetooth connection..");
      serverPrev.disconnect(); // noCleanup (just disconnect, cleanup aleady done)
    }
  } else if (!status && serverPrev) {
    status = await initSetupBase(serverPrev.device);
    if (!status) {
      location.reload(); // eslint-disable-line
    }
  }

  return status;
};

async function initSetupBase(bluetoothDevice?: BluetoothDevice, autoReconnect = false): Promise<boolean> {
  if (connectionAttemptOngoing.value) {
    Log.error("[ERROR:initSetup] Another connection attempt ongoing! Please wait..");
    if (!autoReconnect) applicationMessage.next('Another connection attempt ongoing! Please wait..');
    return false;
  }

  manualDisconnect = false;
  let retValue = true;
  connectionAttemptOngoing.next(true);

  try {
    if (!("bluetooth" in navigator)) {
      throw new Error(
        "Bluetooth adapter missing! Try enabling experimental flag: chrome://flags/#enable-experimental-web-platform-features"
      );
    }

    let isTimedOut = false;
    let status = await new Promise<boolean>((resolve, reject) => {
      const timeout = setTimeout(() => {
        isTimedOut = true;
        Log.error('[ERROR:initSetup] bluetooth.getAvailability() timeout!');
        if (!autoReconnect) applicationMessage.next('Bluetooth timeout!');
        resolve(false);
      }, 1000);
      navigator.bluetooth.getAvailability().then(status => {
        clearTimeout(timeout);
        resolve(status);
      }).catch(e => {
        clearTimeout(timeout);
        Log.error('[ERROR:initSetup]', e);
        if (!autoReconnect) applicationMessage.next(e.message || `${e}`);
        resolve(false);
      });
    });
    if (!status) {
      if (isTimedOut) {
        status = statusPrev;
      } else {
        throw new Error("Bluetooth turned off or No Bluetooth adapter!");
      }
    } else {
      statusPrev = status;
    }

    const serviceId = DEVICE_INFO_SERVICE;
    const serviceId2 = LABHUB_SERVICE;
    // const serviceId = '0000180a-0000-1000-8000-00805f9b34fb';  // uuid
    // const serviceId = 'device_information';  // name
    // const serviceId = 'battery_service';  // name

    let device: BluetoothDevice;
    if (bluetoothDevice) {
      device = bluetoothDevice;
    } else {
      const devicePr = navigator.bluetooth.requestDevice({
        // acceptAllDevices: true,
        filters: [
          {
            // namePrefix: "MacBook",
            manufacturerData: [
              {
                companyIdentifier: 0x004c, // Apple
                // companyIdentifier: 0x0059,  // Nordic Semiconductor ASA
                // dataPrefix: new Uint8Array([0x01, 0x02])
              },
            ],
            // services: ['0000180a-0000-1000-8000-00805f9b34fb'],
          },
        ],
        optionalServices: [serviceId, serviceId2],
      });
      device = await devicePr;
    }

    Log.debug("device", device);

    if (!device.gatt) {
      throw new Error("Bluetooth GATT Server not found! [1]");
    }
    Log.debug("device.connected[1]", device.gatt.connected);

    if (!device.gatt.connected) {
      server = await new Promise((resolve, reject) => {
        if (!device.gatt) {
          reject("Bluetooth GATT Server not found! [2]");
          return;
        }

        const timeout = setTimeout(() => {
          reject("Bluetooth connect timeout!");
        }, 10000);
        device.gatt
          .connect()
          .then((s) => {
            clearTimeout(timeout);
            resolve(s);
          })
          .catch((e) => {
            clearTimeout(timeout);
            reject(e);
          });
      });
    } else {
      server = device.gatt;  
    }

    if (!server) {
      throw new Error("Bluetooth GATT Server not found! [3]");
    }
    device.addEventListener(
      "gattserverdisconnected",
      onDisconnected
    );

    Log.debug("device.connected[2]", server.connected);

    if (!server.connected) {
      throw new Error("Unable to connect to Bluetooth GATT Server!");
    }

    // ------------------------

    topic1 = topicDeviceStatus.subscribe((value) => {
      Log.debug("TOPIC_DEVICE_STATUS:", value);
      deviceStatus.next(value);
    });

    topic2 = topicDeviceDataFeed.subscribe((value) => {
      Log.debug("TOPIC_DEVICE_DATA_FEED:", value);
      deviceDataFeed.next(value);
    });

    subs1 = deviceStatusUpdate.subscribe(async (value) => {
      Log.debug("TOPIC_DEVICE_STATUS_UPDATE:", value);
      await handleDeviceStatusUpdate(server, value);
    });

    subs2 = deviceDataFeedUpdate.subscribe(async (value) => {
      Log.debug("TOPIC_DEVICE_DATA_FEED_UPDATE:", value);
      await handleDeviceDataFeedUpdate(server, value);
    });

    subs3 = clientChannelRequest.subscribe(async (value) => {
      Log.debug('TOPIC_CLIENT_CHANNEL:', value);
      await handleClientChannelRequest(server, value);
    });

    // ------------------------

    // Read device info
    const pr1 = handleDeviceInfoService(server, DEVICE_INFO_SERVICE);
    await timeoutPromise(pr1, 8000);

    const connectionReuse = !!server && !!serverPrev && serverPrev.device.id === server.device.id && server.connected;
    const clientId = await requestClientId(server, connectionReuse);
    if (!clientId) throw new Error('Unable to request client Id');

    // Setup for leader_notify and experiment_status_notify events
    leaderIdCharacteristic = await setupLeaderIdNotify(server);
    experimentStatusCharacteristic = await setupExperimentStatusNotify(server);

    // Request leaderId from device
    await requestLeaderId(server);

    // ------------------------

    Log.debug('initSetup() complete!');
    Log.debug('[NODE_ENV]:', process.env.NODE_ENV);
    Log.debug('[REACT_APP_ENV]:', process.env.REACT_APP_ENV);

    if (server && deviceConnected.value !== server.connected) {
      deviceConnected.next(server.connected);
    }
  } catch (e) {
    Log.error('[ERROR:initSetup]', e);
    if (!autoReconnect) applicationMessage.next((e as any).message || `${e}`);
    retValue = false;

    try {
      if (server) {
        await uninitSetup();
      }
    } catch (e) {
      Log.error('[ERROR:initSetup] unable to uninitSetup()', e);
      if (!autoReconnect) applicationMessage.next('Unable to cleanup Bluetooth initialization!');
    }
  }

  connectionAttemptOngoing.next(false);
  return retValue;
};

async function onDisconnected(event?: any) {
  let reconnectServer: BluetoothRemoteGATTServer | null = null;
  let gattServer: BluetoothRemoteGATTServer | null = null;
  if (event?.target) {
    gattServer = event.target.gatt;
  }

  if (!event && serverPrev) {
    // softReset: Cleanup withot disconnect

    resetClient(/*softReset=*/true);

    if (leaderIdCharacteristicPrev) await cleanupLeaderIdNotify(leaderIdCharacteristicPrev);
    if (experimentStatusCharacteristicPrev) await cleanupExperimentStatusNotify(experimentStatusCharacteristicPrev);

    serverPrev.device.removeEventListener(
      "gattserverdisconnected",
      onDisconnected
    );

    Log.debug('onDisconnected(): serverPrev (previous server)');
  } else if (gattServer && server) {
    if (gattServer.device.id !== server.device.id) {
      // noCleanup: Just disconnect, cleanup aleady done
      return;
    } else {
      // server cleanup (auto or manual disconnect)

      if (manualDisconnect) {
        manualDisconnect = false;
        Log.debug('onDisconnected(): manual disconnect');
      } else {
        reconnectServer = server;
        Log.debug('onDisconnected(): auto disconnect');
      }

      resetClient();

      if (leaderIdCharacteristic) await cleanupLeaderIdNotify(leaderIdCharacteristic);
      if (experimentStatusCharacteristic) await cleanupExperimentStatusNotify(experimentStatusCharacteristic);
  
      server.device.removeEventListener(
        "gattserverdisconnected",
        onDisconnected
      );
  
      resetValues();
    }
  } else {
    Log.warn('onDisconnected() No server found!', !!serverPrev, !!gattServer, !!server);
    return;
  }

  if (topic1) topic1.unsubscribe();
  if (topic2) topic2.unsubscribe();

  if (subs1) subs1.unsubscribe();
  if (subs2) subs2.unsubscribe();
  if (subs3) subs3.unsubscribe();

  // NOTE: for previous server, resetClient(true) resets deviceConnected value to false
  if (server && deviceConnected.value !== server.connected) {
    deviceConnected.next(server.connected);
  }
  
  Log.debug('onDisconnected() complete!');

  // Ref: https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html
  if (reconnectServer) {
    Log.log('Attempting re-connect..');
    const status = await initSetupBase(reconnectServer.device, true);
    if (!status) {
      Log.error('Unable to reconnect using (disconnected) gatt server!');
      // applicationMessage.next('Unable to re-connect!');
      // location.reload(); // eslint-disable-line
    } else {
      Log.log('Auto-reconnect successful!');
    }
  }
}

export const uninitSetup = async () => {
  if (server?.connected) {
    // TODO: what is the point of disconnecting from labhub device!
    // TODO(2): Is terminating bluetooth connection not enough?
    // TODO(3): Anyways, this is not called when disconnecting during trying second connection on-the-fly!
    await disconnectClient(server);

    manualDisconnect = true;
    server.disconnect(); // NOTE: onDisconnected() called automatically
  } else {
    Log.warn("Bluetooth device is already disconnected!");
  }
};
