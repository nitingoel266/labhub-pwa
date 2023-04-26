import { getDeviceStatusValue } from "./device-actions";
import { getShortHexCode } from "./gatt/map";
import {
  getServiceName,
  getCharacteristicTuple,
  // printCharacteristic,
  // printCharacteristicName,
  getValueFromDataView,
} from "./gatt/utils";
import { topicDeviceStatus } from "./topics";
import { Log } from "../utils/utils";

export async function handleDeviceInfoService(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string
) {
  // const services = await server.getPrimaryServices();
  // console.log('==>>', services.length);
  // if (services.length) {
  //   for (const service of services) {
  //     console.log('-->', service.uuid);      
  //     const chars = await service.getCharacteristics();
  //     for (const char of chars) {
  //       // await printCharacteristic(char);
  //       printCharacteristicName(char);
  //     }
  //   }
  // }
  
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

  // Log.debug("service.name:", serviceName);
  // Log.debug("characteristics.count:", chars.length);

  let deviceName = "";
  let deviceVersion = "";
  let deviceSerial = "";
  let deviceManufacturer = "";

  for (const char of chars) {
    const [name, valueBuffer] = await getCharacteristicTuple<ArrayBuffer>(char, 'buffer');
    if (valueBuffer !== undefined) {
      const view = new DataView(valueBuffer);
      let value: string;

      switch (name) {
        case "Model Number String":
          value = getValueFromDataView(view, 'string') as string;
          if (value) deviceName = value;
          break;
        case "Serial Number String":
          value = getValueFromDataView(view, 'string') as string;
          if (value) deviceSerial = value;  // NOTE: Unused (not getting this characteristic value)
          break;
        case "Firmware Revision String":
          value = getValueFromDataView(view, 'string') as string;
          if (value) deviceVersion = value;
          break;
        case "Manufacturer Name String":
          value = getValueFromDataView(view, 'string') as string;
          if (value) deviceManufacturer = value;
          break;
        case "PnP ID":
          // NOTE: Unused (not sure if this characteristic value is of any use)
          // // Ref: https://github.com/oesmith/gatt-xml/blob/master/org.bluetooth.characteristic.pnp_id.xml
          // const vendorIdSource = getValueFromDataView(view, 'int8');
          // const vendorId = getValueFromDataView(view, 'int16', 1);
          // const productId = getValueFromDataView(view, 'int16', 3);
          // const productVersion = getValueFromDataView(view, 'int16', 5);
          // console.log(name, ':', `[${vendorIdSource}, ${vendorId}, ${productId}, ${productVersion}]`);
          break;
        default:
          Log.warn("Unknown characteristic:", name, char);
          break;
      }
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
