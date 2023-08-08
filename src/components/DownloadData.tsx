import {toastMessage} from "../components/Constants";
import {getDayName,getMonthName} from "./Constants";

type Props = {
  header?: any;
  data: any;
};

const DownloadData = ({ data, header}: Props) => {

  var csv: any = "";
  if(data?.date){
    csv += `${getDayName(new Date(data.date).getDay())} ${getMonthName(new Date(data.date).getMonth())} ${new Date(data.date).getDate()} ${new Date(data.date).getFullYear()}`;
    // csv += "\n";
  }
  if(data?.time){
    csv += `, ${data?.time}`;
    csv += "\n";
  }
  if(data?.name){
    if(data?.deviceWithClientName){
      csv += `${data?.deviceWithClientName}`;
      csv += "\n";
    }
    if(!data?.isCalibratedAndTested){
      csv += "\n";
    }
  }
  if(data?.storedBy){
    csv += `${data?.storedBy}`;
    csv += "\n";
  }

  if(header && header[2] === "GREEN" && data?.isCalibratedAndTested){
    csv += "Calibrated and Tested";
    csv += "\n";
    csv += "\n";
  }
  if (header) {
    let updateHeader = [...header]
    if(header[1] === "Temperature (°C)" && data?.storedBy){
      updateHeader.splice(1,0,"Set Point (°C)","Power (W)")
    }
    for (let one of updateHeader) {
      csv += one + ",";
    }
    csv += "\n";
  }
  // csv += data.name + '\n';
  if (data && data.data && data.data.length > 0) {
    for(let one of data.data){
      if(header && header[1] === "Temperature (°C)"){
        csv += one.time;
        if(data?.storedBy){
          csv += "," + one.setPoint;
          csv += "," + one.power;
        }
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
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = data.name + ".csv";
  hiddenElement.click();
  toastMessage.next(`File saved as ${data.name}.csv`)
};

export default DownloadData;
