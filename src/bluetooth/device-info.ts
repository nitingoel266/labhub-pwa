import { getDeviceStatusValue } from "./device-actions";
import { getShortHexCode } from "./gatt/map";
import {
  getServiceName,
  getCharacteristicTuple,
} from "./gatt/utils";
import { topicDeviceStatus } from "./topics";
import { Log } from "../utils/utils";

export async function handleDeviceInfoService(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string
) {
  if (!server || !serviceId) {
    Log.error("[ERROR:handleDeviceInfoService] Invalid arguments passed!");
    return;
  }

  const serviceName = getServiceName(serviceId);
  if (serviceName !== "Device Information") {
    Log.error("[ERROR:handleDeviceInfoService] Invalid serviceId passed! [1]");
    return;
  }

  const service = await server.getPrimaryService(serviceId);
  if (!service) {
    Log.error(`[ERROR:handleDeviceInfoService] Bluetooth GATT Service not found: ${getShortHexCode(serviceId)}`);
    return;
  }

  const chars = await service.getCharacteristics();

  Log.debug("service.name:", serviceName);
  Log.debug("characteristics.count:", chars.length);
  // if (DEBUG_MODE) {
  //   for (const char of chars) {
  //     await printCharacteristic(char);
  //   }
  // }

  let deviceName = "";
  let deviceVersion = "";
  let deviceSerial = "";
  let deviceManufacturer = "";

  for (const char of chars) {
    const [name, value] = await getCharacteristicTuple<string>(char, 'string');
    switch (name) {
      case "Model Number String":
        if (value) deviceName = value;
        break;
      case "Serial Number String":
        if (value) deviceSerial = value;
        break;
      case "Firmware Revision String":
        if (value) deviceVersion = value;
        break;
      case "Manufacturer Name String":
        if (value) deviceManufacturer = value;
        break;
      default:
        Log.warn("Unknown characteristic:", name, char);
        break;
    }
  }

  // Initialize device status value
  const deviceStatusValue = getDeviceStatusValue(true);

  if (deviceName) deviceStatusValue.deviceName = deviceName;
  if (deviceVersion) deviceStatusValue.deviceVersion = deviceVersion;
  if (deviceSerial) deviceStatusValue.deviceSerial = deviceSerial;
  if (deviceManufacturer) deviceStatusValue.deviceManufacturer = deviceManufacturer;

  topicDeviceStatus.next(deviceStatusValue);
}
