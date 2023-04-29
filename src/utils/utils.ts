import { DEBUG_MODE } from "./const";

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const roundTwoDec = (value: number) => {
  return Math.round(value * 100) / 100;
};

export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

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
