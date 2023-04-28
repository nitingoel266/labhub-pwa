import { initSetup as initSetupMock, uninitSetup as uninitSetupMock } from "./setup";
import { applicationMessage } from "./status";

export const initSetup = async (): Promise<boolean> => {
  if (!{}) {
    return await initSetupMock();
  }
  applicationMessage.next({ type: 'info', message: 'Awesome! Your deploy is complete.' });
  return true;
};

export const uninitSetup = async () => {
  await uninitSetupMock();
};
