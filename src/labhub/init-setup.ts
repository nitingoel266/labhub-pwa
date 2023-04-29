import { uninitSetup as uninitSetupMock } from "./setup";
import { applicationMessage } from "./status";

export const initSetup = async (): Promise<boolean> => {
  // return await initSetupMock();
  applicationMessage.next({ type: 'info', message: 'Awesome! Your deploy is complete.' });
  return true;
};

export const uninitSetup = async () => {
  await uninitSetupMock();
};
