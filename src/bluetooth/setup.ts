import fastq from "fastq";
import type { queueAsPromised } from "fastq";
import { Subscription } from "rxjs";
import { initGattMap } from "./gatt/map";
import { handleDeviceInfoService } from "./device-info";
import { topicDeviceDataFeed, topicDeviceStatus } from "./topics";
import { requestClientId, disconnectClient, handleDeviceStatusUpdate, handleDeviceDataFeedUpdate, handleClientChannelRequest, resetClient } from "./device-actions";
import { setupLeaderIdNotify, cleanupLeaderIdNotify, setupExperimentStatusNotify, cleanupExperimentStatusNotify, requestLeaderId } from "./device-notify";
import { DEVICE_INFO_SERVICE, LABHUB_SERVICE } from "./const";
import { DISABLE_RELOAD, REUSE_CLIENTID_ONCONNREUSE } from "../utils/const";
import { Log, timeoutPromise } from "../utils/utils";
import { clearCharacteristicsCache } from "./read-write";
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

type Task = {
  id: number;
  value: any;
};

const q: queueAsPromised<Task> = fastq.promise(asyncWorker, 1);

initGattMap();

/**
 * handleDeviceStatusUpdate :- update values for device status
 * handleDeviceDataFeedUpdate :- update feed values for temperature,voltage and rgb
 * handleClientChannelRequest :- get the log values for graphs and screen number
 * @param arg :- values to be update of status, datafeed
 */
async function asyncWorker(arg: Task): Promise<void> {
  if (arg.id === 1) {
    await handleDeviceStatusUpdate(server, arg.value);
  } else if (arg.id === 2) {
    await handleDeviceDataFeedUpdate(server, arg.value);
  } else if (arg.id === 3) {
    await handleClientChannelRequest(server, arg.value);
  }
}

function resetValues() {
  server = null;
  leaderIdCharacteristic = null;
  experimentStatusCharacteristic = null;
}

