export enum ControlOperation {
  OP_IDLE = 0,
  OP_MEASURE_TEMPERATURE,
  OP_MEASURE_VOLTAGE,
  OP_HEATER_CALIBRATE,  // unused
  OP_HEATER_MANUAL_CONTROL,
  OP_HEATER_AUTO_CONTROL,
  OP_RGB_CALIBRATE,
  OP_RGB_MEASURE,
  OP_RAW_MEASURE,  // unused
  NUM_OPS  /* NUM_OPS = 9 */
}

export enum TimerControl {
  STOP_RESET = 0,
  RUN,
  RESTART
}

export enum ExperimentDataType {
  NONE = 0,
  MEASURE,
  HEATER,
  RGB,
  RAW
}

// #define STATUS_FAULT_NONE 0
// #define STATUS_FAULT_TIMER_RUN (1U << 0)
// #define STATUS_FAULT_CHARGING (1U << 1)
// #define STATUS_FAULT_CHARGE_FAULT (1U << 2)
type StatusFaultBitArray = number;

// #define SENSOR_ATTACH_NONE 0
// #define SENSOR_ATTACH_TEMP_PROBE (1U << 0)
// #define SENSOR_ATTACH_VOLT_PROBE (1U << 1)
// #define SENSOR_ATTACH_HEATER_PROBE (1U << 2)
type SensorAttachBitArray = number;

// #define DATA_RATE_MIN 1
// #define DATA_RATE_MAX (60 * 60)
// #define NUM_SAMPLES_MIN 0
// #define NUM_SAMPLES_MAX 1800
// #define TEMP_SETPOINT_MIN 0
// #define TEMP_SETPOINT_MAX 20000

interface SensorData {
  // data series [(N-2), (N-1), (N)], (0xffff = measurement not collected)
  // temp (degrees C*100) or volt (volts V*100) measurements
  data_series: [number, number, number];  // uint16_t[3]
}

interface HeaterData {
  power: number; // uint16_t: heater power in mW
  probe_temp: number; // uint16_t: degrees C*100, (0xffff = measurement data not available)
  tbd: number; // uint16_t
}

interface RgbData {
  // array of RGB values [R,G,B], (0xffff = measurement data not available)
  value: [number, number, number];  // uint16_t[3]
}

interface RawData {
  // current ADC values, (0xffff = measurement data not available)
  value: [number, number, number];  // uint16_t[3]
}

// DEVICE_SETUP_CHAR = 0x4307;  // W (admin)
interface DeviceSetup {
  cmd: number; // uint8_t: 0=store to NVM, 1 = reset device
  number_of_connections: number;  // uint8_t: 1-7, (default) 7
  device_name: string; // uint8_t[DEVICE_NAME_STRLEN_MAX+1]
  // 0x 00 07 6c 61 62 68 75 62 62 74 2d 31 000000000000
  //          l  a  b  h  u  b  b  t  -  1  \0
}

// EXPERIMENT_STATUS_CHAR = 0x4301;  // N
// Experiment Status Struct [DONE]
// max 20 bytes for BLE notify without modifying message structure
interface ExperimentStatus {
  timer_control: TimerControl;  // uint8_t: (default) 0=stop/reset, 1=run, 2=restart
  operation: ControlOperation;  // uint8_t: (default) OP_IDLE
  data_type: ExperimentDataType;  // uint8_t: 0=none, 1=meas, 2=heater, 3=rgb, 4=raw
  status_fault: StatusFaultBitArray; // uint8_t: bit_array[]
  battery_level: number;  // uint8_t: 0-100(%) or level 0-3 or ???
  sensor_attach: SensorAttachBitArray;  // uint8_t: bit_array[heater, voltage, temperature]

  data_rate: number;  // uint16_t: [1-3600] seconds, (default) 1 second
  num_of_samples: number;  // uint16_t: [0-1800] num of samples, (default) 0=continuous
  current_sample: number;  // uint16_t: [0-1799] sample index, 0=continuous
  heater_temp_setpoint: number;  // uint16_t: [0-20000] degrees C*100

  data: null | SensorData | HeaterData | RgbData | RawData; // uint16_t[3]
}

// EXPERIMENT_DATA_SERIES_CHAR = 0x4302;  // RW (data log)
// Experiment Data Series Struct
interface ExperimentDataSeries {
  index: number; // uint16_t: [0-1790] starting index for sample data series
  data: number[]; // uint16_t[10]: [(N), (N+1) ... (N+9)], (0xffff = measurement not collected)
}

// EXPERIMENT_CONTROL_CHAR = 0x4303;  // W (leader)
// Experiment Control Struct [DONE]
export interface ExperimentControl {
  timer_control: TimerControl;  // uint8_t: (default) 0=stop/reset, 1=run, 2=restart
  operation: ControlOperation;  // uint8_t: (default) OP_IDLE

  data_rate: number;  // uint16_t: [1-3600] seconds, (default) 1 second
  num_of_samples: number;  // uint16_t: [0-1800] num of samples, (default) 0=continuous
  heater_temp_setpoint: number;  // uint16_t: [0-20000] degrees C*100, (default) 2000 (20C)

  // 0x 00 06 0100 2000 ac0d (rgb_calibrate?/Experiment Setup/Stop)

  // 0x 01 01 0100 2000 ac0d (Temperature experiment run)
  // 0x 01 02 0100 2000 ac0d (Voltage experiment run)

  // 0x 02 01 0100 2000 ac0d (Temperature experiment restart)
  // 0x 02 02 0100 2000 ac0d (Voltage experiment restart)

  // 0x 01 04 0100 2000 ac0d (heater_manual_control? experiment run)
  // 0x 01 05 0100 2000 ac0d (heater_auto_control?? experiment run)

  // 0x 01 06 0100 2000 ac0d (RGB Calibrate run)
  // 0x 01 07 0100 2000 ac0d (RGB Measure run)
}

// LEADER_STATUS_CHAR = 0x4308;  // R, W (leader)
export interface LeaderStatus {
  screen_number: number; // uint16_t
}
