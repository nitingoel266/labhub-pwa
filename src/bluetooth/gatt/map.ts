import serviceListJson from "./gatt-services-list.json";
import characteristicListJson from "./gatt-characteristics-list.json";
import { Log } from "../../utils/utils";

interface DataItem {
  id: string;
  short_id: string;
  name: string;
  code: string;
}
type ServiceItem = DataItem;
type CharacteristicItem = DataItem;

export const serviceListMap = new Map<string, ServiceItem>();
export const characteristicListMap = new Map<string, CharacteristicItem>();
const serviceListMap2 = new Map<string, ServiceItem>();
const characteristicListMap2 = new Map<string, CharacteristicItem>();

export const getShortHexCode = (uuid: number | string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  let hexCode;
  if (typeof uuid === "number") {
    hexCode = `0x${uuid.toString(16).toUpperCase()}`;
  } else if (uuid.length === 32 + 4 && regexExp.test(uuid)) {
    // uuid
    hexCode = `0x${uuid.substring(4, 8).toUpperCase()}`;
  } else {
    hexCode = uuid;
  }
  return hexCode;
};

const initServiceListMap = () => {
  serviceListJson.forEach((service) => {
    const short_id = service.id.substring(service.id.lastIndexOf(".") + 1);
    const serviceItem: ServiceItem = {
      id: service.id,
      short_id,
      name: service.name,
      code: service.code,
    };

    const serviceHexCode = getShortHexCode(service.code);
    serviceListMap.set(serviceHexCode, serviceItem);
    if (serviceListMap2.get(short_id)) {
      Log.error(`[ERROR:initServiceListMap] service name conflict: ${short_id}`);
    } else {
      serviceListMap2.set(short_id, serviceItem);
    }
  });
};

const initCharacteristicListMap = () => {
  characteristicListJson.forEach((characteristic) => {
    const short_id = characteristic.id.substring(
      characteristic.id.lastIndexOf(".") + 1
    );
    const characteristicItem: CharacteristicItem = {
      id: characteristic.id,
      short_id,
      name: characteristic.name,
      code: characteristic.code,
    };

    const characteristicHexCode = getShortHexCode(characteristic.code);
    characteristicListMap.set(characteristicHexCode, characteristicItem);
    if (characteristicListMap2.get(short_id)) {
      Log.error(`[ERROR:initCharacteristicListMap] characteristic name conflict: ${short_id}`);
    } else {
      characteristicListMap2.set(short_id, characteristicItem);
    }
  });
};

export function initGattMap() {
  if (!serviceListMap.size) {
    initServiceListMap();
  }
  if (!characteristicListMap.size) {
    initCharacteristicListMap();
  }
}
