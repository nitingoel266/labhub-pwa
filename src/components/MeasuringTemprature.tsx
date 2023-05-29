import styles from "../styles/measuringTemprature.module.css";
import RightArrow from "./RightArrow";
import { useEffect, useState } from "react";
import { useDeviceStatus, useDeviceDataFeed } from "../labhub/status";
import { startSensorExperiment, stopSensorExperiment } from "../labhub/actions";
import {getClientId} from "../labhub/utils";
import {getTemperatureLog} from "../labhub/actions-client";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import TemperatureGraph from "./Graphs/TemperatureGraph";
import {
  getFileName,
  getDate,
  getTime,
  validateFileName,
  getStorageKeys,
  mobileWidth,
  toastMessage,
} from "./Constants";
import { TEMPERATURE_DATA } from "../utils/const";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import SensorDisconnectModal from "./Modal/SensorDisconnectModal";

const MeasuringTemprature = () => {
  const clientId = getClientId()
  const [status] = useDeviceStatus();
  const navigate = useNavigate();
  const [dataStream] = useDeviceDataFeed();
  const [dataSetup] = useState(status?.setupData);
  const [isOpen, setModal] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [capturePoint, setCapturePoint] = useState<any>([]);

  const [tempratureUnit, setTempratureUnit] = useState<string>("c");
  const [graphData, setGraphData] = useState<any>([]); // {time:in sec,temp}
  const [checkForLog,setCheckForLog] = useState<any>(0)

  const handleSubmit = () => {
    if (dataStream.sensor !== null || (graphData.length > 0 && !isSaved)) {
      if (dataStream.sensor !== null && clientId === status?.leaderSelected) {
        setModal("stop");
      } else if (graphData.length > 0 && !isSaved)
        setModal("Do you want to save Data?");
    }else navigate("/function-selection");
  };
  const handleRestart = () => {
    setCheckForLog(1)
    setGraphData([]);
    setCapturePoint([]);
    //setIsStart(true);
    startSensorExperiment();
    setModal("");
    setIsSaved(false);
  };
  const handleStop = () => {
    setModal("");
    stopSensorExperiment();
    //setIsStart(false);
  };
  const handleSubmitProcess = () => {
    setModal("");
    handleSave()
    navigate("/function-selection")
  }
  const handleCapture = () => {
    if (graphData) {
      setIsSaved(false);
      let items = [...capturePoint];
      items[graphData.length - 1] = 2;
      setCapturePoint(items);
    }
  };
  const handleSave = () => {
    setIsSaved(true);
    let resultTemperature = [];
    for (let one in capturePoint) {
      if (capturePoint[one] > 0) {
        let item = graphData[one];
        // if (tempratureUnit === "f")
        //   item = {
        //     ...item,
        //     temp: Number((((item?.temp - 32) * 5) / 9).toFixed(1)),
        //   };
        resultTemperature.push(item);
      }
    }
    if(resultTemperature.length > 0){
        let fileName = "T" + getFileName();
        if (clientId === status?.leaderSelected) {
        // for leader
        fileName += "L";
        } else if (clientId) {
        fileName +=
            "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        }
        let verifiedFileName = validateFileName(
        getStorageKeys(TEMPERATURE_DATA),
        fileName
        );
        let resultData = {
        name: verifiedFileName,
        date: getDate(),
        time: getTime(),
        data: resultTemperature,
        };
        let storageTempData = JSON.stringify(resultData);
        localStorage.setItem(
        `${TEMPERATURE_DATA}_${verifiedFileName}`,
        storageTempData
        );
        toastMessage.next("Saved successfully!")
    }
    // console.log("save the data in record section ",resultTemperature,fileName)
    //save the temperature in labhub device in celcis mode
  };

  const handleCancelModal = () => {
    setModal("")
    if(isOpen === "Do you want to save Data?"){
        navigate("/function-selection")
    }
  }

  const handleSensorDisconnected = (value:any) => {
    setModal(value)
    navigate("/sensors")
  }

  useEffect(() => {
    const getTemperatureData = async () =>{
    if (
      status?.sensorConnected === "temperature" &&
      dataStream?.sensor /* &&
      clientId === status?.leaderSelected */
    ) {
      if(clientId !== status?.leaderSelected && dataStream?.sensor?.temperatureIndex === 0){
        setGraphData([]);
        setCapturePoint([]);
      }
      if(/* clientId !== status?.leaderSelected &&  */dataStream?.sensor?.temperatureIndex && dataStream?.sensor?.temperatureIndex > 0 && dataStream?.sensor?.temperatureIndex > checkForLog && checkForLog <= 0){
        setCheckForLog(1)
        let tempLogData:any = await getTemperatureLog(dataStream?.sensor?.temperatureIndex || 0);
          let logData:any = [];
          let capturePoints:any = [];
          for (let one in tempLogData) {
            if (Number(one) >= 0) {
              logData.push({
                time:
                  Number(one) *
                  Number(
                    status?.setupData?.dataRate === "user"
                      ? 1
                      : status?.setupData?.dataRate
                  ),
                temp: tempLogData[one]
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
            temp: dataStream?.sensor?.temperature,
          },
        ];
      });
      setCapturePoint((prevData: any) => [
        ...prevData,
        status?.setupData?.dataRate === "user" ? 0 : 2,
      ]);
      setIsSaved(false);
    } /* else if (clientId !== status?.leaderSelected && dataStream) {
      // console.log("??>>>>>>>>>>>>>> ",getTemperatureLog(dataStream?.sensor?.temperatureIndex || 0) , "ind ",dataStream?.sensor?.temperatureIndex)
      let logData = [],
        capturePoints: any = [];
      if (dataStream?.sensor?.temperatureLog) {
        for (let one in dataStream.sensor.temperatureLog) {
          if (Number(one) >= 0) {
            logData.push({
              time:
                Number(one) *
                Number(
                  status?.setupData?.dataRate === "user"
                    ? 1
                    : status?.setupData?.dataRate
                ),
              temp: dataStream.sensor.temperatureLog[one],
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
  getTemperatureData()
  }, [
    dataStream?.sensor,
    dataStream?.sensor?.temperature,
    dataStream?.sensor?.temperatureIndex,
    status?.setupData?.dataRate,
    status?.sensorConnected,
    clientId,
    status?.leaderSelected,
    checkForLog
  ]);

  useEffect(() => {
    if (status?.operation !== "measure_temperature" || status?.sensorConnected !== "temperature") {
      setIsStart(false);
    } else if (status?.operation === "measure_temperature" && !isStart) {
      // for test-screen
      setIsStart(true);
    }
  }, [status?.operation,status?.sensorConnected, isStart]);

  useEffect(() => { // stop temperature experiment and show a modal that sensor disconnected and for go back
    if(status?.sensorConnected !== "temperature"){
      if(status?.operation === "measure_temperature"){
        stopSensorExperiment();
      }
      setModal("Temperature Sensor disconnected")
    }else if(status?.sensorConnected === "temperature"){
      setModal("")
    }
  },[status?.sensorConnected,status?.operation])

  useEffect(() => { // save data and go back only for member if leader change data setup and member is n measuring screen
    if(status?.setupData && JSON.stringify(status?.setupData) !== JSON.stringify(dataSetup) && clientId !== status?.leaderSelected){
      if(capturePoint?.some((el: number) => el > 0) && !isSaved){
        setModal("Do you want to save Data?")
      }else navigate("/function-selection")
    }
  },[status?.setupData,dataSetup,clientId,status?.leaderSelected,capturePoint,isSaved,navigate])

  const extraStyle = { backgroundColor: "#989DA3", cursor: "not-allowed" };
  return (
    <>
      <Header
        checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
        handleSave={handleSave}
        shouldCloseModal = {isOpen === "Temperature Sensor disconnected" ? true : false}
      />
      <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.TopWrapper}>
        <div className={styles.HeaderWrapper}>
          <h4 aria-label="Measuring temperture header text" style={{ fontWeight: 500 }}>Measuring Temperature</h4>
          <div className={styles.HeaderRightWrapper}>
            <button
              aria-label="Degree Celcius button"
              onClick={() => setTempratureUnit("c")}
              className={styles.TempratureDegree}
              style={{
                backgroundColor: tempratureUnit === "c" ? "#424C58" : "#9CD5CD",
                color: tempratureUnit === "c" ? "#FFFFFF" : "#000000",
              }}
            >
              <div style={{fontSize:14}}>C</div>
              <div
                className={styles.TempratureDegreeIcon}
                style={{
                  border: `1px solid ${
                    tempratureUnit === "c" ? "#FFFFFF" : "#000000"
                  }`,
                }}
              >
                {" "}
              </div>
            </button>
            <button
              aria-label="Degree farahenit button"
              onClick={() => setTempratureUnit("f")}
              className={styles.TempratureDegree}
              style={{
                backgroundColor: tempratureUnit === "f" ? "#424C58" : "#9CD5CD",
                color: tempratureUnit === "f" ? "#FFFFFF" : "#000000",
              }}
            >
              <div style={{fontSize:14}}>F</div>
              <div
                className={styles.TempratureDegreeIcon}
                style={{
                  border: `1px solid ${
                    tempratureUnit === "f" ? "#FFFFFF" : "#000000"
                  }`,
                }}
              >
                {" "}
              </div>
            </button>
          </div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
          <div aria-label="Temperature value">Temperature Value : {tempratureUnit === 'f' && graphData[graphData.length - 1]?.temp ? ((9 / 5) * graphData[graphData.length - 1]?.temp + 32).toFixed(1) : graphData[graphData.length - 1]?.temp}</div>
          <div className={styles.DegreeStyle}> </div>
          <div aria-label={"in degree "+ tempratureUnit.toUpperCase()}>{tempratureUnit.toUpperCase()}</div>
        </div>
        <div className={styles.TextBody}>
          <div className={styles.GraphStyle}>
            <TemperatureGraph
              data={graphData}
              showPoint={status?.setupData?.dataRate === "user" ? false : true}
              capturePoint={capturePoint}
              title={"Temperature"}
              temperatureUnit = {tempratureUnit}
            />
          </div>
          {window.innerWidth > mobileWidth ? (
            <div className={styles.ButtonWrapper}>
              <button
                aria-label="Start button"
                onClick={() =>
                  clientId === status?.leaderSelected && !isStart && status?.sensorConnected === "temperature"
                    ? setModal(status?.operation === "measure_temperature" ? "restart" : "start")
                    : {}
                }
                className={styles.RestartButton}
                style={
                  isStart || clientId !== status?.leaderSelected || status?.sensorConnected !== "temperature"
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
                  aria-label="Capture button"
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
            <div aria-label="title sub header">TITLE</div>
            <div className={styles.FooterText}>
              <div aria-label="file format T101722-1334-M4">T101722-1334-M4</div>
              <button
                aria-label="Save button"
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
            <div className={styles.ButtonHorizontalInnerWrapper} style={status?.setupData?.dataRate !== "user" ? {justifyContent:"center"} : {}} >
              <button
                aria-label="Start button"
                onClick={() =>
                  clientId === status?.leaderSelected && !isStart && status?.sensorConnected === "temperature"
                    ? setModal(status?.operation === "measure_temperature" ? "restart" : "start")
                    : {}
                }
                className={styles.RestartHorizontalButton}
                style={
                  isStart || clientId !== status?.leaderSelected || status?.sensorConnected !== "temperature"
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
                aria-label="Capture button"
                className={styles.CaptureHorizontalButton}
                style={graphData?.length > 0 ? {} : extraStyle}
                onClick={() => (graphData?.length > 0 ? handleCapture() : {})}
              >
                Capture
              </button>}
            </div>
          </div>
        ) : null}
        {isOpen !== "Temperature Sensor disconnected" && isOpen && <MemberDisconnect
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
        {isOpen === "Temperature Sensor disconnected" && <SensorDisconnectModal 
           isOpen={isOpen ? true : false}
           setModal={(value) => handleSensorDisconnected(value)}
           message="Temperature Sensor isn't Connected!"
        />}
        <RightArrow
          isSelected={capturePoint?.some((el: number) => el > 0) ? true : false}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default MeasuringTemprature;
