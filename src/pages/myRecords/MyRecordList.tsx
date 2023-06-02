import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import MyRecordsCard from "../../components/MyRecordsCard";
import RightArrow from "../../components/RightArrow";
import { TEMPERATURE_DATA, VOLTAGE_DATA, RGB_DATA } from "../../utils/const";
import {getStorageData,validateFileName,getStorageKeys,getShortedData,toastMessage} from "../../components/Constants";
import styles from "../../styles/myRecordList.module.css";
import EditFileModal from "../../components/Modal/EditFileModal";

const MyRecordList = () => {
  const navigate = useNavigate();
  const [isOpen, setModal] = useState("");
  const [isEditOpen, setEditModal] = useState("");
  const [selectedData, setSelectedData] = useState<any>();
  const [selectedButton, setSelectedButton] = useState<string>("temperature"); // temperature , voltage ,rgb
  const [actionItem, setActionItem] = useState<any>(); // contain one data that will change by the action
  const [myRecords, setMyRecords] = useState<any>();

  const handleSubmit = () => {
    navigate(`/${selectedButton}-records`, {
      state: { data: { selectedData, selectedButton } },
    });
  };
  const handleDelete = () => {
    if (
      isOpen === "delete" &&
      selectedButton &&
      actionItem &&
      actionItem.name
    ) {
      setModal("");
      localStorage.removeItem(`${selectedButton}_data_${actionItem.name}`)
      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(getStorageData(`${selectedButton}_data`))
      });
      toastMessage.next("File deleted!")
    }
  };
  const handleDeleteMobile = (item: any) => {
    if (selectedButton && item && item.name) {
      localStorage.removeItem(`${selectedButton}_data_${item.name}`)

      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(getStorageData(`${selectedButton}_data`))
      });
      toastMessage.next("File deleted!")
    }
  };
  const handleActionItem = (item: any, action: any) => {
    setActionItem(item);
    setModal(action);
  };
  const handleEdit = () => {
    if (
      isOpen === "edit" &&
      selectedButton &&
      actionItem &&
      actionItem.name
    ){
      setModal("")
      setEditModal(actionItem)
    }
  };
  const EditFileName = (data:any,fileName:string) => {
    if(data && fileName && data.name && selectedButton){
      let verifiedFileName = validateFileName(getStorageKeys(`${selectedButton}_data`),fileName);
      let updatedData = {...data,name:verifiedFileName}
      let storageData = JSON.stringify(updatedData)
      localStorage.removeItem(`${selectedButton}_data_${data.name}`);
      localStorage.setItem(`${selectedButton}_data_${verifiedFileName}`,storageData)
      setEditModal("")
      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(getStorageData(`${selectedButton}_data`))
      });
      toastMessage.next("File renamed!")
    }
  }
  const handleShare = async (item: any, title?: string) => {
    if(item){
      if (!navigator.canShare) {
        console.log("Your browser doesn't support the Web Share API.")
        return;
      }
      try {
        let header:any = ["Time ( Sec )", "Temperature ( C )"];
        if (selectedButton === "voltage") header = ["Time ( Sec )", "Voltage (V)"];
        else if (selectedButton === "rgb")
          header = ["Measurement No.", "RED", "GREEN", "BLUE"];
        
        let csv:any = "";
        if(header && header[2] === "GREEN" && item?.isCalibratedAndTested){
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
        if (item && item.data && item.data.length > 0) {
          for(let one of item.data){
            if(header && header[1] === "Temperature ( C )"){
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
        let expType = (selectedButton.slice(0,1)).toLocaleUpperCase() + selectedButton.slice(1)
        await navigator.share({
          url:`${expType} Experiment data of ${item.name}`,
          text: `${expType} data of ${item?.name}`,
          title: `${expType} Experiment Data`, // Email subject
          files:[file]
        });
        console.log("data has been shared Successfully!")
      } catch (error) {
        console.error(error)
      }
      // console.log("share data",item)
    }
  };
  const handleSelection = (value: any) => {
    if (JSON.stringify(selectedData) === JSON.stringify(value)) {
      setSelectedData("");
    } else setSelectedData(value);
  };
  const getMyRecordData = (data: any) => {
    if (data) {
      let result: any = {};
      for (let one of data) {
        result[one?.date] = result[one?.date]
          ? { ...result[one?.date], data: [...result[one?.date]["data"], one] }
          : { date: one?.date, data: [one] };
      }
      let resultData = result && Object.values(result).sort((a:any,b:any) => (b.date && new Date(b.date)) - (a.date && new Date(a.date)));
      let sortedResult:any = [];
      for(let one of resultData){
        sortedResult.push({...one,data:getShortedData(one?.data)})
      }
      return Object.values(sortedResult);
    }
  };

  useEffect(() => {
    let resultData = {
      temperature: getMyRecordData(getStorageData(TEMPERATURE_DATA)),
      voltage: getMyRecordData(getStorageData(VOLTAGE_DATA)),
      rgb: getMyRecordData(getStorageData(RGB_DATA)),
    };
    setMyRecords(resultData);
  }, []);
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.myRecordWrapper}>
      <div className={styles.myRecordButtonWrapper}>
        <button
          aria-label="temperature button"
          onClick={() => setSelectedButton("temperature")}
          className={styles.myRecordButton}
          style={
            selectedButton === "temperature"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          Temperature
        </button>
        <button
          aria-label="voltage button"
          onClick={() => setSelectedButton("voltage")}
          className={styles.myRecordButton}
          style={
            selectedButton === "voltage"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          Voltage
        </button>
        <button
          aria-label="RGB button"
          onClick={() => setSelectedButton("rgb")}
          className={styles.myRecordButton}
          style={
            selectedButton === "rgb"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          RGB
        </button>
      </div>
      <div style={{ overflowY: "auto", height: window.innerHeight - 171 }}>
        {myRecords &&
          myRecords[selectedButton] &&
          myRecords[selectedButton].map((el: any) => (
            <MyRecordsCard
              key={el?.date}
              data={el}
              setModal={(value) => setModal(value)}
              setSelectedData={(value) => handleSelection(value)}
              selectedData={selectedData}
              selectedButton={selectedButton}
              handleActionItem={handleActionItem}
              handleDeleteMobile={handleDeleteMobile}
              handleShare={handleShare}
            />
          ))}
      </div>
      {isEditOpen && <EditFileModal isOpen = {isEditOpen} setEditModal ={(value:any) => setEditModal(value)} EditFileName={EditFileName} selectedButton = {selectedButton}/>}
      {isOpen && <MemberDisconnect
        isOpen={isOpen ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={isOpen === "delete" ? handleDelete : handleEdit}
        message={`Do you want to ${isOpen}.`}
      />}
      <RightArrow
        isSelected={selectedData ? true : false}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default MyRecordList;
