import {
  useDeviceStatus,
  useSocketConnected,
  useDeviceDataFeed,
} from "../labhub/status";
import {
  resetLeader,
  stopHeaterExperiment,
  stopSensorExperiment /* ,unjoinMember */,
  changeSetpointTemp,
  setScreenNumber,
} from "../labhub/actions";
// import {setSelectedFunction,setSelectedMode} from "../labhub/actions-client";
import styles from "../styles/header.module.css";
import {
  BluetoothIcon,
  BatteryIcon,
  BackIcon,
  ShareIcon,
  MyRecordsIcon,
  WhiteShareIcon,
  SyncIcon,
  WhiteDownloadIcon,
  WhiteDeleteIcon,
} from "../images/index";
import { useNavigate, useLocation } from "react-router-dom";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useEffect, useState } from "react";
import DownloadData from "./DownloadData";
import { LABHUB_CLIENT_ID ,GetScreenName} from "../utils/const";

function Header({setPointTemp,checkForSave,handleSave}: HeaderProps) {
  const [status] = useDeviceStatus();
  const [dataFeed] = useDeviceDataFeed();
  const [connected] = useSocketConnected();
  const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setModal] = useState("");
  const [onClick, setOnClick] = useState("");

  const [screenName, setScreenName] = useState("");

  const handleBack = () => {
    setOnClick("back")
    if (location?.pathname === "/mode-selection")
      setScreenName("/scan-devices");
    else setScreenName("");
    // const getPathFunc:any = {
    //   "/mode-selection":() => setSelectedMode(null),
    //   "/function-selection":() => setSelectedFunction(null),
    //   // "/data-setup":() => setupData(),
    // }
    // if(getPathFunc[location.pathname])
    // getPathFunc[location.pathname]()
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
        (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp) && clientId === status?.leaderSelected
    ) {
      if(dataFeed.heater !== null)
      setModal(
        location?.pathname === "/temperature-probe"
          ? "Stop Temperature Probe Experiment"
          : "Stop Heater Experiment"
      );
      else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      (dataFeed.sensor !== null || checkForSave)
    ) {
      if(dataFeed.sensor !== null && clientId === status?.leaderSelected){
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      }else if(checkForSave) setModal("Do you want to save Data?")
     
    }else if(location?.pathname === "/rgb-spect") {
      navigate("/function-selection")
    }else if(location?.pathname === "/function-selection") {
      navigate("/mode-selection")
    } else navigate(-1);
  };

  const handleClick = (value: any) => {
    setModal(value);
  };
  const handleMyRecord = () => { // record section
    setOnClick("myRecord")
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
        (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp) && clientId === status?.leaderSelected
    ) {
      if(dataFeed.heater !== null)
      setModal(
        location?.pathname === "/temperature-probe"
          ? "Stop Temperature Probe Experiment"
          : "Stop Heater Experiment"
      );
      else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      (dataFeed.sensor !== null || checkForSave)
    ) {
      if(dataFeed.sensor !== null && clientId === status?.leaderSelected){
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      }else if(checkForSave) setModal("Do you want to save Data?")
     
    }else {
      navigate("/my-records");
    }
  };
  const handleConnectionManager = () => { // go to scan page
    setOnClick("connectionManager")
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
        (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp) && clientId === status?.leaderSelected
    ) {
      if(dataFeed.heater !== null)
      setModal(
        location?.pathname === "/temperature-probe"
          ? "Stop Temperature Probe Experiment"
          : "Stop Heater Experiment"
      );
      else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      (dataFeed.sensor !== null || checkForSave)
    ) {
      if(dataFeed.sensor !== null && clientId === status?.leaderSelected){
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      }else if(checkForSave) setModal("Do you want to save Data?")
     
    }else {
      if(location?.pathname === "/temperature-sensor" || location?.pathname === "/voltage-sensor" || location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe")
      navigate("/scan-devices",{
        state: { screenName : "/scan-devices" },
      });
      else navigate("/scan-devices")
      setScreenName("/scan-devices");
    }

  };
  const handleDisconnectLeaderMember = () => {
    if (clientId === status?.leaderSelected) {
      resetLeader();
      // navigate("/scan-devices")
    }
    if (
      clientId &&
      status?.membersJoined &&
      status?.membersJoined.includes(clientId)
    ) {
      // unjoinMember()
    }
    setModal("");
  };

  const handleStopProcess = () => {
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
        (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp)
    ) {
      if(dataFeed.heater !== null){
        stopHeaterExperiment();
        if(setPointTemp === status?.setpointTemp){
          let value:any = onClick === "myRecord" ? "/my-records" : -1;
          if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
          else navigate(value)
        }
      }
      else if(setPointTemp && setPointTemp !== status?.setpointTemp) {
        changeSetpointTemp(setPointTemp)
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
          else navigate(value)
      }
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      (dataFeed.sensor !== null || checkForSave)
    ) {
      if(dataFeed.sensor !== null && clientId === status?.leaderSelected)
        stopSensorExperiment();
      else if(checkForSave && handleSave) {
        handleSave()
        let value:any = onClick === "myRecord" ? "/my-records" : onClick === "sync" ? GetScreenName[status?.screenNumber || 0] : -1;
        if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
          else navigate(value)
      }
    } else navigate(-1);

    setModal("");
  };

  const handleSync  = () => {
    setOnClick("sync")
    if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") && checkForSave
    ) {
      if(checkForSave) setModal("Do you want to save Data?")
    }else if(status?.screenNumber) navigate(GetScreenName[status?.screenNumber])
  }

  const handleCancelModal = () => {
    setModal("")
    if(isOpen === "Do you want to save Data?" || isOpen === "Do you want to save Setpoint Temperature?"){
      let value:any = onClick === "myRecord" ? "/my-records" : onClick === "sync" ? GetScreenName[status?.screenNumber || 0] : -1;
      if(onClick === "connectionManager"){
        if(location?.pathname === "/temperature-sensor" || location?.pathname === "/voltage-sensor" || location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe")
          navigate("/scan-devices",{
            state: { screenName : "/scan-devices" },
          });
        else navigate("/scan-devices")
        setScreenName("/scan-devices");
      }else navigate(value)
    }
  }

  const handleDelete = () => {
    setModal("");
    if (
      location &&
      location.state &&
      location.state.data &&
      location.state.data.selectedButton &&
      location.state.data.selectedData
    ) {
      let storageData = localStorage.getItem(
        `${location.state.data.selectedButton}_data`
      );
      storageData = storageData ? JSON.parse(storageData) : [];
      let resultData =
        storageData && Array.isArray(storageData)
          ? [...storageData].filter(
              (el: any) => el?.name !== location.state.data.selectedData.name
            )
          : [];
      localStorage.setItem(
        `${location.state.data.selectedButton}_data`,
        JSON.stringify(resultData)
      );
      navigate(-1);
    }
  };
  const handleDownload = () => {
    if (
      location &&
      location.state &&
      location.state.data &&
      location.state.data.selectedButton &&
      location.state.data.selectedData
    ) {
      let header = ["Time ( Sec )", "Temperature ( C )"];
      if (location.state.data.selectedButton === "voltage")
        header = ["Time ( Sec )", "Voltage (V)"];
      else if (location.state.data.selectedButton === "rgb")
        header = ["Measurement No", "RED", "GREEN", "BLUE"];
      DownloadData({ data: location.state.data.selectedData, header });
    }
  };
  useEffect(() => {
    // if connection is refused or leader disconnect then scan devices screen
    if ((!connected && location.pathname !== "/") || !status?.leaderSelected) {
      if (!status?.leaderSelected) setScreenName("");
      navigate("/scan-devices");
    }
  }, [connected, navigate, location?.pathname, status?.leaderSelected]);
  useEffect(() => {
    // if leader selected and connection established the all members should be on mode selection screen
    if (
      connected &&
      status &&
      status?.leaderSelected &&
      screenName !== "/scan-devices" && 
      location.state?.screenName !== "/scan-devices"
    ) {
      // joinAsMember()
      // setModal(false)
      if (location.pathname === "/scan-devices") navigate("/mode-selection");
    }
  }, [
    status?.leaderSelected,
    connected,
    navigate,
    status,
    location?.pathname,
    screenName,
    location.state?.screenName
  ]);
  useEffect(() => { // setScreen name as a leader for sync for member
    if(clientId === status?.leaderSelected){
      if(location?.pathname){
        for(let one in GetScreenName){
          if(GetScreenName[one] === location?.pathname){
            setScreenNumber(Number(one))
            break;
          }
        }
      }
    }
  },[clientId,status?.leaderSelected,location?.pathname])
  // console.log("??>>> connected and status",connected,"status :- ",status)
  return (
    <div>
      <FirstHeader
        handleClick={handleClick}
        status={status}
        connected={connected}
        clientId={clientId}
      />
      <SecondHeader
        handleBack={handleBack}
        status={status}
        connected={connected}
        clientId={clientId}
        handleMyRecord={handleMyRecord}
        setModal={(value) => setModal(value)}
        handleConnectionManager={handleConnectionManager}
        handleDownload={handleDownload}
        handleSync={handleSync}
      />
      <MemberDisconnect
        isOpen={isOpen ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={
          isOpen === "delete"
            ? handleDelete
            : isOpen === "Stop Heater Experiment" ||
              isOpen === "Stop Temperature Probe Experiment" ||
              isOpen === "Do you want to save Data?" ||
              isOpen === "Do you want to save Setpoint Temperature?" ||
              isOpen === "Stop Temperature Experiment" ||
              isOpen === "Stop Voltage Experiment"
            ? handleStopProcess
            : handleDisconnectLeaderMember
        }
        message={
          isOpen === "delete"
            ? "Aye you sure you want to Delete?"
            : isOpen === "Stop Heater Experiment" ||
              isOpen === "Stop Temperature Probe Experiment" ||
              isOpen === "Stop Temperature Experiment" ||
              isOpen === "Stop Voltage Experiment"
            ? `Are you sure to ${isOpen}!`
            : (isOpen === "Do you want to save Data?" || isOpen === "Do you want to save Setpoint Temperature?" ? isOpen :  "Are you sure to Disconnect!")
        }
        handleCancel = {() => handleCancelModal()}
      />
    </div>
  );
}

export default Header;

const FirstHeader = ({
  handleClick,
  status,
  clientId,
  connected,
}: FirstHeaderProps) => {
  const filledStyle = {
    flex: `${connected ? status?.batteryLevel : 0}%`,
    backgroundColor: status?.batteryLevel > 10 ? "#79D179" : "	#FF0000",
  };
  const unFilledStyle = {
    flex: `${connected ? 100 - status?.batteryLevel : 100}%`,
    backgroundColor:
      connected && status?.batteryLevel > 10 ? "#FFC0CB" : "#FFFFFF",
  };
  return (
    <div className={styles.FistHeaderWrapper}>
      <div className={styles.FistHeaderSubWrapper}>
        {connected && (
          <img src={BluetoothIcon} style={{ width: 12 }} alt="Bluetooth Icon" />
        )}
        <div className={styles.FistHeaderSubWrapper}>
          <div
            style={{
              color: "white",
              marginLeft: 8,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {connected ? status?.deviceName : ""}
          </div>
          <div
            onClick={() => handleClick("leaderMember")}
            style={{
              color: "white",
              marginLeft: 8,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {connected &&
              (clientId === status?.leaderSelected ? "(Leader)" : "(Member)")}
          </div>
        </div>
      </div>
      <div className={styles.BatteryWapper}>
        <div className={styles.BatteryInnerWapper}>
          <div style={unFilledStyle}></div>
          <div style={filledStyle}></div>
          <img
            src={BatteryIcon}
            className={styles.BatteryIcon}
            alt="battery Icon"
          />
        </div>
        <div className={styles.BatteryHandle}></div>
      </div>
    </div>
  );
};

const SecondHeader = ({
  handleBack,
  handleMyRecord,
  connected,
  status,
  clientId,
  setModal,
  handleConnectionManager,
  handleDownload,
  handleSync
}: SecondHeaderprops) => {
  const location = useLocation();
  return (
    <div className={styles.SecondHeaderWrapper}>
      <img
        onClick={location?.pathname === "/scan-devices" ? () => {} : handleBack}
        src={BackIcon}
        style={{
          cursor:
            location?.pathname === "/scan-devices" ? "not-allowed" : "pointer",
          width: 25,
        }}
        alt="Back Icon"
      />
      {!["/temperature-records", "/voltage-records", "/rgb-records"].includes(
        location?.pathname
      ) ? (
        <div className={styles.FistHeaderSubWrapper}>
          <img
            onClick={() => (connected ? handleMyRecord() : {})}
            src={MyRecordsIcon}
            style={{ cursor: "pointer", width: 32, marginRight: 10 }}
            alt="Text Icon"
          />
          <img
            onClick={() => (connected ? handleConnectionManager() : {})}
            src={ShareIcon}
            style={{ cursor: "pointer", width: 25 }}
            alt="Share Icon"
          />
          {connected && clientId !== status?.leaderSelected && (
            <img
              onClick={() => handleSync()}
              src={SyncIcon}
              style={{ cursor: "pointer", marginLeft: 10, width: 20 }}
              alt="syn button"
            />
          )}
        </div>
      ) : (
        <div className={styles.FistHeaderSubWrapper}>
          <img
            src={WhiteShareIcon}
            style={{ cursor: "pointer", width: 20, marginRight: 15 }}
            alt="Share Icon"
          />
          <img
            src={WhiteDownloadIcon}
            onClick={handleDownload}
            style={{ cursor: "pointer", width: 20, marginRight: 15 }}
            alt="Download Icon"
          />
          <img
            onClick={() => setModal("delete")}
            src={WhiteDeleteIcon}
            style={{ cursor: "pointer", width: 20, marginRight: 10 }}
            alt="Delete Icon"
          />
        </div>
      )}
    </div>
  );
};

type FirstHeaderProps = {
  handleClick: (value: any) => void;
  status: any;
  clientId?: any;
  connected?: any;
};

type SecondHeaderprops = {
  status: any;
  clientId?: any;
  handleBack: () => void;
  handleMyRecord: () => void;
  setModal: (value: string) => void;
  handleConnectionManager: () => void;
  connected?: any;
  handleDownload: () => void;
  handleSync:() => void;
};

export interface HeaderProps {
  setPointTemp ?:number;
  checkForSave?:boolean;
  handleSave ? :() => void;
}
