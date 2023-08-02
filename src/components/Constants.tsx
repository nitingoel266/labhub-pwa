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
const getDataSample:any = {5:5,10:10,25:25,50:50,100:100,200:200,"Continuous":'cont'};
const dataRateOption:any =['1 SEC','5 SEC','10 SEC','30 SEC','1 MIN','10 MIN','30 MIN','1 HOUR','USER'];
const dataSampleOption:any = [5,10,25,50,100,200,'Continuous'];

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

const getDeviceClientName = (clientId:any,status:any) => {
  let name = status?.deviceName;
  if (clientId === status?.leaderSelected) {
    // for leader
    name += "-L";
    } else if (clientId) {
    // name +=
    //     "-M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
    name +="-M";
    }
  return name
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

const getShareFile = (item:any,selectedButton:string) => {

    let header:any = ["Time (Sec)", "Temperature (°C)"];
    if (selectedButton === "voltage") header = ["Time (Sec)", "Voltage (V)"];
    else if (selectedButton === "rgb")
      header = ["Measurement No.", "RED", "GREEN", "BLUE"];
    
    let csv:any = "";
    if(item?.date){
      csv += `${getDayName(new Date(item.date).getDay())}, ${getMonthName(new Date(item.date).getMonth())} ${new Date(item.date).getDate()} ${new Date(item.date).getFullYear()}`;
      csv += "\n";
    }
    if(item?.time){
      csv += `${item?.time}`;
      csv += "\n";
    }
    if(item?.name){
      csv += `${item?.name}`;
      csv += "\n";
    }
    if(header && header[2] === "GREEN" && item?.isCalibratedAndTested){
      csv += "Calibrated and Tested";
      csv += "\n";
    }
    if (header) {
      for (let one in header) {
        csv += header[one] + (Number(header.length) - 1 !== Number(one) ? "," : "");
      }
      csv += "\n";
    }
    // csv += data.name + '\n';
    if (item && item.data && item.data.length > 0) {
      for(let one of item.data){
        if(header && header[1] === "Temperature (°C)"){
          csv += one.time;
          csv += "," + one.temp;
        }else if(header && header[1] === "Voltage (V)"){
          csv += one.time;
          csv += "," + one.voltage;
        }else if(header && header[2] === "GREEN"){
          csv += one["Measuement No"];
          csv += "," + one['RED'];
          csv += "," + one['GREEN'];
          csv += "," + one['BLUE'];
  
        }
        csv += "\n";
      }
    }
    const file = new File([csv], `${item?.name}.csv`,{type:"text/csv"});
    // console.log("???????? ",file)

    return file;
}

const getShareRawFileData = (item:any,selectedButton:string) => {

  let header:any = ["Time (Sec)", "Temperature (°C)"];
  if (selectedButton === "voltage") header = ["Time (Sec)", "Voltage (V)"];
  else if (selectedButton === "rgb")
    header = ["Measurement No.", "RED", "GREEN", "BLUE"];
  
  let csv:any = "";
  if(item?.date){
    csv += `${getDayName(new Date(item.date).getDay())}, ${getMonthName(new Date(item.date).getMonth())} ${new Date(item.date).getDate()} ${new Date(item.date).getFullYear()}`;
    csv += "\n";
  }
  if(item?.time){
    csv += `${item?.time}`;
    csv += "\n";
  }
  if(item?.name){
    csv += `${item?.name}`;
    csv += "\n";
  }
  if(header && header[2] === "GREEN" && item?.isCalibratedAndTested){
    csv += "Calibrated and Tested";
    csv += "\n";
  }
  if (header) {
    for (let one in header) {
      csv += header[one] + (Number(header.length) - 1 !== Number(one) ? ", " : "");
    }
    csv += "\n";
  }
  // csv += data.name + '\n';
  if (item && item.data && item.data.length > 0) {
    for(let one of item.data){
      if(header && header[1] === "Temperature (°C)"){
        csv += one.time;
        csv += "," + one.temp;
      }else if(header && header[1] === "Voltage (V)"){
        csv += one.time;
        csv += "," + one.voltage;
      }else if(header && header[2] === "GREEN"){
        csv += one["Measuement No"];
        csv += "," + one['RED'];
        csv += "," + one['GREEN'];
        csv += "," + one['BLUE'];

      }
      csv += "\n";
    }
  }
  // const file = new File([csv], `${item?.name}.csv`,{type:"text/csv"});
  // console.log("???????? ",file)
  // return file;
  return csv;
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
    let date = `${getFormat(new Date().getMonth()+1)}/${getFormat(new Date().getDate())}/${new Date().getFullYear()}`;
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

const showLoader = new BehaviorSubject<boolean>(false);

const useShowLoader = () => {
    const [value, setValue] = useState<boolean>(showLoader.value);
  
    useEffect(() => {
      const subs = showLoader.subscribe((value) => setValue(value));
      return () => subs.unsubscribe();
    }, []);
  
    return [value];
  };

const currentURL = new BehaviorSubject<string | null>(null);

const useCurrentUrl = () => {
    const [value, setValue] = useState<string | null>(currentURL.value);
  
    useEffect(() => {
      const subs = currentURL.subscribe((value) => setValue(value));
      return () => subs.unsubscribe();
    }, []);
  
    return [value];
  };

const previousURL = new BehaviorSubject<string | null>(null);

const usePreviousUrl = () => {
    const [value, setValue] = useState<string | null>(previousURL.value);
  
    useEffect(() => {
      const subs = previousURL.subscribe((value) => setValue(value));
      return () => subs.unsubscribe();
    }, []);
  
    return [value];
  };

const urlPathsHistory = new BehaviorSubject<string[]>([]);

const useUrlPathsHistory = () => {
      const [value, setValue] = useState<string[]>(urlPathsHistory.value);
    
      useEffect(() => {
        const subs = urlPathsHistory.subscribe((value) => setValue(value));
        return () => subs.unsubscribe();
      }, []);
    
      return [value];
  };

const getDayName = (index:number) => {
  const dayJson:any = {1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday",7:"Sunday"};
  if(index)
  return dayJson[index]
}

const getMonthName = (index:number) => {
  const dayJson:any = {0:"January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"};
  if(index)
  return dayJson[index]
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
    getDeviceClientName,
    getDate,
    getTime,
    validateFileName,
    getStorageData,
    getStorageKeys,
    getShortedData,

    useIsTouchDeviceDetect,

    useToastMessage,
    toastMessage,

    showLoader,
    useShowLoader,

    usePreviousUrl,
    previousURL,
    useCurrentUrl,
    currentURL,

    useUrlPathsHistory,
    urlPathsHistory,

    getShareFile,
    getShareRawFileData,

    getDayName,
    getMonthName
}