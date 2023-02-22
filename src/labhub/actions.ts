import { deviceStatusUpdate } from './status';

export const setLeader = (leaderId: string | null) => {
  deviceStatusUpdate.next({ leaderSelected: leaderId });
};

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  deviceStatusUpdate.next({ modeSelected: mode });
};

// export const setSelectedFunction = (func: string) => {
//   deviceStatusUpdate.next({ functionSelected: func });
// };
