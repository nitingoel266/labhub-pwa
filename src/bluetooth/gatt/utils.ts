import { getShortHexCode, serviceListMap, characteristicListMap } from "./map";
import { Log } from "../../utils/utils";

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder(); // Always "utf-8"

export const getServiceItem = (serviceUuid: number | string) => {
  if (!serviceListMap.size) {
    return null;
  }
  const serviceHexCode = getShortHexCode(serviceUuid);
  return serviceListMap.get(serviceHexCode) || null;
};

export const getServiceName = (serviceUuid: number | string) => {
  if (!serviceListMap.size) {
    return "Unloaded service..";
  }
  const serviceHexCode = getShortHexCode(serviceUuid);
  return serviceListMap.get(serviceHexCode)?.name || "Unknown service";
};

// const getCharacteristicItem = (characteristicUuid: number | string) => {
//   if (!characteristicListMap.size) {
//     return null;
//   }
//   const characteristicHexCode = getShortHexCode(characteristicUuid);
//   return characteristicListMap.get(characteristicHexCode) || null;
// };

const getCharacteristicName = (characteristicUuid: number | string) => {
  if (!characteristicListMap.size) {
    return "Unloaded characteristic..";
  }
  const characteristicHexCode = getShortHexCode(characteristicUuid);
  return (
    characteristicListMap.get(characteristicHexCode)?.name ||
    "Unknown characteristic"
  );
};

export const getValueFromDataView = (val: DataView | ArrayBuffer, valueType: 'int8' | 'int16' | 'string' | 'buffer', byteOffset?: number) => {
  // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
  const dataView = (val as DataView).buffer ? (val as DataView) : new DataView(val as ArrayBuffer);

  let value: number | string | ArrayBuffer;
  if (valueType === 'int8') {
    value = dataView.getUint8(byteOffset ?? 0);
  } else if (valueType === 'int16') {
    value = dataView.getUint16(byteOffset ?? 0, /*littleEndian=*/true);
  } else if (valueType === 'string') {
    value = decoder.decode(dataView);
  } else {
    value = dataView.buffer;
  }
  return value;
};

export const getCharacteristicTuple = async <T = number | string | ArrayBuffer | undefined>(
  characteristic: BluetoothRemoteGATTCharacteristic,
  valueType: 'int8' | 'int16' | 'string' | 'buffer'
): Promise<[string, T | undefined]> => {
  const name = getCharacteristicName(characteristic.uuid);
  try {
    const val = await characteristic.readValue();
    const value = getValueFromDataView(val, valueType);

    Log.debug(`getCharacteristicTuple: [${name}, ${value}]`);
    return [name, value as T];
  } catch (e) {
    Log.error(`[ERROR:getCharacteristicTuple] Cannot read characteristic[${characteristic.uuid}]:`, e);
    return [name, undefined];
  }
};

export const printCharacteristic = async (
  characteristic: BluetoothRemoteGATTCharacteristic
) => {
  const [name, value] = await getCharacteristicTuple(characteristic, 'string');
  Log.log(`${name}:`, value);
};

export const setCharacteristicValue = async (
  characteristic: BluetoothRemoteGATTCharacteristic,
  value: number | string | ArrayBuffer,
  bytes?: number
): Promise<boolean> => {
  try {
    let bufferSource;
    if (typeof value === 'number') {
      if (bytes) {
        if (bytes === 1) {
          bufferSource = Uint8Array.of(value);
        } else if (bytes === 2) {
          bufferSource = Uint16Array.of(value);
        } else {
          Log.error('[ERROR:setCharacteristicValue] Unsupported value of bytes:', bytes);
          return false;
        }
      } else {
        Log.error('[ERROR:setCharacteristicValue] Number of bytes (1 for uint8, 2 for uint16) must be passed for type number');
        return false;
      }
    } else if (typeof value === 'string') {
      bufferSource = encoder.encode(value as string);
    } else {
      bufferSource = value;
    }

    if (characteristic.properties.write) {
      await characteristic.writeValueWithResponse(bufferSource);
      Log.debug('setCharacteristicValue: writeValueWithResponse successful!')
      return true;
    } else if (characteristic.properties.writeWithoutResponse) {
      await characteristic.writeValueWithoutResponse(bufferSource);
      Log.debug('setCharacteristicValue: writeValueWithoutResponse successful!')
      return true;
    } else {
      Log.error(`[Error:setCharacteristicValue] write not supported for characteristic[${characteristic.uuid}]:`);
    }
  } catch (e) {
    Log.error(`[ERROR:setCharacteristicValue] Cannot write characteristic[${characteristic.uuid}]:`, e);
  }

  return false;
};
