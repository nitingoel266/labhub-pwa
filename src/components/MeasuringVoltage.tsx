import styles from "../styles/measuringTemprature.module.css";
import RightArrow from "./RightArrow";
import { useEffect, useState } from "react";
import { useDeviceStatus, useDeviceDataFeed } from "../labhub/status";
import { startSensorExperiment, stopSensorExperiment } from "../labhub/actions";
import {getClientId} from "../labhub/utils";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import TemperatureGraph from "./Graphs/TemperatureGraph";
import {getVoltageLog} from "../labhub/actions-client";
import {
  getFileName,
  getDate,
  getTime,
  validateFileName,
  getStorageKeys,
  mobileWidth,
  toastMessage
} from "./Constants";
import { VOLTAGE_DATA } from "../utils/const";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import SensorDisconnectModal from "./Modal/SensorDisconnectModal";

const MeasuringVoltage = () => {
  const clientId = getClientId()
  const [status] = useDeviceStatus();
  const navigate = useNavigate();
  const [dataStream] = useDeviceDataFeed();
  const [isOpen, setModal] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [capturePoint, setCapturePoint] = useState<any>([]);
  const [checkForLog,setCheckForLog] = useState<any>(0)

  const [graphData, setGraphData] = useState<any>([]); // {time:in sec,voltage}

  const handleSubmit = () => {
    if (dataStream.sensor !== null || (graphData.length > 0 && !isSaved)) {
      if (dataStream.sensor !== null && clientId === status?.leaderSelected) {
        setModal("stop");
      } else if (graphData.length > 0 && !isSaved)
        setModal("Do you want to save Data?");
    } else navigate("/function-selection");
  };
  const handleRestart = () => {
    setCheckForLog(1)
    setGraphData([]);
    setCapturePoint([]);
    // setIsStart(true);
    startSensorExperiment();
    setModal("");
    setIsSaved(false);
  };
  const handleStop = () => {
    setModal("");
    stopSensorExperiment();
    // setIsStart(false);
  };
  const handleCapture = () => {
    if (graphData) {
      setIsSaved(false);
      let items = [...capturePoint];
      items[graphData.length - 1] = 2;
      setCapturePoint(items);
    }
  };
  const handleSubmitProcess = () => {
    setModal("");
    handleSave();
    navigate("/function-selection");
  };
  const handleSave = () => {
    setIsSaved(true);
    let resultVoltage = [];
    for (let one in capturePoint) {
      if (capturePoint[one] > 0) {
        resultVoltage.push({
          time: graphData[one]?.time,
          voltage: graphData[one]?.temp,
        });
      }
    }
    if(resultVoltage.length > 0){
        let fileName = "V" + getFileName();
        if (clientId === status?.leaderSelected) {
        // for leader
        fileName += "L";
        } else if (clientId) {
        fileName +=
            "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        }
        let verifiedFileName = validateFileName(
        getStorageKeys(VOLTAGE_DATA),
        fileName
        );
        let resultData = {
        name: verifiedFileName,
        date: getDate(),
        time: getTime(),
        data: resultVoltage,
        };
        let storageVoltageData = JSON.stringify(resultData);
        localStorage.setItem(
        `${VOLTAGE_DATA}_${verifiedFileName}`,
        storageVoltageData
        );
        toastMessage.next("Saved successfully!")
    }
    // console.log("save the data in record section ",resultVoltage)
    //save the voltage in labhub device in celcis mode
  };
  const handleCancelModal = () => {
    setModal("");
    if (isOpen === "Do you want to save Data?") {
      navigate("/function-selection");
    }
  };
  // useEffect(() =>{
  //   if(graphData.length > 0 && graphData.length <= 1 && clientId !== status?.leaderSelected){
  //     setCheckForLog(graphData.length)
  //   }
  // },[graphData,clientId,status?.leaderSelected])

  const handleSensorDisconnected = (value:any) => {
    setModal(value)
    navigate("/sensors")
  }

  useEffect(() => {
    const getVoltageData = async () =>{
    if (
      status?.sensorConnected === "voltage" &&
      dataStream?.sensor //&&
      // clientId === status?.leaderSelected
    ) {
      if(clientId !== status?.leaderSelected && dataStream?.sensor?.voltageIndex === 0){
        setGraphData([]);
        setCapturePoint([]);
      }
      if(/* clientId !== status?.leaderSelected && */ dataStream?.sensor?.voltageIndex && dataStream?.sensor?.voltageIndex > 0 && dataStream?.sensor?.voltageIndex > checkForLog && checkForLog <= 0){
        setCheckForLog(1)
        let volLogData:any = await getVoltageLog(dataStream?.sensor?.voltageIndex || 0);
          let logData:any = [];
          let capturePoints:any = [];
          for (let one in volLogData) {
            if (Number(one) >= 0) {
              logData.push({
                time:
                  Number(one) *
                  Number(
                    status?.setupData?.dataRate === "user"
                      ? 1
                      : status?.setupData?.dataRate
                  ),
                temp: volLogData[one]
              });
              capturePoints.push(status?.setupData?.dataRate === "user" ? 0 : 2);
            }
          }
          setGraphData(logData);
          setCapturePoint(capturePoints)
      }
      setGraphData((prevData: any) => {
        return [
          ...prevData,
          {
            time:
              prevData.length *
              Number(
                status?.setupData?.dataRate === "user"
                  ? 1
                  : status?.setupData?.dataRate
              ),
            temp: dataStream?.sensor?.voltage,
          },
        ];
      });
      setCapturePoint((prevData: any) => [
        ...prevData,
        status?.setupData?.dataRate === "user" ? 0 : 2,
      ]);
      setIsSaved(false);
    } /* else if (clientId !== status?.leaderSelected && dataStream) {
      let logData = [],
        capturePoints: any = [];
      if (dataStream?.sensor?.voltageLog) {
        for (let one in dataStream.sensor.voltageLog) {
          if (Number(one) >= 0) {
            logData.push({
              time:
                Number(one) *
                Number(
                  status?.setupData?.dataRate === "user"
                    ? 1
                    : status?.setupData?.dataRate
                ),
              temp: dataStream.sensor.voltageLog[one],
            });
            capturePoints.push(status?.setupData?.dataRate === "user" ? 0 : 2);
          }
        }
        setGraphData(logData);
        setCapturePoint((prevCapPoints: any) => {
          for (let one in prevCapPoints) {
            if (prevCapPoints[one] > 0) capturePoints[one] = prevCapPoints[one];
          }
          return capturePoints;
        });
        setIsSaved(false);
      }
    } */
    }
    getVoltageData()
  }, [
    dataStream?.sensor,
    dataStream?.sensor?.voltage,
    dataStream?.sensor?.voltageIndex,
    status?.setupData?.dataRate,
    status?.sensorConnected,
    clientId,
    status?.leaderSelected,
    checkForLog
  ]);

  useEffect(() => {
    if (status?.operation !== "measure_voltage" || status?.sensorConnected !== "voltage") {
      setIsStart(false);
    } else if (status?.operation === "measure_voltage" && !isStart) {
      // for test-screen
      setIsStart(true);
    }
  }, [status?.operation,status?.sensorConnected, isStart]);

  useEffect(() => { // stop voltage experiment and show a modal that sensor disconnected and for go back
    if(status?.sensorConnected !== "voltage"){
      if(status?.operation === "measure_voltage"){
        stopSensorExperiment();
      }
      setModal("Voltage Sensor disconnected")
    }else if(status?.sensorConnected === "voltage"){
      setModal("")
    }
  },[status?.sensorConnected,status?.operation])

  const extraStyle = { backgroundColor: "#989DA3", cursor: "not-allowed" };
  return (
    <>
      <Header
        checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
        handleSave={handleSave}
        shouldCloseModal = {isOpen === "Voltage Sensor disconnected" ? true : false}
      />
      <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.TopWrapper}>
        <div className={styles.HeaderWrapper}>
          <div aria-label="measuring voltage header text" style={{ fontWeight: 500 }}>Measuring Voltage</div>
          <div> </div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
          <div aria-label="voltage value in volt">
            Voltage Value : {graphData[graphData.length - 1]?.temp || 0}V
          </div>
        </div>
        <div className={styles.TextBody}>
          <div className={styles.GraphStyle}>
            <TemperatureGraph
              data={graphData}
              showPoint={status?.setupData?.dataRate === "user" ? false : true}
              capturePoint={capturePoint}
              title={"Voltage"}
            />
          </div>
          {window.innerWidth > mobileWidth ? (
            <div className={styles.ButtonWrapper}>
              <button
                aria-label="start button"
                onClick={() =>
                  clientId === status?.leaderSelected && !isStart && status?.sensorConnected === "voltage"
                    ? setModal(graphData?.length ? "restart" : "start")
                    : {}
                }
                className={styles.RestartButton}
                style={
                  isStart || clientId !== status?.leaderSelected || status?.sensorConnected !== "voltage"
                    ? extraStyle
                    : {}
                }
              >
                {isStart || graphData?.length ? "Restart" : "Start"}
              </button>
              <button
                aria-label="stop button"
                onClick={() =>
                  clientId === status?.leaderSelected && isStart
                    ? setModal("stop")
                    : {}
                }
                className={styles.StopButton}
                style={
                  !isStart || clientId !== status?.leaderSelected
                    ? extraStyle
                    : {}
                }
              >
                Stop
              </button>
              {status?.setupData?.dataRate === "user" && (
                <button
                  aria-label="capture button"
                  className={styles.CaptureButton}
                  style={graphData?.length > 0 ? {} : extraStyle}
                  onClick={() => (graphData?.length > 0 ? handleCapture() : {})}
                >
                  Capture
                </button>
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.FooterTextWrapper}>
          <div className={styles.FooterInnerTextWrapper}>
            <div aria-label="title text">TITLE</div>
            <div className={styles.FooterText}>
              <div aria-label="file format T101722-1334-M4">T101722-1334-M4</div>
              <button
               aria-label="save button"
                className={styles.SaveButton}
                style={
                  capturePoint?.some((el: number) => el > 0) && !isSaved
                    ? {}
                    : { backgroundColor: "#A0A5AB", cursor: "not-allowed" }
                }
                onClick={() =>
                  capturePoint?.some((el: number) => el > 0) && !isSaved
                    ? handleSave()
                    : {}
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {window.innerWidth <= mobileWidth ? (
          <div className={styles.ButtonHorizontalWrapper}>
            <div className={styles.ButtonHorizontalInnerWrapper} style={status?.setupData?.dataRate !== "user" ? {justifyContent:"center"} : {}}>
              <button
                aria-label="Start button"
                onClick={() =>
                  clientId === status?.leaderSelected && !isStart && status?.sensorConnected === "voltage"
                    ? setModal(graphData?.length ? "restart" : "start")
                    : {}
                }
                className={styles.RestartHorizontalButton}
                style={
                  isStart || clientId !== status?.leaderSelected || status?.sensorConnected !== "voltage"
                    ? extraStyle
                    : {}
                }
              >
                {isStart || graphData?.length ? "Restart" : "Start"}
              </button>
              <button
                aria-label="stop button"
                onClick={() =>
                  clientId === status?.leaderSelected && isStart
                    ? setModal("stop")
                    : {}
                }
                className={styles.StopHorizontalButton}
                style={
                  !isStart || clientId !== status?.leaderSelected
                    ? {...extraStyle,...(status?.setupData?.dataRate !== "user" ? {marginLeft:20} : {})}
                    : {...(status?.setupData?.dataRate !== "user" ? {marginLeft:20} : {})}
                }
              >
                Stop
              </button>
              {status?.setupData?.dataRate === "user" && <button
                aria-label="capture button"
                className={styles.CaptureHorizontalButton}
                style={graphData?.length > 0 ? {} : extraStyle}
                onClick={() => (graphData?.length > 0 ? handleCapture() : {})}
              >
                Capture
              </button>}
            </div>
          </div>
        ) : null}
        {isOpen !== "Voltage Sensor disconnected" && isOpen && <MemberDisconnect
          isOpen={isOpen ? true : false}
          setModal={(value) => setModal(value)}
          handleDisconnect={
            isOpen === "restart" || isOpen === "start"
              ? handleRestart
              : isOpen === "Do you want to save Data?" ? 
              handleSubmitProcess
              : handleStop
          }
          message={isOpen === "Do you want to save Data?" ? isOpen : `Do you want to ${isOpen} the experiment.`}
          handleCancel = {handleCancelModal}
        />}
        {isOpen === "Voltage Sensor disconnected" && <SensorDisconnectModal 
          isOpen={isOpen ? true : false}
          setModal={(value) => handleSensorDisconnected(value)}
          message="Voltage Sensor isn't Connected!"
        />}
        <RightArrow
          isSelected={capturePoint?.some((el: number) => el > 0) ? true : false}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default MeasuringVoltage;
