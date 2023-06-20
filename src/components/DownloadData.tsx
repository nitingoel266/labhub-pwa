import {toastMessage} from "../components/Constants";

type Props = {
  header?: any;
  data: any;
};

const DownloadData = ({ data, header }: Props) => {
  var csv: any = "";
  if(header && header[2] === "GREEN" && data?.isCalibratedAndTested){
    csv += "Calibrated and Tested";
    csv += "\n";
  }
  if (header) {
    for (let one of header) {
      csv += one + ",";
    }
    csv += "\n";
  }
  // csv += data.name + '\n';
  if (data && data.data && data.data.length > 0) {
    for(let one of data.data){
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
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = data.name + ".csv";
  hiddenElement.click();
  toastMessage.next(`File saved as ${data.name}.csv`)
};

export default DownloadData;
