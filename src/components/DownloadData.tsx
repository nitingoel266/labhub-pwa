type Props = {
  header?: any;
  data: any;
};

const DownloadData = ({ data, header }: Props) => {
  var csv: any = "";
  if (header) {
    for (let one of header) {
      csv += one + ",";
    }
    csv += "\n";
  }
  // csv += data.name + '\n';
  if (data && data.data && data.data.length > 0) {
    for(let one of data.data){
      csv += one.time;
      csv += "," + one.temp;
      csv += "\n";
    }
  }
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = data.name + ".csv";
  hiddenElement.click();
};

export default DownloadData;
