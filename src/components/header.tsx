import {
  useDeviceStatus,
  useDeviceConnected,
  useDeviceDataFeed,
  applicationMessage,
  warningMessage,
} from "../labhub/status";
import {
  resetLeader,
  stopHeaterExperiment,
  stopSensorExperiment /* ,unjoinMember */,
  changeSetpointTemp,
  // setScreenNumber,
  simulateRgb,
  stopRgbExperiment
} from "../labhub/actions";
import { getClientId } from "../labhub/utils";
import { getScreenNumber } from "../labhub/actions-client";
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
import {
  getShareFile,
  mobileWidth,
  toastMessage,
  currentURL,
  previousURL,
  useCurrentUrl,
  usePreviousUrl,
  urlPathsHistory,
  useUrlPathsHistory
} from "./Constants";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useEffect, useState } from "react";
import DownloadData from "./DownloadData";
import { GetScreenName } from "../utils/const";
import SensorDisconnectModal from "./Modal/SensorDisconnectModal";
import ShareModal from "./Modal/ShareModal";
// import {delay} from "../utils/utils";

function Header({
  setPointTemp,
  checkForSave,
  handleSave,
  shouldCloseModal,
}: HeaderProps) {
  const [status] = useDeviceStatus();
  const [dataFeed] = useDeviceDataFeed();
  const [connected] = useDeviceConnected();
  const clientId = getClientId();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentURI] = useCurrentUrl();
  const [previousURI] = usePreviousUrl();

  const [pathHistory] = useUrlPathsHistory();

  const [isOpen, setModal] = useState("");
  const [hasConnectionEstablished, setHasConnectionEstablished] =
    useState(false);
  const [onClick, setOnClick] = useState("");

  const [showDisconnectDeviceModal, setShowDisconnectDeviceModal] =
    useState<boolean>(true);

  const [deviceName, setDeviceName] = useState("");

  const [screenName, setScreenName] = useState("");



  const handleBack = () => {
    setOnClick("back");
    if(!connected){ // to not show back icon on scan when not connected
      if(pathHistory?.length)
      urlPathsHistory.next([...pathHistory.slice(0,pathHistory.length -1)])
    }
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
      (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp || checkForSave)
    ) {
      if(clientId === status?.leaderSelected){
        if (dataFeed.heater !== null)
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
        else if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
      }else {
        if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
        else {
          navigate(-1)
        }
      }
    

      // if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){ // before
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
      //       : "Stop Heater Experiment and save Setpoint Temperature"
      //   );
      // }else if(dataFeed.heater !== null){
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment"
      //       : "Stop Heater Experiment"
      //   );
      // }else if(setPointTemp !== status?.setpointTemp){
      //   setModal("Do you want to save set point Temperature?")
      // }
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {
      if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId === status?.leaderSelected
      ) {
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      } else if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId !== status?.leaderSelected
      ) {
        navigate(-1);
      }

      // if(status?.operation !== null && status?.sensorConnected && checkForSave){ // before
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment and save data"
      //       : "Stop Voltage Experiment and save data"
      //   );
      //   else setModal("Do you want to save the experiment data?")
      // }else if(status?.operation !== null && status?.sensorConnected){
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      //   else if(!checkForSave && clientId !== status?.leaderSelected){
      //     navigate(-1)
      //   }
      // }else if(checkForSave){
      //   setModal("Do you want to save the experiment data?")
      // }

      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){ // before
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save the experiment data?")
    } else if (location?.pathname === "/measure-absorbance") {
      if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else {
        if (clientId === status?.leaderSelected) {
          simulateRgb(null);
        }
        navigate("/rgb-spect");
      }
    } else if (location?.pathname === "/rgb-spect") {
      navigate("/function-selection");
    } else if (location?.pathname === "/function-selection") {
      navigate("/mode-selection");
    } else if (location?.pathname === "/mode-selection") {
      navigate("/scan-devices");
    } else if (location?.pathname === "/sensors") {
      navigate("/function-selection");
    } else if (location?.pathname === "/heater") {
      navigate("/function-selection");
    } else {
      navigate(-1);
    }
  };

  const handleClick = (value: any) => {
    setModal(value);
  };
  const handleMyRecord = () => {
    // record section
    setOnClick("myRecord");
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
      (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp || checkForSave)
    ) {

      if(clientId === status?.leaderSelected){
        if (dataFeed.heater !== null)
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
        else if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
      }else {
        if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
        else{
        navigate("/my-records");
        }
      }
     
      // if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){ // before
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
      //       : "Stop Heater Experiment and save Setpoint Temperature"
      //   );
      // }else if(dataFeed.heater !== null){
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment"
      //       : "Stop Heater Experiment"
      //   );
      // }else if(setPointTemp !== status?.setpointTemp){
      //   setModal("Do you want to save set point Temperature?")
      // }

      // if(dataFeed.heater !== null) // before
      // setModal(
      //   location?.pathname === "/temperature-probe"
      //     ? "Stop Temperature Probe Experiment"
      //     : "Stop Heater Experiment"
      // );
      // else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save set point Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {
      if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId === status?.leaderSelected
      ) {
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      } else if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId !== status?.leaderSelected
      ) {
        navigate("/my-records");
      }

      // if(status?.operation !== null && status?.sensorConnected && checkForSave){
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment and save data"
      //       : "Stop Voltage Experiment and save data"
      //   );
      //   else setModal("Do you want to save the experiment data?")
      // }else if(status?.operation !== null && status?.sensorConnected){
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      //   else if(!checkForSave && clientId !== status?.leaderSelected){
      //     navigate("/my-records")
      //   }
      // }else if(checkForSave){
      //   setModal("Do you want to save the experiment data?")
      // }

      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save the experiment data?")
    } else if (location?.pathname === "/measure-absorbance") {
      if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else {
        if (clientId === status?.leaderSelected) {
          simulateRgb(null);
        }
        navigate("/my-records");
      }
    } else {
      navigate("/my-records");
    }
  };
  const handleConnectionManager = () => {
    // go to scan page
    setOnClick("connectionManager");
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
      (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp || checkForSave)
    ) {

      if(clientId === status?.leaderSelected){
        if (dataFeed.heater !== null)
        setModal(
          location?.pathname === "/temperature-probe"
            ? "Stop Temperature Probe Experiment"
            : "Stop Heater Experiment"
        );
        else if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
      }else {
        if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp !== status?.setpointTemp)
        setModal("Do you want to save set point Temperature?");
        else {
          navigate("/scan-devices", {
            state: { screenName: "/scan-devices" },
          });
        }
      }

      // if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment and save Setpoint Temperature"
      //       : "Stop Heater Experiment and save Setpoint Temperature"
      //   );
      // }else if(dataFeed.heater !== null){
      //   setModal(
      //     location?.pathname === "/temperature-probe"
      //       ? "Stop Temperature Probe Experiment"
      //       : "Stop Heater Experiment"
      //   );
      // }else if(setPointTemp !== status?.setpointTemp){
      //   setModal("Do you want to save set point Temperature?")
      // }

      // if(dataFeed.heater !== null) // before
      // setModal(
      //   location?.pathname === "/temperature-probe"
      //     ? "Stop Temperature Probe Experiment"
      //     : "Stop Heater Experiment"
      // );
      // else if(setPointTemp !== status?.setpointTemp) setModal("Do you want to save set point Temperature?")
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {
      if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId === status?.leaderSelected
      ) {
        setModal(
          location?.pathname === "/temperature-sensor"
            ? "Stop Temperature Experiment"
            : "Stop Voltage Experiment"
        );
      } else if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId !== status?.leaderSelected
      ) {
        navigate("/scan-devices", {
          state: { screenName: "/scan-devices" },
        });
      }

      // if(status?.operation !== null && status?.sensorConnected && checkForSave){
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment and save data"
      //       : "Stop Voltage Experiment and save data"
      //   );
      //   else setModal("Do you want to save the experiment data?")
      // }else if(status?.operation !== null && status?.sensorConnected){
      //   if(clientId === status?.leaderSelected)
      //    setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      //   else if(!checkForSave && clientId !== status?.leaderSelected){
      //         navigate("/scan-devices",{
      //           state: { screenName : "/scan-devices" },
      //         });
      //   }
      // }else if(checkForSave){
      //   setModal("Do you want to save the experiment data?")
      // }

      // if(status?.operation !== null && status?.sensorConnected && clientId === status?.leaderSelected){
      //   setModal(
      //     location?.pathname === "/temperature-sensor"
      //       ? "Stop Temperature Experiment"
      //       : "Stop Voltage Experiment"
      //   );
      // }else if(checkForSave) setModal("Do you want to save the experiment data?")
    } else if (location?.pathname === "/measure-absorbance") {
      if (checkForSave) {
        setModal("Do you want to save the experiment data?");
      } else {
        if (clientId === status?.leaderSelected) {
          simulateRgb(null);
        }
        navigate("/scan-devices", {
          state: { screenName: "/scan-devices" },
        });
      }
    } else {
      if (
        location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor" ||
        location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe"
      )
        navigate("/scan-devices", {
          state: { screenName: "/scan-devices" },
        });
      else navigate("/scan-devices");
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
    setModal("");
    if (
      (location?.pathname === "/heater-element" ||
        location?.pathname === "/temperature-probe") &&
      (dataFeed.heater !== null || setPointTemp !== status?.setpointTemp || checkForSave)
    ) {
      if (dataFeed.heater !== null && clientId === status?.leaderSelected) {
        if (location?.pathname === "/temperature-probe") {
          stopHeaterExperiment(true);
        } else stopHeaterExperiment();
        if(checkForSave){
          setModal("Do you want to save the experiment data?");
        }else if (setPointTemp && setPointTemp !== status?.setpointTemp) {
          setModal("Do you want to save set point Temperature?");
        } else if (setPointTemp === status?.setpointTemp) {
          let value: any = onClick === "myRecord" ? "/my-records" : -1;
          if (onClick === "connectionManager")
            navigate("/scan-devices", {
              state: { screenName: "/scan-devices" },
            });
          else navigate(value);
        }
      } else if(
        checkForSave &&
        handleSave &&
        isOpen === "Do you want to save the experiment data?"
        ){
          handleSave();
          if(setPointTemp !== status?.setpointTemp){
            setModal("Do you want to save set point Temperature?");
          }else{
            let value: any = onClick === "myRecord" ? "/my-records" : -1;
            if (onClick === "connectionManager")
              navigate("/scan-devices", {
                state: { screenName: "/scan-devices" },
              });
            else if (onClick === "sync") handleSyncNavigate();
            else navigate(value);
          }
      }else if (setPointTemp && setPointTemp !== status?.setpointTemp) {
        changeSetpointTemp(setPointTemp);
        let value: any = onClick === "myRecord" ? "/my-records" : -1;
        if (onClick === "connectionManager")
          navigate("/scan-devices", {
            state: { screenName: "/scan-devices" },
          });
        else navigate(value);
      }

      // if(dataFeed.heater !== null && setPointTemp !== status?.setpointTemp){ // before
      //   if(setPointTemp){
      //     changeSetpointTemp(setPointTemp)
      //   }
      //   await delay(1000);

      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //     navigate("/scan-devices",{
      //       state: { screenName : "/scan-devices" },
      //     });
      //   else navigate(value)
      //   if(location?.pathname === "/temperature-probe"){
      //     stopHeaterExperiment(true);
      //   } else stopHeaterExperiment()

      // }else if(dataFeed.heater !== null){
      //   if(location?.pathname === "/temperature-probe"){
      //     stopHeaterExperiment(true);
      //   }else stopHeaterExperiment();
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //     navigate("/scan-devices",{
      //       state: { screenName : "/scan-devices" },
      //     });
      //   else navigate(value)
      // }else if(setPointTemp !== status?.setpointTemp){
      //   if(setPointTemp)
      //   changeSetpointTemp(setPointTemp)
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //     navigate("/scan-devices",{
      //       state: { screenName : "/scan-devices" },
      //     });
      //   else navigate(value)
      // }
    } else if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor") &&
      ((status?.operation !== null && status?.sensorConnected) || checkForSave)
    ) {
      if (
        status?.operation !== null &&
        status?.sensorConnected &&
        clientId === status?.leaderSelected
      ) {
        stopSensorExperiment();
        if (checkForSave) {
          setModal("Do you want to save the experiment data?");
        } else {
          let value: any = onClick === "myRecord" ? "/my-records" : -1;
          if (onClick === "connectionManager")
            navigate("/scan-devices", {
              state: { screenName: "/scan-devices" },
            });
          else navigate(value);
        }
      } else if (
        checkForSave &&
        handleSave &&
        isOpen === "Do you want to save the experiment data?"
      ) {
        handleSave();
        let value: any = onClick === "myRecord" ? "/my-records" : -1;
        if (onClick === "connectionManager")
          navigate("/scan-devices", {
            state: { screenName: "/scan-devices" },
          });
        else if (onClick === "sync") handleSyncNavigate();
        else navigate(value);
      }

      // if(status?.operation !== null && status?.sensorConnected && checkForSave){ // before
      //   if(clientId === status?.leaderSelected)
      //   stopSensorExperiment();
      //   if(handleSave)
      //   handleSave()
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //   else if(onClick === "sync") handleSyncNavigate()
      //   else navigate(value)
      // }else if(status?.operation !== null && status?.sensorConnected){
      //   if(clientId === status?.leaderSelected)
      //   stopSensorExperiment();
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //   else if(onClick === "sync") handleSyncNavigate()
      //   else navigate(value)
      // }else if(checkForSave){
      //   if(handleSave)
      //   handleSave()
      //   let value:any = onClick === "myRecord" ? "/my-records" : -1;
      //   if(onClick === "connectionManager")
      //       navigate("/scan-devices",{
      //         state: { screenName : "/scan-devices" },
      //       });
      //   else if(onClick === "sync") handleSyncNavigate()
      //   else navigate(value)
      // }
    } else if (location?.pathname === "/measure-absorbance") {
      if (checkForSave && handleSave) {
        handleSave();
      }
      if (clientId === status?.leaderSelected) {
        simulateRgb(null);
      }
      let value: any = onClick === "myRecord" ? "/my-records" : -1;
      if (onClick === "connectionManager")
        navigate("/scan-devices", {
          state: { screenName: "/scan-devices" },
        });
      else if (onClick === "sync") handleSyncNavigate();
      else {
        if (
          location?.pathname === "/measure-absorbance" &&
          onClick === "back"
        ) {
          navigate("/rgb-spect");
        } else navigate(value);
      }
    } else navigate(-1);
  };

  const handleSyncNavigate = async () => {
    let index = await getScreenNumber();
    if (GetScreenName[index || 0]) {
      let screenName = GetScreenName[index || 0];
      navigate(screenName);
      if (screenName === "/scan-devices") setScreenName("/scan-devices");
    } else {
      let screenName = GetScreenName[0];
      navigate(screenName);
      if (screenName === "/scan-devices") setScreenName("/scan-devices");
      applicationMessage.next({
        message: `There is no screen available for screen number :- ${index}`,
        type: "info",
      });
    }
    toastMessage.next("You are now synced with leader!");
  };
  const handleSync = () => {
    setOnClick("sync");
    if (
      (location?.pathname === "/temperature-sensor" ||
        location?.pathname === "/voltage-sensor" ||
        location?.pathname === "/measure-absorbance") &&
      checkForSave
    ) {
      if (checkForSave) setModal("Do you want to save the experiment data?");
    } else if((location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe") && checkForSave){
        if(checkForSave)
          setModal("Do you want to save the experiment data?");
    } else handleSyncNavigate();
  };

  const handleCancelModal = () => {
    setModal("");
    if (
      isOpen === "Do you want to save the experiment data?" ||
      isOpen === "Do you want to save set point Temperature?"
    ) {
      if(isOpen === "Do you want to save the experiment data?" && setPointTemp !== status?.setpointTemp && (location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe")){
        setModal("Do you want to save set point Temperature?")
      }else{
        if (location?.pathname === "/measure-absorbance") {
          if (clientId === status?.leaderSelected) {
            simulateRgb(null);
          }
        }
        let value: any = onClick === "myRecord" ? "/my-records" : -1;
        if (onClick === "connectionManager") {
          if (
            location?.pathname === "/temperature-sensor" ||
            location?.pathname === "/voltage-sensor" ||
            location?.pathname === "/heater-element" ||
            location?.pathname === "/temperature-probe" ||
            location?.pathname === "/measure-absorbance"
          )
            navigate("/scan-devices", {
              state: { screenName: "/scan-devices" },
            });
          else navigate("/scan-devices");
          setScreenName("/scan-devices");
        } else if (onClick === "sync") handleSyncNavigate();
        else {
          if (
            location?.pathname === "/measure-absorbance" &&
            onClick === "back"
          ) {
            navigate("/rgb-spect");
          } else navigate(value);
        }
      }
     
    }
    // setModal("");
  };

  const handleShare = async (title?: string) => {
    setModal("");
    if (
      location &&
      location.state &&
      location.state.data &&
      location.state.data.selectedButton &&
      location.state.data.selectedData
    ) {
      if (title) {
        // const file = getShareFile(location.state.data.selectedData, location.state.data.selectedButton)
        console.log("??>>> WEb SHARE", title);
      } else {
        if (!navigator.canShare) {
          console.log("Your browser doesn't support the Web Share API.");
          return;
        }
        try {
          const file = getShareFile(
            location.state.data.selectedData,
            location.state.data.selectedButton
          );

          // console.log("???????? ",file)
          let expType =
            location.state.data.selectedButton.slice(0, 1).toLocaleUpperCase() +
            location.state.data.selectedButton.slice(1);
          await navigator.share({
            url: `${expType} Experiment data of ${location.state.data.selectedData?.name}`,
            text: `${expType} data of ${location.state.data.selectedData?.name}`,
            title: `${expType} Experiment Data`, // Email subject
            files: [file],
          });
          console.log("data has been shared Successfully!");
        } catch (error) {
          console.error(error);
        }
        // console.log("share data",item)
      }
    }
  };

  const handleDelete = () => {
    setModal("");
    if (
      location &&
      location.state &&
      location.state.data &&
      location.state.data.selectedButton &&
      location.state.data.selectedData
    ) {
      localStorage.removeItem(
        `${location.state.data.selectedButton}_data_${location.state.data.selectedData.name}`
      );
      navigate(-1);
      toastMessage.next("File deleted!");
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
      let header = ["Time (Sec)", "Temperature (°C)"];
      if (location.state.data.selectedButton === "voltage")
        header = ["Time (Sec)", "Voltage (V)"];
      else if (location.state.data.selectedButton === "rgb")
        header = ["Measurement No", "RED", "GREEN", "BLUE"];
      DownloadData({ data: location.state.data.selectedData, header});
    }
  };

  const handleDisconnectedSaveData = () => {
    if (handleSave) handleSave();
    setModal("");
    setShowDisconnectDeviceModal(false);
    navigate("/scan-devices")
    window.location.reload()
  };

  const handleDisconnectedUnSaveData = () => {
    setModal("");
    if (location?.pathname === "/measure-absorbance") {
      navigate("/rgb-spect");
    } else navigate(-1);
    navigate("/scan-devices")
    window.location.reload()
  };

  useEffect(() => {
    // if connection is refused or leader disconnect then scan devices screen
    if (
      !connected &&
      !checkForSave &&
      (location.pathname !== "/" || !status?.leaderSelected)
    ) {
      if (!status?.leaderSelected) setScreenName("");
      if (
        location?.pathname !== "/my-records" &&
        location?.pathname !== "/temperature-records" &&
        location?.pathname !== "/voltage-records" &&
        location?.pathname !== "/rgb-records" &&
        location?.pathname !== "/scan-devices"
      ) {
        navigate("/scan-devices");
      }
    }
  }, [
    connected,
    navigate,
    location?.pathname,
    status?.leaderSelected,
    checkForSave,
  ]);

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
    if (!connected && screenName === "/scan-devices") {
      setScreenName("");
    }
  }, [
    status?.leaderSelected,
    connected,
    navigate,
    status,
    location?.pathname,
    screenName,
    location.state?.screenName,
  ]);

  useEffect(() => {
    // stop temperature experiment and show a modal that sensor disconnected and for go back
    if (shouldCloseModal) {
      setModal("");
    }
  }, [shouldCloseModal]);

  useEffect(() => {
    if (connected && !hasConnectionEstablished) {
      setHasConnectionEstablished(true);
      if (status?.deviceName) setDeviceName(status?.deviceName);
      setShowDisconnectDeviceModal(true);
    } else if (!connected && hasConnectionEstablished) {
      setHasConnectionEstablished(false);
      if (checkForSave) {
        setModal("device disconnect and save data");
      } else if (showDisconnectDeviceModal) {
        warningMessage.next({
          type: "warn",
          message: `The ${deviceName} device has been disconnected.`,
        });
      }
    }
  }, [
    connected,
    hasConnectionEstablished,
    status?.deviceName,
    deviceName,
    checkForSave,
    showDisconnectDeviceModal,
  ]);

  useEffect(() => { // if experiment is stop and we opened modal to stop experiment then message will change to save data from stop experiment
    if (
      !status?.operation &&
      status?.sensorConnected &&
      checkForSave &&
      (isOpen === "Stop Temperature Experiment" ||
        isOpen === "Stop Voltage Experiment")
    ) {
      setModal("Do you want to save the experiment data?");
    }
  }, [
    checkForSave,
    status?.operation,
    status?.sensorConnected,
    isOpen,
    location?.pathname,
  ]);

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

  useEffect(() => {
    // for back behaviour on scan page
    if (location?.pathname !== currentURI) {
      previousURL.next(currentURI);
      currentURL.next(location?.pathname);
    }
  }, [location?.pathname, currentURI]);

  useEffect(() => { // back icon show or not on initial page
    if(connected && pathHistory?.length !== 0){
      urlPathsHistory.next([])
    }else if(!connected && pathHistory[pathHistory.length -1] !== location?.pathname){
      if(pathHistory.length === 0 && location?.pathname  === "/scan-devices")
      {
        // we do not push initial scan-devices route
      }else if(onClick !== "back"){
        urlPathsHistory.next([...pathHistory,location?.pathname])
      }
    }
  },[location?.pathname,connected,pathHistory,onClick])

  useEffect(() => { // stop rgb experiements when we go out it's section
    let rgbPaths = ["/spectrophotometer-calibration","/calibration-testing","/spectrophotometer-testing","/measure-absorbance"]
    if(location?.pathname && !rgbPaths.includes(location?.pathname)){
      if(status?.operation === "rgb_calibrate" || status?.operation === "rgb_calibrate_test" || status?.operation === "rgb_measure"){
        stopRgbExperiment()
      }
    }
  },[location?.pathname,status?.operation])

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
        handleShare={handleShare}
        handleSync={handleSync}
        previousURI={previousURI}
        pathHistory={pathHistory}
      />
      {isOpen && isOpen !== "device disconnect and save data" && (
        <MemberDisconnect
          isOpen={isOpen ? true : false}
          setModal={(value) => setModal(value)}
          handleDisconnect={
            // on press yes
            isOpen === "delete"
              ? handleDelete
              : isOpen === "Stop Heater Experiment" ||
                isOpen === "Stop Temperature Probe Experiment" ||
                isOpen ===
                  "Stop Heater Experiment and save Setpoint Temperature" ||
                isOpen ===
                  "Stop Temperature Probe Experiment and save Setpoint Temperature" ||
                isOpen === "Do you want to save set point Temperature?" ||
                isOpen === "Do you want to save the experiment data?" ||
                isOpen === "Stop Temperature Experiment and save data" ||
                isOpen === "Stop Temperature Experiment" ||
                isOpen === "Stop Voltage Experiment and save data" ||
                isOpen === "Stop Voltage Experiment"
              ? handleStopProcess
              : handleDisconnectLeaderMember
          }
          message={
            isOpen === "delete"
              ? "Do you want to delete file?"
              : isOpen === "Stop Heater Experiment" ||
                isOpen === "Stop Temperature Probe Experiment" ||
                isOpen ===
                  "Stop Heater Experiment and save Setpoint Temperature" ||
                isOpen ===
                  "Stop Temperature Probe Experiment and save Setpoint Temperature" ||
                isOpen === "Stop Temperature Experiment and save data" ||
                isOpen === "Stop Temperature Experiment" ||
                isOpen === "Stop Voltage Experiment and save data" ||
                isOpen === "Stop Voltage Experiment"
              ? "Do you want to stop the experiment?" //`Are you sure to ${isOpen}?`
              : isOpen === "Do you want to save the experiment data?" ||
                isOpen === "Do you want to save set point Temperature?"
              ? isOpen
              : "Are you sure to Disconnect!"
          }
          handleCancel={() => handleCancelModal()} // on press no
        />
      )}
      {isOpen === "device disconnect and save data" && (
        <SensorDisconnectModal
          isOpen={isOpen ? true : false}
          setModal={(value) => handleDisconnectedUnSaveData()} // no
          submitModal={() => handleDisconnectedSaveData()} // yes
          message={`You have been disconnected from the device. do you want to save the experiment data?`}
          checkForSave={checkForSave}
        />
      )}
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
      {connected && (
        <div
          className={styles.BatteryWapper}
          title={(status?.batteryLevel || 0) + "%"}
        >
          <div style={{ marginRight: 5, color: "#FFFFFF", fontSize: 14 }}>
            {status?.batteryLevel || 0}%
          </div>
          <div className={styles.BatteryInnerWapper}>
          <div style={{ backgroundColor: status?.batteryLevel>10?'#79D179':'red', width:`${status?.batteryLevel}%`}}></div>
            <div style={{ flex: 1 }}></div>
            {/* <div style={unFilledStyle}></div>
          <div style={filledStyle}></div> */}
           {status?.chargerConnected ? <img
              src={BatteryIcon}
              className={styles.BatteryIcon}
              alt="battery Icon"
            /> : null}
          </div>
          <div className={styles.BatteryHandle}></div>
        </div>
      )}
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
  handleShare,
  handleSync,
  previousURI,
  pathHistory
}: SecondHeaderprops) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<any>(null);
  const handleSubmit = (title: string) => {
    if (title) {
      handleShare(title);
      setIsOpen(null);
    }
  };
  const isMobile = window.innerWidth <= mobileWidth ? true : false;

  return (
    <>
      <div className={styles.SecondHeaderWrapper}>
        {location?.pathname !== "/scan-devices" || ((previousURI && connected) || (!connected && pathHistory?.length)) ? (
          <button
            style={{
              outline: "none",
              border: "none",
              backgroundColor: "inherit",
            }}
            onClick={() =>
              previousURI || location?.pathname !== "/scan-devices"
                ? handleBack()
                : {}
            }
          >
            <img
              src={BackIcon}
              style={{
                cursor:
                  location?.pathname !== "/scan-devices" || previousURI
                    ? "pointer"
                    : "not-allowed",
                width: 25,
              }}
              alt="Back Icon"
            />
          </button>
        ) : (
          <div></div>
        )}
        {!["/temperature-records", "/voltage-records", "/rgb-records"].includes(
          location?.pathname
        ) ? (
          <div className={styles.FistHeaderSubWrapper}>
            {location.pathname !== "/my-records" && (
              <button
                style={{
                  outline: "none",
                  border: "none",
                  backgroundColor: "inherit",
                }}
                onClick={() => handleMyRecord()}
              >
                <img
                  src={MyRecordsIcon}
                  style={{ cursor: "pointer", width: 32, marginTop: 2 }}
                  alt="my record Icon"
                />
              </button>
            )}
            {location.pathname !== "/scan-devices" && (
              <button
                style={{
                  outline: "none",
                  border: "none",
                  backgroundColor: "inherit",
                }}
                onClick={() => handleConnectionManager()}
              >
                <img
                  src={ShareIcon}
                  style={{ cursor: "pointer", width: 25 }}
                  alt="connection manager Icon"
                />
              </button>
            )}
            {connected &&
              status?.leaderSelected &&
              clientId !== status?.leaderSelected && (
                <button
                  style={{
                    outline: "none",
                    border: "none",
                    backgroundColor: "inherit",
                  }}
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
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "inherit",
              }}
              onClick={() =>
                isMobile
                  ? handleShare()
                  :handleShare() /*  setIsOpen({ // when open modal for share in web
                      selectedButton: location.state.data.selectedButton,
                      data: location.state.data.selectedData,
                    }) */
              }
            >
              <img
                src={WhiteShareIcon}
                style={{
                  cursor: "pointer",
                  width: 20,
                  height: 20,
                  marginRight: 5,
                }}
                alt="Share Icon"
              />
            </button>
            <button
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "inherit",
              }}
              onClick={handleDownload}
            >
              <img
                src={WhiteDownloadIcon}
                style={{ cursor: "pointer", width: 20, marginRight: 5 }}
                alt="Download Icon"
              />
            </button>
            <button
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "inherit",
              }}
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
      {isOpen && (
        <ShareModal
          isOpen={isOpen}
          setModal={(value: any) => setIsOpen(value)}
          handleSubmit={handleSubmit}
        />
      )}
    </>
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
  handleShare: (title?: string) => void;
  handleSync: () => void;
  previousURI: string | null;
  pathHistory:string[];
};

export interface HeaderProps {
  setPointTemp?: number;
  checkForSave?: boolean;
  handleSave?: () => void;
  shouldCloseModal?: boolean;
}
