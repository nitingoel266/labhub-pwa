import { Log } from "../utils/utils";
import { getShortHexCode } from "./gatt/map";
import {
  getServiceItem,
  getCharacteristicTuple,
  setCharacteristicValue,
} from "./gatt/utils";

export async function readCharacteristicValue<T = string | number | ArrayBuffer>(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string,
  characteristicId: number | string,
  valueType: 'int8' | 'int16' | 'string' | 'buffer'
) {
  let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  try {
    if (!server || !serviceId) {
      throw new Error("Invalid arguments passed!");
    }

    const serviceItem = getServiceItem(serviceId);
    if (!serviceItem) {
      throw new Error("Invalid serviceId passed! [2]");
    }

    const service = await server.getPrimaryService(serviceId);
    if (!service) {
      throw new Error(
        `Bluetooth GATT Service not found: ${getShortHexCode(serviceId)}`
      );
    }

    characteristic = await service.getCharacteristic(characteristicId);
  } catch (e) {
    Log.error("[ERROR:readCharacteristicValue]", e);
    return undefined;
  }

  let characteristicNameValue: [string, string | number | ArrayBuffer | undefined] = [
    "",
    undefined,
  ];
  if (characteristic) {
    // Log.log('characteristic.properties:', characteristic.properties);
    characteristicNameValue = await getCharacteristicTuple(characteristic, valueType);
  }

  return characteristicNameValue[1] as T | undefined;
}

export async function writeCharacteristicValue(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string,
  characteristicId: number | string,
  characteristicValue: number | string | ArrayBuffer,
  bytes?: number
) {
  let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  try {
    if (!server || !serviceId) {
      throw new Error("Invalid arguments passed!");
    }

    const serviceItem = getServiceItem(serviceId);
    if (!serviceItem) {
      throw new Error("Invalid serviceId passed! [3]");
    }

    const service = await server.getPrimaryService(serviceId);
    if (!service) {
      throw new Error(
        `Bluetooth GATT Service not found: ${getShortHexCode(serviceId)}`
      );
    }

    characteristic = await service.getCharacteristic(characteristicId);
  } catch (e) {
    Log.error("[ERROR:writeCharacteristicValue]", e);
    return false;
  }

  if (characteristic) {
    // Log.log('characteristic.properties:', characteristic.properties);
    return await setCharacteristicValue(characteristic, characteristicValue, bytes);
  }

  return false;
}
