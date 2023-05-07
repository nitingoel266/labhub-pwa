export const DEBUG_MODE = false;
export const DISABLE_RELOAD = false;
export const REUSE_CLIENTID_ONCONNREUSE = true;
export const MOCK_DATA = false;

export const TOPIC_DEVICE_STATUS = 'topic_device_status';
export const TOPIC_DEVICE_STATUS_UPDATE = 'topic_device_status_update';
export const TOPIC_DEVICE_DATA_FEED = 'topic_device_data_feed';
export const TOPIC_DEVICE_DATA_FEED_UPDATE = 'topic_device_data_feed_update';
export const TOPIC_CLIENT_CHANNEL = 'topic_client_channel';

export const TEMPERATURE_DATA = "temperature_data";
export const VOLTAGE_DATA = "voltage_data";
export const RGB_DATA = "rgb_data";


export const GetScreenName:any = {
    0:"/scan-devices",
    1:"/data-setup",
    // 2:"delvise list",//not in pwa screens
    3:"/method-selection",
    4:"/heater-element",
    5:"/function-selection",
    6:"/mode-selection",
    7:"/my-records",
    8:"/heater",
    9:"/rgb-records",
    10:"/rgb-spect",
    11:"/temperature-records",
    12:"/temperature-probe",
    13:"/voltage-records",
    14:"/sensors",
    15:"/calibrate-spectrophotometer",
    16:"/spectrophotometer-calibration", 
    17:"/calibration-testing",
    18:"/spectrophotometer-testing",
    19: /* /cuvette-insertion  */"/measure-absorbance",
    20:"/temperature-sensor",
    21:"/voltage-sensor",
}