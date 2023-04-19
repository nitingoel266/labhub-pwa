import { DEBUG_MODE } from "./const";

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export class Log {
  static error = (...args: any[]) => {
    console.error(...args);
  };

  static warn = (...args: any[]) => {
    console.warn(...args);
  };

  static log = (...args: any[]) => {
    console.log(...args);
  };

  static debug = (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  };
}
