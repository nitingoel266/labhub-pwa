import { navStatusUpdate } from './status-client';

export const setSelectedMode = (mode: 'manual' | 'project' | null) => {
  navStatusUpdate.next({ modeSelected: mode });
};

export const setSelectedFunction = (func: 'data_setup' | 'sensor' | 'heater' | 'rgb_spect' | null) => {
  navStatusUpdate.next({ funcSelected: func });
};
