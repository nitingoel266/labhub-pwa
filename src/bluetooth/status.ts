import { DeviceStatus } from "../types/common";

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
