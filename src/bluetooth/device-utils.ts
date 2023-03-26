import { ControlOperation } from "./device-types";
import { LeaderOperation, SetupData } from "../types/common";

export function getByteArray(num: number | null, bytes = 1, length?: number): Uint8Array | null {
  if (typeof num === 'number' && !Number.isNaN(num)) {
    let buffer;
    if (bytes === 2) {
      buffer = Uint16Array.of(num).buffer;
    } else { // bytes == 1
      buffer = Uint8Array.of(num).buffer;
    }
    return new Uint8Array(buffer);
  } else if (num === null && length !== undefined && length > 0) {
    let buffer;
    if (bytes === 2) {
      buffer = new Uint16Array(length).buffer;
    } else { // bytes == 1
      buffer = new Uint8Array(length).buffer;
    }
    return new Uint8Array(buffer);
  }

  return null;
}

export function getArrayBuffer(...byteArray: (Uint8Array | null)[]): ArrayBuffer | null {
  const isSomeNull = byteArray.some(b => b === null);
  if (byteArray.length === 0 || isSomeNull) {
    return null;
  }

  const arr = new Uint8Array((byteArray as any[]).reduce((a, b) => [...a, ...b]));
  return arr.buffer;
}

export function getDataRateN(dataRate: SetupData['dataRate']) {
  return dataRate === 'user' ? 0 : dataRate;
}

export function getDataRate(dataRateN: number): SetupData['dataRate'] {
  return (dataRateN === 0 ? 'user' : dataRateN) as any;
}

export function getDataSampleN(dataSample: SetupData['dataSample']) {
  return dataSample === 'cont' ? 0 : dataSample;
}

export function getDataSample(dataSampleN: number): SetupData['dataSample'] {
  return (dataSampleN === 0 ? 'cont' : dataSampleN) as any;
}

export function getOperationN(operation: LeaderOperation): ControlOperation {
  if (operation === null) {
    return ControlOperation.OP_IDLE;
  }
  switch (operation) {
    case 'measure_temperature':
      return ControlOperation.OP_MEASURE_TEMPERATURE;
    case 'measure_voltage':
      return ControlOperation.OP_MEASURE_VOLTAGE;
    case 'heater_control':
      return ControlOperation.OP_HEATER_MANUAL_CONTROL;
    case 'rgb_calibrate':
      return ControlOperation.OP_RGB_CALIBRATE;
    case 'rgb_measure':
      return ControlOperation.OP_RGB_MEASURE;
    default:
      break;
  }
  return ControlOperation.OP_IDLE;
}

export function getOperation(operationN: ControlOperation): LeaderOperation {
  switch (operationN) {
    case ControlOperation.OP_IDLE:
      return null;
    case ControlOperation.OP_MEASURE_TEMPERATURE:
      return 'measure_temperature';
    case ControlOperation.OP_MEASURE_VOLTAGE:
      return 'measure_voltage';
    case ControlOperation.OP_HEATER_MANUAL_CONTROL:
      return 'heater_control';
    case ControlOperation.OP_RGB_CALIBRATE:
      return 'rgb_calibrate';
    case ControlOperation.OP_RGB_MEASURE:
      return 'rgb_measure';
    default:
      break;
  }
  return null;
}
