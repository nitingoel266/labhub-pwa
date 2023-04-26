import { Log } from "../utils/utils";
import { getShortHexCode } from "./gatt/map";
import {
  getServiceItem,
  getCharacteristicTuple,
  setCharacteristicValue,
} from "./gatt/utils";

const characteristicsCache = new Map<string, BluetoothRemoteGATTCharacteristic>();

export async function getCachedCharacteristic(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string,
  characteristicId: number | string,
) {
  let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  try {
    if (!server || !serviceId || !characteristicId) {
      throw new Error("Invalid arguments passed!");
    }

    const key = `${server.device.id}.${getShortHexCode(serviceId)}.${getShortHexCode(characteristicId)}`;
    const cachedValue = characteristicsCache.get(key);
    if (cachedValue) {
      return cachedValue;
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
    characteristicsCache.set(key, characteristic);
  } catch (e) {
    Log.error("[ERROR:getCachedCharacteristic]", e);
  }

  return characteristic;
}

export function clearCharacteristicsCache(keyPrefix?: string) {
  if (!keyPrefix) {
    characteristicsCache.clear();
  } else {
    for (const key of characteristicsCache.keys()) {
      if (key.startsWith(keyPrefix)) {
        characteristicsCache.delete(key);
      }
    }
  }
}

export async function readCharacteristicValue<T = string | number | ArrayBuffer>(
  server: BluetoothRemoteGATTServer | null,
  serviceId: number | string,
  characteristicId: number | string,
  valueType: 'int8' | 'int16' | 'string' | 'buffer'
) {
  const characteristic = await getCachedCharacteristic(server, serviceId, characteristicId);
  if (!characteristic) {
    Log.error("[ERROR:readCharacteristicValue] Unable to read characteristic value", getShortHexCode(serviceId), getShortHexCode(characteristicId));
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
  const characteristic = await getCachedCharacteristic(server, serviceId, characteristicId);
  if (!characteristic) {
    Log.error("[ERROR:writeCharacteristicValue] Unable to write characteristic value", getShortHexCode(serviceId), getShortHexCode(characteristicId));
    return false;
  }

  if (characteristic) {
    // Log.log('characteristic.properties:', characteristic.properties);
    return await setCharacteristicValue(characteristic, characteristicValue, bytes);
  }

  return false;
}
