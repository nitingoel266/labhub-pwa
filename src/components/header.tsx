import {
  useDeviceStatus,
  useDeviceConnected,
  useDeviceDataFeed,
  applicationMessage
} from "../labhub/status";
import {
  resetLeader,
  stopHeaterExperiment,
  stopSensorExperiment /* ,unjoinMember */,
  changeSetpointTemp,
  // setScreenNumber,
  simulateRgb
} from "../labhub/actions";
import {getClientId} from "../labhub/utils";
import {getScreenNumber} from "../labhub/actions-client";
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
import {toastMessage} from "./Constants";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useEffect, useState } from "react";
import DownloadData from "./DownloadData";
import { GetScreenName} from "../utils/const";
import SensorDisconnectModal from "./Modal/SensorDisconnectModal";
import {delay} from "../utils/utils";

function Header({setPointTemp,checkForSave,handleSave,shouldCloseModal}: HeaderProps) {
  const [status] = useDeviceStatus();
  const [dataFeed] = useDeviceDataFeed();
  const [connected] = useDeviceConnected();
  const clientId = getClientId()
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setModal] = useState("");
  const [hasConnectionEstablished,setHasConnectionEstablished] = useState(false);
  const [onClick, setOnClick] = useState("");

  const [showDisconnectDeviceModal, setShowDisconnectDeviceModal] = useState<boolean>(true);


  const [deviceName, setDeviceName] = useState("");


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

      if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
            : "Stop Heater Experiment and save Setpoint Temperature"
        );
      }else if(dataFeed.heater !== null){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
      }else if(setPointTemp !== status?.setpointTemp){
        setModal("Do you want to save Setpoint Temperature?")
      }


      // if(dataFeed.heater !== null) // before
      // setModal(
      //   location?.pathname === "/temperature-probe"
      //     ? "Stop Temperature Probe Experiment"
      //     : "Stop Heater Experiment"
      // );
      // else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {

      if(status?.operation !== null && status?.sensorConnected && checkForSave){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment and save data"
            : "Stop Voltage Experiment and save data"
        );
        else setModal("Do you want to save Data?")
      }else if(status?.operation !== null && status?.sensorConnected){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
        else if(!checkForSave && clientId !== status?.leaderSelected){
          navigate(-1)
        }
      }else if(checkForSave){
        setModal("Do you want to save Data?")
      }

      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){ // before
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save Data?")
     
    }else if(location?.pathname === "/rgb-spect") {
      navigate("/function-selection")
    }else if(location?.pathname === "/function-selection") {
      navigate("/mode-selection")
    }else if(location?.pathname === "/mode-selection") {
      navigate("/scan-devices")
    }else if(location?.pathname === "/measure-absorbance"){
      if(clientId === status?.leaderSelected)
      simulateRgb(null)
      navigate("/rgb-spect")
    }else if(location?.pathname === "/sensors"){
      navigate("/function-selection")
    }else if(location?.pathname === "/heater") {
      navigate("/function-selection")
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

      if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
            : "Stop Heater Experiment and save Setpoint Temperature"
        );
      }else if(dataFeed.heater !== null){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
      }else if(setPointTemp !== status?.setpointTemp){
        setModal("Do you want to save Setpoint Temperature?")
      }


      // if(dataFeed.heater !== null) // before
      // setModal(
      //   location?.pathname === "/temperature-probe"
      //     ? "Stop Temperature Probe Experiment"
      //     : "Stop Heater Experiment"
      // );
      // else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {

      if(status?.operation !== null && status?.sensorConnected && checkForSave){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment and save data"
            : "Stop Voltage Experiment and save data"
        );
        else setModal("Do you want to save Data?")
      }else if(status?.operation !== null && status?.sensorConnected){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
        else if(!checkForSave && clientId !== status?.leaderSelected){
          navigate("/my-records")
        }
      }else if(checkForSave){
        setModal("Do you want to save Data?")
      }


      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save Data?")
     
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

      if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
            : "Stop Heater Experiment and save Setpoint Temperature"
        );
      }else if(dataFeed.heater !== null){
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
      }else if(setPointTemp !== status?.setpointTemp){
        setModal("Do you want to save Setpoint Temperature?")
      }

      // if(dataFeed.heater !== null) // before
      // setModal(
      //   location?.pathname === "/temperature-probe"
      //     ? "Stop Temperature Probe Experiment"
      //     : "Stop Heater Experiment"
      // );
      // else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save Setpoint Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {

      if(status?.operation !== null && status?.sensorConnected && checkForSave){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment and save data"
            : "Stop Voltage Experiment and save data"
        );
        else setModal("Do you want to save Data?")
      }else if(status?.operation !== null && status?.sensorConnected){
        if(clientId === status?.leaderSelected)
         setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
        else if(!checkForSave && clientId !== status?.leaderSelected){
              navigate("/scan-devices",{
                state: { screenName : "/scan-devices" },
              });
        }
      }else if(checkForSave){
        setModal("Do you want to save Data?")
      }

      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save Data?")
     
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

  const handleStopProcess = async () => {
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
        (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp)
    ) {

      if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){
        if(setPointTemp){
          changeSetpointTemp(setPointTemp)
        }
        await delay(1000);

        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
          navigate("/scan-devices",{
            state: { screenName : "/scan-devices" },
          });
        else navigate(value)
        if(location?.pathname === "/temperature-probe"){
          stopHeaterExperiment(true);
        } else stopHeaterExperiment()

      }else if(dataFeed.heater !== null){
        if(location?.pathname === "/temperature-probe"){
          stopHeaterExperiment(true);  
        }else stopHeaterExperiment();
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
          navigate("/scan-devices",{
            state: { screenName : "/scan-devices" },
          });
        else navigate(value)
      }else if(setPointTemp !== status?.setpointTemp){
        if(setPointTemp)
        changeSetpointTemp(setPointTemp)
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
          navigate("/scan-devices",{
            state: { screenName : "/scan-devices" },
          });
        else navigate(value)
      }

      // if(dataFeed.heater !== null){ // before
      //   stopHeaterExperiment();
      //   if(setPointTemp === status?.setpointTemp){
      //     let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //     if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //     else navigate(value)
      //   }
      // }
      // else if(setPointTemp && setPointTemp !== status?.setpointTemp) {
      //   changeSetpointTemp(setPointTemp)
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //     else navigate(value)
      // }
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {

      if(status?.operation !== null && status?.sensorConnected && checkForSave){
        if(clientId === status?.leaderSelected)
        stopSensorExperiment();
        if(handleSave)
        handleSave()
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
        else if(onClick === "sync") handleSyncNavigate()
        else navigate(value)
      }else if(status?.operation !== null && status?.sensorConnected){
        if(clientId === status?.leaderSelected)
        stopSensorExperiment();
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
        else if(onClick === "sync") handleSyncNavigate()
        else navigate(value)
      }else if(checkForSave){
        if(handleSave)
        handleSave()
        let value:any = onClick === "myRecord" ? "/my-records" : -1;
        if(onClick === "connectionManager")
            navigate("/scan-devices",{
              state: { screenName : "/scan-devices" },
            });
        else if(onClick === "sync") handleSyncNavigate()
        else navigate(value)
      }


      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected) // before
      //   stopSensorExperiment();
      // else if(checkForSave && handleSave && isOpen === "Do you want to save Data?") {
      //   handleSave()
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //   else if(onClick === "sync") handleSyncNavigate()
      //   else navigate(value)
      // }
    } else navigate(-1);

    setModal("");
  };

  const handleSyncNavigate = async () => {
    let index = await getScreenNumber();
    if(GetScreenName[index || 0]){
      let screenName = GetScreenName[index || 0]; 
      navigate(screenName)
      if(screenName === "/scan-devices")
      setScreenName("/scan-devices")
    }
    else {
      let screenName = GetScreenName[0]; 
      navigate(screenName)
      if(screenName === "/scan-devices")
      setScreenName("/scan-devices")
      applicationMessage.next({message:`There is no screen available for screen number :- ${index}`,type:"info"})
    }
    toastMessage.next("You are now synced with leader!")
  }
  const handleSync  = () => {
    setOnClick("sync")
    if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") && checkForSave
    ) {
      if(checkForSave) setModal("Do you want to save Data?")
    }else handleSyncNavigate()
  }

  const handleCancelModal = () => {
    setModal("")
    if(isOpen === "Do you want to save Data?" || isOpen === "Do you want to save Setpoint Temperature?"){
      let value:any = onClick === "myRecord" ? "/my-records" :  -1;
      if(onClick === "connectionManager"){
        if(location?.pathname === "/temperature-sensor" || location?.pathname === "/voltage-sensor" || location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe")
          navigate("/scan-devices",{
            state: { screenName : "/scan-devices" },
          });
        else navigate("/scan-devices")
        setScreenName("/scan-devices");
      }else if(onClick === "sync") handleSyncNavigate()
      else navigate(value)
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

      localStorage.removeItem(`${location.state.data.selectedButton}_data_${location.state.data.selectedData.name}`)
      navigate(-1);
      toastMessage.next("File deleted!")
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

  const handleDisconnectedSaveData = () => {
    if(handleSave)
    handleSave()
    setModal("")
    setShowDisconnectDeviceModal(false)
  }

  const handleDisconnectedUnSaveData = () => {
    setModal("")
    navigate(-1)
  }

  useEffect(() => {
    // if connection is refused or leader disconnect then scan devices screen
    if (!connected && !checkForSave && (location.pathname !== "/" || !status?.leaderSelected)) {
      if (!status?.leaderSelected) setScreenName("");
      if(location?.pathname !== "/my-records" && location?.pathname !== "/temperature-records" && location?.pathname !== "/voltage-records" && location?.pathname !== "/rgb-records")
      navigate("/scan-devices");
    }
  }, [connected, navigate, location?.pathname, status?.leaderSelected,checkForSave]);

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
    if(!connected && screenName === "/scan-devices"){
      setScreenName("")
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

  useEffect(() => { // stop temperature experiment and show a modal that sensor disconnected and for go back
    if(shouldCloseModal){
      setModal("")
    }
  },[shouldCloseModal])

  useEffect(() => {
    if(connected && !hasConnectionEstablished){
      setHasConnectionEstablished(true)
      if(status?.deviceName)
      setDeviceName(status?.deviceName)
      setShowDisconnectDeviceModal(true)
    }else if(!connected && hasConnectionEstablished){
        setHasConnectionEstablished(false)
        if(checkForSave){
          setModal("device disconnect and save data")
        }else if(showDisconnectDeviceModal){
          applicationMessage.next({type:"info",message:`The ${deviceName} device has been disconnected.`})
        }
    }
  },[connected,hasConnectionEstablished,status?.deviceName,deviceName,checkForSave,showDisconnectDeviceModal]);

  useEffect(() => {
    if(status?.operation !== null && status?.sensorConnected && checkForSave && (isOpen === "Stop Temperature Experiment" || isOpen === "Stop Voltage Experiment")){
      setModal(
        location?.pathname === "/temperature-sensor"
          ? "Stop Temperature Experiment and save data"
          : "Stop Voltage Experiment and save data"
      );
      
    }
  },[checkForSave,status?.operation,status?.sensorConnected,isOpen,location?.pathname])
  // useEffect(() => { // setScreen name as a leader for sync for member
  //   if(clientId === status?.leaderSelected){
  //     if(location?.pathname){
  //       for(let one in GetScreenName){
  //         if(GetScreenName[one] === location?.pathname){
  //           setScreenNumber(Number(one))
  //           break;
  //         }
  //       }
  //     }
  //   }
  // },[clientId,status?.leaderSelected,location?.pathname])

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
      {isOpen && isOpen !== "device disconnect and save data" && <MemberDisconnect
        isOpen={isOpen ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={
          isOpen === "delete"
            ? handleDelete
            : isOpen === "Stop Heater Experiment" ||
              isOpen === "Stop Temperature Probe Experiment" ||
              isOpen === "Stop Heater Experiment and save Setpoint Temperature" ||
              isOpen === "Stop Temperature Probe Experiment and save Setpoint Temperature" ||
              isOpen === "Do you want to save Setpoint Temperature?" ||
              isOpen === "Do you want to save Data?" || 
              isOpen === "Stop Temperature Experiment and save data" ||
              isOpen === "Stop Temperature Experiment" ||
              isOpen === "Stop Voltage Experiment and save data" || 
              isOpen === "Stop Voltage Experiment"
            ? handleStopProcess
            : handleDisconnectLeaderMember
        }
        message={
          isOpen === "delete"
            ? "Aye you sure you want to Delete?"
            : isOpen === "Stop Heater Experiment" ||
              isOpen === "Stop Temperature Probe Experiment" ||
              isOpen === "Stop Heater Experiment and save Setpoint Temperature" || 
              isOpen === "Stop Temperature Probe Experiment and save Setpoint Temperature" ||
              isOpen === "Stop Temperature Experiment and save data" ||
              isOpen === "Stop Temperature Experiment" ||
              isOpen === "Stop Voltage Experiment and save data" ||
              isOpen === "Stop Voltage Experiment"
            ? `Are you sure to ${isOpen}?`
            : (isOpen === "Do you want to save Data?" || isOpen === "Do you want to save Setpoint Temperature?" ? isOpen :  "Are you sure to Disconnect!")
        }
        handleCancel = {() => handleCancelModal()}
      />}
       {isOpen === "device disconnect and save data" && <SensorDisconnectModal 
           isOpen={isOpen ? true : false}
           setModal={(value) => handleDisconnectedUnSaveData()}
           submitModal={() => handleDisconnectedSaveData()}
           message= {`The ${deviceName} device has been disconnected. do you want to save data?`}
           checkForSave={checkForSave}
        />}
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
  // const filledStyle = {
  //   flex: `${connected ? status?.batteryLevel : 0}%`,
  //   backgroundColor: status?.batteryLevel > 10 ? "#79D179" : "	#FF0000",
  // };
  // const unFilledStyle = {
  //   flex: `${connected ? 100 - status?.batteryLevel : 100}%`,
  //   backgroundColor:
  //     connected && status?.batteryLevel > 10 ? "#FFC0CB" : "#FFFFFF",
  // };
  return (
    <div className={styles.FistHeaderWrapper}>
      <div className={styles.FistHeaderSubWrapper}>
        {connected && (
          <img src={BluetoothIcon} style={{ width: 12 }} alt="Bluetooth Icon" />
        )}
        <div className={styles.FistHeaderSubWrapper}>
          <p
            style={{
              color: "white",
              marginLeft: 8,
              fontSize: 15,
              // cursor: "pointer",
            }}
          >
            {connected ? status?.deviceName : ""}
          </p>
          <p
            // onClick={() => handleClick("leaderMember")}
            style={{
              color: "white",
              marginLeft: 8,
              fontSize: 15,
              // cursor: "pointer",
            }}
          >
            {connected &&
              (clientId === status?.leaderSelected ? "(Leader)" : "(Member)")}
          </p>
        </div>
      </div>
      <div className={styles.BatteryWapper} title={(status?.batteryLevel || 0)+"%"}>
        <div style={{marginRight:5,color:"#FFFFFF",fontSize:14}}>{status?.batteryLevel || 0}%</div>
        <div className={styles.BatteryInnerWapper}>
          <div style={{backgroundColor:"#79D179",flex:1}}></div>
          {/* <div style={unFilledStyle}></div>
          <div style={filledStyle}></div> */}
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
     {location?.pathname !== "/scan-devices" ? <button style={{outline:"none",border:"none",backgroundColor:"inherit"}} onClick={location?.pathname === "/scan-devices" ? () => {} : handleBack}>
      <img
        src={BackIcon}
        style={{
          cursor:
            location?.pathname === "/scan-devices" ? "not-allowed" : "pointer",
          width: 25,
        }}
        alt="Back Icon"
      />
      </button> : <div></div>}
      {!["/temperature-records", "/voltage-records", "/rgb-records"].includes(
        location?.pathname
      ) ? (
        <div className={styles.FistHeaderSubWrapper}>
         {location.pathname !== "/my-records" && <button 
            style={{outline:"none",border:"none",backgroundColor:"inherit"}}
            onClick={() => (handleMyRecord())}
          >
          <img
            src={MyRecordsIcon}
            style={{ cursor: "pointer", width: 32,marginTop:2 }}
            alt="my record Icon"
            />
            </button>}
         {location.pathname !== "/scan-devices" && <button
            style={{outline:"none",border:"none",backgroundColor:"inherit"}}
            onClick={() => (handleConnectionManager() )}
          >
          <img
            src={ShareIcon}
            style={{ cursor: "pointer", width: 25 }}
            alt="connection manager Icon"
            />
            </button>}
          {connected && status?.leaderSelected && clientId !== status?.leaderSelected && (
            <button 
              style={{outline:"none",border:"none",backgroundColor:"inherit"}}
              onClick={() => handleSync()}
            >
            <img
              src={SyncIcon}
              style={{ cursor: "pointer", marginLeft: 5, width: 20 }}
              alt="syn icon"
            />
              </button>
          )}
        </div>
      ) : (
        <div className={styles.FistHeaderSubWrapper}>
          <button
            style={{outline:"none",border:"none",backgroundColor:"inherit"}}

          >
          <img
            src={WhiteShareIcon}
            style={{ cursor: "pointer", width: 20,height:20, marginRight: 5 }}
            alt="Share Icon"
            />
            </button>
            <button 
              style={{outline:"none",border:"none",backgroundColor:"inherit"}}
              onClick={handleDownload}
            >
          <img
            src={WhiteDownloadIcon}
            style={{ cursor: "pointer", width: 20, marginRight: 5 }}
            alt="Download Icon"
            />
            </button>
            <button 
              style={{outline:"none",border:"none",backgroundColor:"inherit"}}
              onClick={() => setModal("delete")}
            >
          <img
            src={WhiteDeleteIcon}
            style={{ cursor: "pointer", width: 20, marginRight: 5 }}
            alt="Delete Icon"
            />
            </button>
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
  shouldCloseModal ? :boolean;
}
