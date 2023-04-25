import { Sema  } from 'async-sema';
import { delay } from '../utils/utils';
import { DeviceStatus } from "../types/common";

// Create a semaphore with a limit of 1
const semaphore = new Sema(1);

export async function acquireSemaphore() {
  while (!semaphore.tryAcquire()) {
    await delay(100);
  }
}

export function releaseSemaphore() {
  semaphore.release();
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
