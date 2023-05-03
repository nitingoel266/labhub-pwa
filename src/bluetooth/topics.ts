import { BehaviorSubject } from "rxjs";
import { DeviceStatus, DeviceDataFeed } from "../types/common";

export const topicDeviceStatus = new BehaviorSubject<DeviceStatus | null>(null);

export const topicDeviceDataFeed = new BehaviorSubject<DeviceDataFeed>({
  sensor: null,
  heater: null,
  rgb: null,  
});

export const resetTopics = () => {
  topicDeviceStatus.next(null);
  topicDeviceDataFeed.next({
    sensor: null,
    heater: null,
    rgb: null,  
  });
};
