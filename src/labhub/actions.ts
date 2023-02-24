import { LABHUB_CLIENT_ID } from '../utils/const';
import { deviceStatusUpdate } from './status';

export const joinAsLeader = () => {
  const leaderId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (leaderId) deviceStatusUpdate.next({ leaderSelected: leaderId });
};

export const resetLeader = () => {
  deviceStatusUpdate.next({ leaderSelected: null });
};

export const joinAsMember = () => {
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  if (clientId) deviceStatusUpdate.next({ memberJoined: clientId });
};

export const setSelectedMode = (mode: 'Manual Mode' | 'Project Mode' | null) => {
  deviceStatusUpdate.next({ modeSelected: mode });
};

// export const setSelectedFunction = (func: string) => {
//   deviceStatusUpdate.next({ functionSelected: func });
// };

export const resetAll = () => {
  deviceStatusUpdate.next({ resetAll: true });
};
