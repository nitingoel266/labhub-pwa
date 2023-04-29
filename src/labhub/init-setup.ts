import { initSetup as initSetupMock, uninitSetup as uninitSetupMock } from "./setup";

export const initSetup = async (): Promise<boolean> => {
  return await initSetupMock();
};

export const uninitSetup = async () => {
  await uninitSetupMock();
};
