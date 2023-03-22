import IButtonContent from "./IButtonContent";

const mobileWidth = 414;
const LEADER_SELECTIONMODAL_INITIATE = 5000;
const MANUAL_MODE = "Manual Mode";
const PRESET_MODE = "Preset Mode";
const DATA_SETUP = "Data Setup";
const SENSORS = "Sensors";
const HEATER = "Heater";
const RGB_SPECT = "RGB Spect";
const DATA_RATE ="Data Rate";
const NO_OF_SAMPLES = "Number of samples";
const HEATER_ELEMENT = "Heater Element";
const TEMPERATURE_PROBE= "Temperature Probe";
const SETPOINT_TEMPERATURE = "Setpoint Temperature";
const CALIBRATE_SPECTROPHOTOMETER = "Calibrate Spectrophotometer";
const MEASURE_ABSORBANCE = "Measure Absorbance";
const CALIBRATE = "Calibrate";
const TEST_CALIBRATE = "Test Calibrate";
const MEASURE = "Measure";

const HIGHLIGHT_BACKGROUND:any = {backgroundColor:"#9CD5CD"};

const getDataRate:any = {"1 SEC":1, '5 SEC':5, "10 SEC":10,'30 SEC':30,"1 MIN":60, "10 MIN":600 ,'30 MIN': 1800 ,'1 HOUR': 3600,'USER':'user'};
const getDataSample:any = {5:5,10:10,25:25,50:50,100:100,200:200,"CONT":'cont'};
const dataRateOption:any =['1 SEC','5 SEC','10 SEC','30 SEC','1 MIN','10 MIN','30 MIN','1 HOUR','USER'];
const dataSampleOption:any = [5,10,25,50,100,200,'CONT'];

const getDescription = (item:string) => {
    let result
    if(item){
        result = IButtonContent[item.replaceAll(" ","_")];
    }
    return result
}

const getFormat = (item:any) => {
    if(String(item).length  === 1){
        return '0'+item
    }
    return item
}

const getFileName = () => {
    let fileName = "T"+getFormat(new Date().getMonth()+1)
    fileName += getFormat(new Date().getDate());
    fileName += String(new Date().getFullYear()).slice(2);
    fileName += "-";
    fileName += getFormat(new Date().getHours());
    fileName += getFormat(new Date().getMinutes());
    fileName += "-";
    return fileName;

}

export {
    mobileWidth,
    LEADER_SELECTIONMODAL_INITIATE,
    MANUAL_MODE,
    PRESET_MODE,
    DATA_SETUP,
    SENSORS,
    HEATER,
    RGB_SPECT,
    DATA_RATE,
    NO_OF_SAMPLES,
    HEATER_ELEMENT,
    TEMPERATURE_PROBE,
    SETPOINT_TEMPERATURE,
    CALIBRATE_SPECTROPHOTOMETER,
    MEASURE_ABSORBANCE,
    CALIBRATE,
    TEST_CALIBRATE,
    MEASURE,


    HIGHLIGHT_BACKGROUND,

    getDataRate,
    getDataSample,
    dataRateOption,
    dataSampleOption,
    getDescription,
    getFileName
}