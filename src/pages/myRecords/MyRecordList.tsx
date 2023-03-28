import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import MyRecordsCard from "../../components/MyRecordsCard";
import RightArrow from "../../components/RightArrow";
import { TEMPERATURE_DATA, VOLTAGE_DATA, RGB_DATA } from "../../utils/const";
import styles from "../../styles/myRecordList.module.css";

const MyRecordList = () => {
  const navigate = useNavigate();
  const [isOpen, setModal] = useState("");
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
      let storageData = localStorage.getItem(`${selectedButton}_data`);
      storageData = storageData ? JSON.parse(storageData) : [];
      let resultData =
        storageData && Array.isArray(storageData)
          ? [...storageData].filter((el: any) => el?.name !== actionItem.name)
          : [];
      localStorage.setItem(
        `${selectedButton}_data`,
        JSON.stringify(resultData)
      );
      let updatedData = localStorage.getItem(`${selectedButton}_data`);
      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(updatedData),
      });
    }
  };
  const handleDeleteMobile = (item: any) => {
    if (selectedButton && item && item.name) {
      let storageData = localStorage.getItem(`${selectedButton}_data`);
      storageData = storageData ? JSON.parse(storageData) : [];
      let resultData =
        storageData && Array.isArray(storageData)
          ? [...storageData].filter((el: any) => el?.name !== item.name)
          : [];
      localStorage.setItem(
        `${selectedButton}_data`,
        JSON.stringify(resultData)
      );
      let updatedData = localStorage.getItem(`${selectedButton}_data`);
      setMyRecords({
        ...myRecords,
        [selectedButton]: getMyRecordData(updatedData),
      });
    }
  };
  const handleActionItem = (item: any, action: any) => {
    setActionItem(item);
    setModal(action);
  };
  const handleEdit = () => {};
  const handleShare = (item: any, title: string) => {};
  const handleSelection = (value: any) => {
    if (JSON.stringify(selectedData) === JSON.stringify(value)) {
      setSelectedData("");
    } else setSelectedData(value);
  };
  const getMyRecordData = (data: any) => {
    if (data) {
      let result: any = {};
      for (let one of JSON.parse(data)) {
        result[one?.date] = result[one?.date]
          ? { ...result[one?.date], data: [...result[one?.date]["data"], one] }
          : { date: one?.date, data: [one] };
      }
      return Object.values(result);
    }
  };

  useEffect(() => {
    let tempData = localStorage.getItem(TEMPERATURE_DATA);
    let voltageData = localStorage.getItem(VOLTAGE_DATA);
    let rgbData = localStorage.getItem(RGB_DATA);
    let resultData = {
      temperature: getMyRecordData(tempData),
      voltage: getMyRecordData(voltageData),
      rgb: getMyRecordData(rgbData),
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
