import { Subscription } from "rxjs";
import { initGattMap } from "./gatt/map";
import { handleDeviceInfoService } from "./device-info";
import { topicDeviceDataFeed, topicDeviceStatus } from "./topics";
import { requestClientId, disconnectClient, handleDeviceStatusUpdate, handleDeviceDataFeedUpdate, handleClientChannelRequest, resetClient } from "./device-actions";
import { setupLeaderIdNotify, cleanupLeaderIdNotify, setupExperimentStatusNotify, cleanupExperimentStatusNotify, requestLeaderId } from "./device-notify";
import { DEVICE_INFO_SERVICE, LABHUB_SERVICE } from "./const";
import { Log } from "../utils/utils";
import {
  deviceConnected,
  deviceStatus,
  deviceStatusUpdate,
  deviceDataFeed,
  deviceDataFeedUpdate,
  clientChannelRequest,
} from "../labhub/status";

let server: BluetoothRemoteGATTServer | null;
let gattserverdisconnectedCallback: any;
let connectionAttemptOngoing: boolean;
let gattserverdisconnectedCallbackOld: any;

let leaderIdCharacteristic: BluetoothRemoteGATTCharacteristic | null;
let leaderIdCharacteristicOld: BluetoothRemoteGATTCharacteristic | null;
let experimentStatusCharacteristic: BluetoothRemoteGATTCharacteristic | null;
let experimentStatusCharacteristicOld: BluetoothRemoteGATTCharacteristic | null;

let topic1: Subscription;
let topic2: Subscription;

let subs1: Subscription;
let subs2: Subscription;
let subs3: Subscription;

// let clientSubs1: Subscription;

initGattMap();
resetValues();

function resetValues() {
  server = null;
  gattserverdisconnectedCallback = () => {};
  connectionAttemptOngoing = false;
  gattserverdisconnectedCallbackOld = () => {};
  
  leaderIdCharacteristic = null;
  leaderIdCharacteristicOld = null;
  experimentStatusCharacteristic = null;
  experimentStatusCharacteristicOld = null;  
}

export const initSetup = async (): Promise<boolean> => {
  if (connectionAttemptOngoing) {
    Log.error("[ERROR:initSetup] Another connection attempt ongoing! Please wait..");
    return false;
  }

  connectionAttemptOngoing = true;
  let retValue = true;

  try {
    if (!("bluetooth" in navigator)) {
      throw new Error(
        "Bluetooth adapter missing! Try enabling experimental flag: chrome://flags/#enable-experimental-web-platform-features"
      );
    }

    const status = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('bluetooth.getAvailability() timeout!');
      }, 1000);
      navigator.bluetooth.getAvailability().then(status => {
        clearTimeout(timeout);
        resolve(status);
      }).catch(e => {
        clearTimeout(timeout);
        reject(e);
      });
    });
    if (!status) {
      throw new Error("This device does not have a Bluetooth adapter!");
    }

    const serviceId = DEVICE_INFO_SERVICE;
    const serviceId2 = LABHUB_SERVICE;
    // const serviceId = '0000180a-0000-1000-8000-00805f9b34fb';  // uuid
    // const serviceId = 'device_information';  // name
    // const serviceId = 'battery_service';  // name

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
    const device = await devicePr;

    Log.debug("device", device);

    if (!device.gatt) {
      throw new Error("Bluetooth GATT Server not found! [1]");
    }
    Log.debug("device.connected[1]", device.gatt.connected);

    const serverOld: BluetoothRemoteGATTServer | null = server;
    const serverOldValid = !!serverOld;
    gattserverdisconnectedCallbackOld = gattserverdisconnectedCallback;

    leaderIdCharacteristicOld = leaderIdCharacteristic;
    experimentStatusCharacteristicOld = experimentStatusCharacteristic;

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

      if (!server) {
        throw new Error("Bluetooth GATT Server not found! [3]");
      }
      gattserverdisconnectedCallback = onDisconnected.bind(null);
      device.addEventListener(
        "gattserverdisconnected",
        gattserverdisconnectedCallback
      );

      Log.debug("device.connected[2]", server.connected);
    } else {
      server = device.gatt;
    }

    if (serverOldValid && serverOld) {
      if ((serverOld as BluetoothRemoteGATTServer).device.id !== device.id) {
        Log.log("Cleaning up previous bluetooth connection..");
        await onDisconnected(null, serverOld);
      }
    }

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

    // clientSubs1 = navStatusUpdate.subscribe((value) => {
    //   if (value) {
    //     navStatus.next({ ...navStatus.value, ...value });
    //   }
    // });

    // ------------------------

    // Read device info
    await handleDeviceInfoService(server, DEVICE_INFO_SERVICE);

    const clientId = await requestClientId(server);
    if (!clientId) throw new Error('Unable to request client Id');

    // Setup for leader_notify and experiment_status_notify events
    leaderIdCharacteristic = await setupLeaderIdNotify(server);
    experimentStatusCharacteristic = await setupExperimentStatusNotify(server);

    // Request leaderId from device
    await requestLeaderId(server);

    // ------------------------

    Log.debug('initSetup() complete!');

    if (deviceConnected.value !== server.connected) {
      deviceConnected.next(server.connected);
    }
  } catch (e) {
    Log.error('[ERROR:initSetup]', e);
    retValue = false;

    try {
      if (server) {
        await uninitSetup();
      }
    } catch (e) {
      Log.error('[ERROR:initSetup] unable to uninitSetup()', e);
    }
  }

  connectionAttemptOngoing = false;
  return retValue;
};

async function onDisconnected(
  event?: any,
  serverOther?: BluetoothRemoteGATTServer
) {
  const serverPassed = !!serverOther;

  if (!serverPassed && deviceConnected.value !== server?.connected) {
    deviceConnected.next(server?.connected || false);
  }

  if (serverPassed) {
    if (leaderIdCharacteristicOld) await cleanupLeaderIdNotify(leaderIdCharacteristicOld);
    if (experimentStatusCharacteristicOld) await cleanupExperimentStatusNotify(experimentStatusCharacteristicOld);

    serverOther.device.removeEventListener(
      "gattserverdisconnected",
      gattserverdisconnectedCallbackOld
    );

    Log.debug('onDisconnected: serverOther (old server)');
  } else if (server) {
    // const device = event?.target;  // NOTE: event might be `null` when onDisconnected is called explicitly
    // console.log('device:', device);

    resetClient();

    if (leaderIdCharacteristic) await cleanupLeaderIdNotify(leaderIdCharacteristic);
    if (experimentStatusCharacteristic) await cleanupExperimentStatusNotify(experimentStatusCharacteristic);

    server.device.removeEventListener(
      "gattserverdisconnected",
      gattserverdisconnectedCallback
    );

    resetValues();

    Log.debug('onDisconnected: auto or manual disconnect');
  }

  if (topic1) topic1.unsubscribe();
  if (topic2) topic2.unsubscribe();

  if (subs1) subs1.unsubscribe();
  if (subs2) subs2.unsubscribe();
  if (subs3) subs3.unsubscribe();

  // if (clientSubs1) clientSubs1.unsubscribe();

  // TODO?
  // Auto-reconnect if not explicitly disconnected?
  // Ref: https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html

  Log.debug('onDisconnected() complete!');
}

export const uninitSetup = async () => {
  if (server?.connected) {
    // TODO: what is the point of disconnecting from labhub device!
    // TODO(2): Is terminating bluetooth connection not enough?
    await disconnectClient(server);

    server.disconnect();
    // NOTE: onDisconnected() called automatically
  } else {
    Log.warn("Bluetooth device is already disconnected!");
  }
};
