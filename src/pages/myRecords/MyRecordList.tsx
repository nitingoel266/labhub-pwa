import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import MyRecordsCard from "../../components/MyRecordsCard";
import RightArrow from "../../components/RightArrow";
import styles from "../../styles/myRecordList.module.css";

const MyRecordList = () => {
  const navigate = useNavigate();
  const [isOpen, setModal] = useState("");
  const [selectedData, setSelectedData] = useState<any>();
  const [selectedButton, setSelectedButton] = useState<string>("temperature");
  const handleSubmit = () => {
    navigate(`/${selectedButton}-records`);
  };
  const handleDelete = () => {};
  const handleEdit = () => {};
  const handleSelection = (value: any) => {
    if (JSON.stringify(selectedData) === JSON.stringify(value)) {
      setSelectedData("");
    } else setSelectedData(value);
  };
  const data: any = {
    temperature: [
      {
        date: "03/02/2023",
        data: [
          { name: "T0918564122-1123-771", "last edited": "10.23PM", data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}] },
          { name: "T0918564122-1123-772", "last edited": "10.23PM",data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}] },
          { name: "T0918564122-1123-773", "last edited": "10.23PM" ,data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}]},
        ],
      },
      {
        date: "01/02/2023",
        data: [
          { name: "T0918564122-1123-774", "last edited": "10.23PM" ,data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}]},
          { name: "T0918564122-1123-775", "last edited": "10.23PM" ,data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}]},
        ],
      },
      {
        date: "21/01/2023",
        data: [
          { name: "T0918564122-1123-776", "last edited": "10.23PM" ,data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}]},
          { name: "T0918564122-1123-777", "last edited": "10.23PM" ,data: [{time:0,temp:80},{time:5,temp:50},{time:10,temp:40},{time:15,temp:30},{time:20,temp:35},{time:25,temp:45},{time:30,temp:50},{time:35,temp:60},{time:40,temp:65},{time:45,temp:80}]},
        ],
      },
    ],
    voltage: [
      {
        date: "01/02/2023",
        data: [
          { name: "T0918564122-1123-774", "last edited": "10.23PM" ,data: [{time:0,temp:1},{time:5,temp:5},{time:10,temp:8},{time:15,temp:10},{time:20,temp:12},{time:25,temp:6},{time:30,temp:5},{time:35,temp:0},{time:40,temp:-2},{time:45,temp:-8}]},
          { name: "T0918564122-1123-775", "last edited": "10.23PM" ,data: [{time:0,temp:1},{time:5,temp:5},{time:10,temp:8},{time:15,temp:10},{time:20,temp:12},{time:25,temp:6},{time:30,temp:5},{time:35,temp:0},{time:40,temp:-2},{time:45,temp:-8}]},
        ],
      },
      {
        date: "21/01/2023",
        data: [
          { name: "T0918564122-1123-776", "last edited": "10.23PM" ,data: [{time:0,temp:1},{time:5,temp:5},{time:10,temp:8},{time:15,temp:10},{time:20,temp:12},{time:25,temp:6},{time:30,temp:5},{time:35,temp:0},{time:40,temp:-2},{time:45,temp:-8}]},
          { name: "T0918564122-1123-777", "last edited": "10.23PM" ,data: [{time:0,temp:1},{time:5,temp:5},{time:10,temp:8},{time:15,temp:10},{time:20,temp:12},{time:25,temp:6},{time:30,temp:5},{time:35,temp:0},{time:40,temp:-2},{time:45,temp:-8}]},
        ],
      },
    ],
    rgb: [
      {
        date: "03/02/2023",
        data: [
          { name: "T0918564122-1123-771", "last edited": "10.23PM" ,data: [{no:0,red:0.1,green:0.001,blue:0.011},{no:1,red:0.2,green:0.101,blue:0.101},{no:2,red:0.24,green:0.1,blue:0.11},{no:3,red:0.21,green:0.21,blue:0.21},{no:4,red:0.31,green:0.31,blue:0.31},{no:5,red:0.31,green:0.21,blue:0.1},{no:6,red:0.51,green:0.41,blue:0.1},{no:7,red:0.15,green:0.41,blue:0.61},{no:8,red:0.15,green:0.8,blue:0.31},{no:9,red:0.9,green:0.8,blue:0.51}]},
          { name: "T0918564122-1123-772", "last edited": "10.23PM",data: [{no:0,red:0.1,green:0.001,blue:0.011},{no:1,red:0.2,green:0.101,blue:0.101},{no:2,red:0.24,green:0.1,blue:0.11},{no:3,red:0.21,green:0.21,blue:0.21},{no:4,red:0.31,green:0.31,blue:0.31},{no:5,red:0.31,green:0.21,blue:0.1},{no:6,red:0.51,green:0.41,blue:0.1},{no:7,red:0.15,green:0.41,blue:0.61},{no:8,red:0.15,green:0.8,blue:0.31},{no:9,red:0.9,green:0.8,blue:0.51}] },
        ],
      },
    ],
  };
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
        {data &&
          data[selectedButton].map((el: any) => (
            <MyRecordsCard
              key={el?.date}
              data={el}
              setModal={(value) => setModal(value)}
              setSelectedData={(value) => handleSelection(value)}
              selectedData={selectedData}
              selectedButton={selectedButton}
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
