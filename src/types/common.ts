export interface DeviceStatus {
  deviceName: string;
  deviceVersion: string;
  batteryLevel: number;  // in percentage
  leaderSelected: string | null;  // leader ID
  membersJoined: string[];
  modeSelected: 'Manual Mode' | 'Project Mode' | null;
  functionSelected: string | null;  // Data Setup, Sensors, Heater, and RGB Spect
}

export interface DeviceStatusUpdate {
  leaderSelected?: string | null;
  memberJoined?: string | null;
  modeSelected?: 'Manual Mode' | 'Project Mode' | null;
  resetAll?: boolean;
}
