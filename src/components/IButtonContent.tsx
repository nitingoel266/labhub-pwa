const Manual_Mode="This mode requires you to choose which sensors to use and to set sampling rate and other data collection parameters.";
const Preset_Mode = "This mode can only be used with certain investigations. When utilized it automatically chooses the sensor and data collection parameters required for the selected investigation.";
const Data_Setup ="This allows you to change the sampling rate and other data acquisition parameters.";
const Sensors = "This begins the process of taking and graphically displaying measurements with the connected sensor (temperature or voltage).";
const Heater = "This allows you to set the desired temperature set point and whether to utilize the temperature probe or heater to reach the set point.";
const RGB_Spect = "This connects you to the RGB calibration procedure.";
const Data_Rate = "Choose your desired data sampling rate: 1 s, 5 s, 10 s, 30 s, 	1 min, 10 min, 30 min, 1 hr, USER (manually select when each measurement is recorded).";
const Number_of_samples = "Choose the number of samples to take: 5, 10, 	25, 50, 100, 200, CONT (no set endpoint).";
const Heater_Element = "This mode requires you to choose which sensors to use and to set sampling rate and other data collection parameters.";
const Temperature_Probe = "This mode is currently contains no any parameters.";
const Setpoint_Temperature = "This step setpoint to the temperature.";
const Measure_Absorbance = "This step measures the RGB absorption levels for a sample.";
const Calibrate_Spectrophotometer = "This important initial step calibrates the spectrophotometer to whatever is in the reference cuvette.";
const Calibrate = "This important initial step calibrates the spectrophotometer to whatever is in the reference cuvette.";
const Test_Calibrate = "This step retests the reference cuvette to check that the RGB calibration was successful.";
const Measure = "This step measures the RGB absorption levels for a sample"

const IButtonContent:any = {
    Manual_Mode,
    Preset_Mode,
    Data_Setup,
    Sensors,
    Heater,
    RGB_Spect,
    Data_Rate,
    Number_of_samples,
    Measure_Absorbance,
    Calibrate_Spectrophotometer,
    Heater_Element,
    Setpoint_Temperature,
    Temperature_Probe,
    Calibrate,
    Test_Calibrate,
    Measure
}

export default IButtonContent