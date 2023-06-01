import { useEffect, useState } from "react";
import { BehaviorSubject } from 'rxjs';
import IButtonContent from "./IButtonContent";

const mobileWidth = 414;
const LEADER_SELECTIONMODAL_INITIATE = process.env.REACT_APP_ENV === 'prod' ? 15000 : 5000;
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
    let fileName = getFormat(new Date().getMonth()+1)
    fileName += getFormat(new Date().getDate());
    fileName += String(new Date().getFullYear()).slice(2);
    fileName += "-";
    fileName += getFormat(new Date().getHours());
    fileName += getFormat(new Date().getMinutes());
    fileName += "-";
    return fileName;

}
const getTitle = (Prefix:any, clientId:any,status:any) => {
    let fileName = Prefix + getFileName();
    if (clientId === status?.leaderSelected) {
    // for leader
    fileName += "L";
    } else if (clientId) {
    fileName +=
        "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
    }
    return fileName
}

const getStorageData = (title:string)=> {
    let result = [];
    for (var key in localStorage){
        if(key.includes(`${title}_`)){
            result.push(JSON.parse(localStorage[key]))
        }
     }
     return result;
}

const getStorageKeys = (title:string) => {
    let result = [];
    for (var key in localStorage){
        if(key.includes(`${title}_`)){
            result.push({name:key})
        }
     }
     return result;
}

const getShortedData = (data:any) => {
    if(data && Array.isArray(data)){
        return data.sort((a:any,b:any) => {
            let aTime = Number(`${a?.time.includes("PM") ? Number(a?.time.slice(0,2))+12 : a?.time.slice(0,2)}${a?.time.slice(3,5)}`);
            let BTime = Number(`${b?.time.includes("PM") ? Number(b?.time.slice(0,2))+12 : b?.time.slice(0,2)}${b?.time.slice(3,5)}`);
            return BTime - aTime
        });
    }
}

const validateFileName:any = (data:any,fileName:string,count=0) => {
    let alreadyExists = false;
     for(let one of data){
            if(one && one.name && one.name.includes(`${fileName}`)){
                alreadyExists = true;
                break;
            }
    }
    if(alreadyExists){
        fileName.indexOf("(")
       return validateFileName(data,fileName.includes("(") ? `${fileName.slice(0,fileName.indexOf("("))}(${count + 1 })` :`${fileName}(${count + 1})`,count + 1)
    }
    else return fileName
}

const getDate = () => {
    let date = `${getFormat(new Date().getMonth()+1)}-${getFormat(new Date().getDate())}-${new Date().getFullYear()}`;
    return date;
}
const getTime = () => {
    let time = ( Number(new Date().getHours()) > 12 ? getFormat(Number(new Date().getHours())-12) : getFormat(new Date().getHours()) ) + "." + getFormat(new Date().getMinutes()) + (Number(new Date().getHours()) > 12 ? 'PM' : 'AM');
    return time;
}

const  useIsTouchDeviceDetect =() => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
      if (!window.matchMedia) return;
      setIsTouchDevice(window.matchMedia("(pointer:coarse)").matches);
    }, []);
  
    return isTouchDevice;
  }

// for toast

const toastMessage = new BehaviorSubject<string | ToastInfo | null>(null);

const useToastMessage = () => {
    const [value, setValue] = useState<ToastInfo | null>(() => assertToastMessage(toastMessage.value));
  
    useEffect(() => {
      const subs = toastMessage.subscribe((value) => setValue(assertToastMessage(value)));
      return () => subs.unsubscribe();
    }, []);
  
    return [value];
  };
  
  function assertToastMessage(value: string | ToastInfo | null) {
    if (typeof value === 'string') {
      return { timmer: 3000, message: value } as ToastInfo;
    } else {
      return value;
    }
}

export interface ToastInfo {
    timmer?:number;
    message: string;
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
    getFileName,
    getTitle,
    getDate,
    getTime,
    validateFileName,
    getStorageData,
    getStorageKeys,
    getShortedData,

    useIsTouchDeviceDetect,

    useToastMessage,
    toastMessage
}