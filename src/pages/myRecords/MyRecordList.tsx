import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import MyRecordsCard from "../../components/MyRecordsCard";
import RightArrow from "../../components/RightArrow";
import { TEMPERATURE_DATA, VOLTAGE_DATA, RGB_DATA } from "../../utils/const";
import {getStorageData,validateFileName,getStorageKeys} from "../../components/Constants";
import styles from "../../styles/myRecordList.module.css";
import EditFileModal from "../../components/Modal/EditFileModal";

const MyRecordList = () => {
  const navigate = useNavigate();
  const [isOpen, setModal] = useState("");
  const [isEditOpen, setEditModal] = useState("");
  const [selectedData, setSelectedData] = useState<any>();
  const [selectedButton, setSelectedButton] = useState<string>("temperature");
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
    }
  };
  const handleDeleteMobile = (item: any) => {
    if (selectedButton && item && item.name) {
      localStorage.removeItem(`${selectedButton}_data_${item.name}`)

      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(getStorageData(`${selectedButton}_data`))
      });
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
    }
  }
  const handleShare = async (item: any, title?: string) => {
    if(item){
      if (!navigator.canShare) {
        console.log("Your browser doesn't support the Web Share API.")
        return;
      }
      try {
        await navigator.share({
          url:item,
          title: `${selectedButton}`,
          text: `${selectedButton} Experiment Data`,
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
      return Object.values(result);
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
    <div className={styles.myRecordWrapper}>
      <div className={styles.myRecordButtonWrapper}>
        <div
          onClick={() => setSelectedButton("temperature")}
          className={styles.myRecordButton}
          style={
            selectedButton === "temperature"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          Temperature
        </div>
        <div
          onClick={() => setSelectedButton("voltage")}
          className={styles.myRecordButton}
          style={
            selectedButton === "voltage"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          Voltage
        </div>
        <div
          onClick={() => setSelectedButton("rgb")}
          className={styles.myRecordButton}
          style={
            selectedButton === "rgb"
              ? { color: "#FFFFFF", backgroundColor: "#424C58" }
              : {}
          }
        >
          RGB
        </div>
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
      {isEditOpen && <EditFileModal isOpen = {isEditOpen} setEditModal ={(value:any) => setEditModal(value)} EditFileName={EditFileName} />}
      <MemberDisconnect
        isOpen={isOpen ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={isOpen === "delete" ? handleDelete : handleEdit}
        message={`Do you want to ${isOpen}.`}
      />
      <RightArrow
        isSelected={selectedData ? true : false}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default MyRecordList;
