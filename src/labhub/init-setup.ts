import { initSetup as initSetupMock, uninitSetup as uninitSetupMock } from "./setup";
import { initSetup as initSetupDevice, uninitSetup as uninitSetupDevice } from "../bluetooth/setup";
import { MOCK_DATA } from "../utils/const";

export const initSetup = async (): Promise<boolean> => {
  if (MOCK_DATA) {
    return await initSetupMock();
  } else {
    return await initSetupDevice();
  }
};

export const uninitSetup = async () => {
  if (MOCK_DATA) {
    await uninitSetupMock();
  } else {
    await uninitSetupDevice();
  }
};
