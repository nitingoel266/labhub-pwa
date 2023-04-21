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
} from "./Constants";
import { VOLTAGE_DATA } from "../utils/const";
import Header from "./header";
import { useNavigate } from "react-router-dom";

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
    setGraphData([]);
    setCapturePoint([]);
    startSensorExperiment();
    setModal("");
    setIsSaved(false);
    setIsStart(true);
  };
  const handleStop = () => {
    setModal("");
    stopSensorExperiment();
    setIsStart(false);
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
  useEffect(() =>{
    if(graphData.length > 0 && graphData.length <= 1 && clientId !== status?.leaderSelected){
      setCheckForLog(graphData.length)
    }
  },[graphData,clientId,status?.leaderSelected])

  useEffect(() => {
    const getTemperatureData = async () =>{
    if (
      status?.sensorConnected === "voltage" &&
      dataStream?.sensor //&&
      // clientId === status?.leaderSelected
    ) {
      if(clientId !== status?.leaderSelected && dataStream?.sensor?.voltageIndex === 0){
        setGraphData([]);
        setCapturePoint([]);
      }
      if(clientId !== status?.leaderSelected && dataStream?.sensor?.voltageIndex && dataStream?.sensor?.voltageIndex > 0 && dataStream?.sensor?.voltageIndex > checkForLog && checkForLog <= 0){
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
    getTemperatureData()
  }, [
    dataStream,
    dataStream?.sensor?.voltage,
    status?.setupData?.dataRate,
    status?.sensorConnected,
    clientId,
    status?.leaderSelected,
    checkForLog
  ]);

  useEffect(() => {
    if (dataStream.sensor === null) {
      setIsStart(false);
    } else if (dataStream?.sensor?.voltage && !isStart) {
      // for test-screen
      setIsStart(true);
    }
  }, [dataStream?.sensor, isStart]);
  const extraStyle = { backgroundColor: "#989DA3", cursor: "not-allowed" };
  return (
    <>
      <Header
        checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
        handleSave={handleSave}
      />
      <div className={styles.TopWrapper}>
        <div className={styles.HeaderWrapper}>
          <div style={{ fontWeight: 500 }}>Measuring Voltage</div>
          <div> </div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
          <div>
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
              <div
                onClick={() =>
                  clientId === status?.leaderSelected && status?.sensorConnected === "voltage"
                    ? setModal(graphData?.length ? "restart" : "start")
                    : {}
                }
                className={styles.RestartButton}
                style={
                  isStart || clientId !== status?.leaderSelected
                    ? extraStyle
                    : {}
                }
              >
                {isStart || graphData?.length ? "Restart" : "Start"}
              </div>
              <div
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
              </div>
              {status?.setupData?.dataRate === "user" && (
                <div
                  className={styles.CaptureButton}
                  style={graphData?.length > 0 ? {} : extraStyle}
                  onClick={() => (graphData?.length > 0 ? handleCapture() : {})}
                >
                  Capture
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.FooterTextWrapper}>
          <div className={styles.FooterInnerTextWrapper}>
            <div>TITLE</div>
            <div className={styles.FooterText}>
              <div>T101722-1334-M4</div>
              <div
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
              </div>
            </div>
          </div>
        </div>
        {window.innerWidth <= mobileWidth ? (
          <div className={styles.ButtonHorizontalWrapper}>
            <div className={styles.ButtonHorizontalInnerWrapper}>
              <div
                onClick={() =>
                  clientId === status?.leaderSelected && status?.sensorConnected === "voltage"
                    ? setModal(graphData?.length ? "restart" : "start")
                    : {}
                }
                className={styles.RestartHorizontalButton}
                style={
                  isStart || clientId !== status?.leaderSelected
                    ? extraStyle
                    : {}
                }
              >
                {isStart || graphData?.length ? "Restart" : "Start"}
              </div>
              <div
                onClick={() =>
                  clientId === status?.leaderSelected && isStart
                    ? setModal("stop")
                    : {}
                }
                className={styles.StopHorizontalButton}
                style={
                  !isStart || clientId !== status?.leaderSelected
                    ? extraStyle
                    : {}
                }
              >
                Stop
              </div>
              <div
                className={styles.CaptureHorizontalButton}
                style={graphData?.length > 0 ? {} : extraStyle}
                onClick={() => (graphData?.length > 0 ? handleCapture() : {})}
              >
                Capture
              </div>
            </div>
          </div>
        ) : null}
        <MemberDisconnect
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
        />
        <RightArrow
          isSelected={capturePoint?.some((el: number) => el > 0) ? true : false}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default MeasuringVoltage;
