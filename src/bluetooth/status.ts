import { Sema  } from 'async-sema';
import { delay } from '../utils/utils';
import { DeviceStatus } from "../types/common";

// Create a semaphore with a limit of 1
const semaphore = new Sema(1);

export async function acquireSemaphore(id: number) {
  let acquired = undefined;
  while (!acquired) {
    acquired = semaphore.tryAcquire();
    // Log.warn(`trying to acquire [${id}]`);
    await delay(100);
  }
  return acquired;
}

export function releaseSemaphore(id: number) {
  semaphore.release();
  // Log.warn(`release [${id}]`);
}

export const initialDeviceStatus: DeviceStatus = {
  deviceName: "",
  deviceVersion: "",
  deviceSerial: "",
  deviceManufacturer: "",
  batteryLevel: 100,
  leaderSelected: null,
  membersJoined: [],
  setupData: { dataRate: 1, dataSample: "cont" },
  sensorConnected: null,
  setpointTemp: 20, // default setpoint temperature (in *C)
  heaterConnected: null,
  rgbCalibrated: false,
  rgbCalibratedAndTested: false,
  rgbConnected: null,
  operationPrev: null,
  operation: null,
};
