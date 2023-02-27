export type ModeSelect = 'manual' | 'project' | null;
export type FuncSelect = 'data_setup' | 'sensor' | 'heater' | 'rgb_spect' | null;

export interface NavStatus {
  modeSelected: ModeSelect;
  funcSelected: FuncSelect;
}

export interface NavStatusUpdate {
  modeSelected?: ModeSelect;
  funcSelected?: FuncSelect;
}