export const initSetup = async () => {

  // bluetooth device and leader properties
  serverPrev = server; 
  leaderIdCharacteristicPrev = leaderIdCharacteristic;
  experimentStatusCharacteristicPrev = experimentStatusCharacteristic;

  resetValues(); // clear previous data of bluetooth device

  if (serverPrev) {
    Log.debug("Cleaning up previous bluetooth connection..");

    if (!REUSE_CLIENTID_ONCONNREUSE) {
      await disconnectClient(serverPrev);
    }

    await onDisconnected(); // softReset (cleanup withot disconnect)
  }

  let status = await initSetupBase();

  if (status && serverPrev) {
    if (server && serverPrev.device.id === server.device.id) {
      Log.debug("Reusing the previous bluetooth connection!");
    } else {
      Log.debug("Disconnecting previous bluetooth connection..");

      // partial cleanup
      clearCharacteristicsCache(serverPrev.device.id);

      serverPrev.disconnect(); // noCleanup (just disconnect, cleanup aleady done)
    }
  } else if (!status && serverPrev) {
    status = await initSetupBase(serverPrev.device);
    if (!status) {
      if (!DISABLE_RELOAD) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  return status;
};

/**
 * 
 * @param bluetoothDevice :- data of previously connected bluetooth device
 * @param autoReconnect  :- for reconnection to the current BLE device if disconnected.
 * @returns :- return type is boolean to clear the local Characteristics cache
 */
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
    let status = await new Promise<boolean>((resolve, reject) => { // check for the bluetooth device avality
      const timeout = setTimeout(() => {
        isTimedOut = true;
        Log.error('[ERROR:initSetup] bluetooth.getAvailability() timeout!');
        // if (!autoReconnect)
        applicationMessage.next('Bluetooth timeout!');
        resolve(false);
      }, 15000);
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
    if (bluetoothDevice) { // if BLE device is already connected then use it
      device = bluetoothDevice;
    } else {
      const devicePr = navigator.bluetooth.requestDevice({ // request for BLE device to connect
        // acceptAllDevices: true,
        filters: [
          {
            namePrefix: "LabHub",
          },
          // {
          //   // namePrefix: "MacBook",
          //   manufacturerData: [
          //     {
          //       companyIdentifier: 0x004c, // Apple
          //       // companyIdentifier: 0x0059,  // Nordic Semiconductor ASA
          //     },
          //   ],
          //   // services: ['0000180a-0000-1000-8000-00805f9b34fb'],
          // },
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

    if (!device.gatt.connected) { // try to connect to BLE device if not exist
      server = await new Promise((resolve, reject) => {
        if (!device.gatt) {
          reject("Bluetooth GATT Server not found! [2]");
          return;
        }

        const timeout = setTimeout(() => {
          reject("Bluetooth connect timeout!");
        }, 15000);
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
      deviceStatus.next(value);
    });

    topic2 = topicDeviceDataFeed.subscribe((value) => {
      deviceDataFeed.next(value);
    });

    subs1 = deviceStatusUpdate.subscribe(async (value) => {
      Log.debug("TOPIC_DEVICE_STATUS_UPDATE:", value);
      q.push({ id: 1, value }).catch((err) => Log.error(err))
    });

    subs2 = deviceDataFeedUpdate.subscribe(async (value) => {
      Log.debug("TOPIC_DEVICE_DATA_FEED_UPDATE:", value);
      q.push({ id: 2, value }).catch((err) => Log.error(err))
    });

    subs3 = clientChannelRequest.subscribe(async (value) => {
      Log.debug('TOPIC_CLIENT_CHANNEL:', value);
      q.push({ id: 3, value }).catch((err) => Log.error(err))
    });

    // ------------------------

    // Read device info
    /**
     * Read the connected BLE device info like serial nu, name.
     */
    const pr1 = handleDeviceInfoService(server, DEVICE_INFO_SERVICE);
    const status1 = await timeoutPromise<boolean>(pr1, 15000, 'Read device info');
    if (!status1) {
      throw new Error('Unable to request Device Info.');
    }

    let clientId;
    if (REUSE_CLIENTID_ONCONNREUSE) { // create member client ID
      const connectionReuse = !!server && !!serverPrev && serverPrev.device.id === server.device.id && server.connected;
      clientId = await requestClientId(server, connectionReuse);
    } else {
      clientId = await requestClientId(server);
    }
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

    if (server && deviceConnected.value !== server.connected) { // update the device values
      deviceConnected.next(server.connected);
    }
  } catch (e) {
    Log.error('[ERROR:initSetup]', e);
    if (!autoReconnect) applicationMessage.next((e as any).message || `${e}`);
    retValue = false;

    try {
      if (server) { // if not connected to the device and bluetooth gatt Characteristics available then disconnect it 
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

/**
 * 
 * @param event get bluetooth Characteristics values
 * @returns return type is null
 */
async function onDisconnected(event?: any) {
  let reconnectServer: BluetoothRemoteGATTServer | null = null;
  let gattServer: BluetoothRemoteGATTServer | null = null;
  let isManualDisconnect = false;

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
        isManualDisconnect = true;
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
  // NOTE: Auto-reconnect is disabled due to the issue that device status notifications
  // are not working (even after resubscribing notifications) after reconnect
  if (reconnectServer) {
    // Log.log('Attempting re-connect..');
    // const status = await initSetupBase(reconnectServer.device, true);
    // if (!status) {
    //   Log.error('Unable to reconnect using (disconnected) gatt server!');
    //   // applicationMessage.next('Unable to re-connect!');
    //   // window.location.reload();
    // } else {
    //   Log.log('Auto-reconnect successful!');
    // }
  }

  // Issue: Device status notifications are not working (even after resubscribing notifications) after reconnect
  // Repro: Disconnect and Connect --> notifications are not subscribed (not working)
  // NOTE: The following runs for current server disconnect (manual or auto), but not for prev server disconnect
  if (gattServer) {
    // Fix the above issue
    if (!DISABLE_RELOAD && !isManualDisconnect) {
      setTimeout(() => {
        // window.location.reload(); // we lost the data of experiment so commented this and load in header.tsx after save data
      }, 1000);
    }
  }
}

//when we disconnect from scan page
export const uninitSetup = async () => {
  if (server?.connected) {
    // Optional here, since disconnecting the bluetooth connection will anyways disconnect the client.
    // However, not optional in case we do not want to reuse the same clientId after reconnect over the same bluetooth connection (connection reuse)
    // NOTE: see usage of REUSE_CLIENTID_ONCONNREUSE flag
    await disconnectClient(server);

    manualDisconnect = true;
    server.disconnect(); // NOTE: onDisconnected() called automatically
  } else {
    Log.warn("Bluetooth device is already disconnected!");
    window.location.reload();
  }
};
