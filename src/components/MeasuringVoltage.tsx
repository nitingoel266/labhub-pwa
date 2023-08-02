import styles from "../styles/measuringTemprature.module.css";
// import RightArrow from "./RightArrow";
import { useEffect, useRef, useState } from "react";
import { useDeviceStatus, useDeviceDataFeed ,useDeviceConnected} from "../labhub/status";
import { startSensorExperiment,restartSensorExperiment, stopSensorExperiment } from "../labhub/actions";
import {getClientId} from "../labhub/utils";
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import TemperatureGraph from "./Graphs/TemperatureGraph";
import {getVoltageLog} from "../labhub/actions-client";
import {
  getTitle,
  getDate,
  // getTime,
  validateFileName,
  getStorageKeys,
  mobileWidth,
  toastMessage,
  getDeviceClientName
} from "./Constants";
import { VOLTAGE_DATA } from "../utils/const";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import SensorDisconnectModal from "./Modal/SensorDisconnectModal";
import AppexCharts from "./Graphs/AppexChart";

const MeasuringVoltage = () => {
  const clientId = getClientId()
  const [connected] = useDeviceConnected();
  const [status] = useDeviceStatus();
  const navigate = useNavigate();
  const [dataStream] = useDeviceDataFeed();
  const [dataSetup] = useState(status?.setupData);
  const [title,setTitle] = useState<any>(getTitle("V", clientId,status));
  const [isOpen, setModal] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [capturePoint, setCapturePoint] = useState<any>([]);
  const [checkForLog,setCheckForLog] = useState<any>(0)
  const [sensorDisconnectCheckForSave , setSensorDisconnectCheckForSave] = useState<boolean>(false);

  const [graphData, setGraphData] = useState<any>([]); // {time:in sec,voltage}
  const [labels,setLabels] = useState<any>([]);

  const measuringVoltageRef:any = useRef(null)

  // const handleSubmit = () => {
  //   if (dataStream.sensor !== null || (graphData.length > 0 && !isSaved)) {
  //     if (dataStream.sensor !== null && clientId === status?.leaderSelected) {
  //       setModal("stop");
  //     } else if (graphData.length > 0 && !isSaved)
  //       setModal("Do you want to save the experiment data?");
  //   } else navigate("/function-selection");
  // };
  const handleRestart = () => {
    setCheckForLog(1)
    setGraphData([]);
    setCapturePoint([]);
    // setIsStart(true);
    if(isOpen === "restart"){
      restartSensorExperiment()
    }else
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
        // let fileName = "V" + getFileName();
        // if (clientId === status?.leaderSelected) {
        // // for leader
        // fileName += "L";
        // } else if (clientId) {
        // fileName +=
        //     "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        // }
        let fileName = title;
        let verifiedFileName = validateFileName(
        getStorageKeys(VOLTAGE_DATA),
        fileName
        );
        let resultData = {
        name: verifiedFileName,
        date: getDate(),
        time: `${title.slice(8,10)}:${title.slice(10,12)}`,  // getTime(),
        deviceWithClientName:getDeviceClientName(clientId,status),
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
    if (isOpen === "Do you want to save the experiment data?") {
      navigate("/function-selection");
    }else if(isOpen === "Sensor disconnected Do you want to save the experiment data?"){
      navigate("/sensors")
    }
    setModal("");
  };
  // useEffect(() =>{
  //   if(graphData.length > 0 && graphData.length <= 1 && clientId !== status?.leaderSelected){
  //     setCheckForLog(graphData.length)
  //   }
  // },[graphData,clientId,status?.leaderSelected])

  const handleSensorDisconnected = (value:any) => {
    if(capturePoint.some((e:any) => e > 0) && !isSaved){
      setModal("Sensor disconnected Do you want to save the experiment data?")
    }else{
      setModal(value)
      navigate("/sensors")
    }
  }

  const handleSensorDisconnectedSaveData = () => {
    handleSave()
    setModal("")
    navigate("/sensors")
  }

  useEffect(() => {
    const getVoltageData = async () =>{
    if (
      status?.sensorConnected === "voltage" &&
      dataStream?.sensor && 
      dataStream?.sensor?.voltage !== null//&&
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
      if(status?.setupData?.dataRate !== "user"){
        setIsSaved(false);
      }
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
        setSensorDisconnectCheckForSave(true)
        if(connected)
        setModal("Voltage Sensor disconnected")
      }else if(!sensorDisconnectCheckForSave){
        if(connected)
        handleSensorDisconnected(null)
      }
      // if(connected)
      // setModal("Voltage Sensor disconnected")
    }else if(status?.sensorConnected === "voltage"){
      setModal("")
      setSensorDisconnectCheckForSave(false)
    }
  },[status?.sensorConnected,status?.operation,connected])

  useEffect(() => { // save data and go back only for member if leader change data setup and member is n measuring screen
    if(status?.setupData && JSON.stringify(status?.setupData) !== JSON.stringify(dataSetup) && clientId !== status?.leaderSelected){
      if(capturePoint?.some((el: number) => el > 0) && !isSaved){
        setModal("Do you want to save the experiment data?")
      }else navigate("/function-selection")
    }
  },[status?.setupData,dataSetup,clientId,status?.leaderSelected,capturePoint,isSaved,navigate])

  useEffect(() => { // set x axis of graph
    let rate:any = typeof status?.setupData?.dataRate === "number" ? Number(status?.setupData?.dataRate) : 1;
    let maxTime = labels?.length > 0 ? labels[labels?.length -1] : Number(rate * 9);
    if(graphData?.length === 0){
        let initialLabels = []
      for(let i=0;i<=(rate * 9);i=i+rate){
        initialLabels.push(Number(i))
      }
      if(JSON.stringify(initialLabels) !== JSON.stringify(labels))
      setLabels(initialLabels)
    }else if(graphData?.length > 0 && ((Number(graphData[graphData.length -1]?.time) / maxTime)*100) >= 80){
      let rate = typeof status?.setupData?.dataRate === "number" ? status?.setupData?.dataRate : 1;
      let initialLabels = [...labels]
      for(let i= maxTime + rate ;i<=(Number(Number(Number(graphData[graphData.length -1]?.time) * 1.3).toFixed(0)));i=i+rate){
        initialLabels.push(Number(i))
      }
      if(JSON.stringify(initialLabels) !== JSON.stringify(labels))
      setLabels(initialLabels)
    }
  },[status?.setupData?.dataRate,graphData,labels])

  useEffect(() => { // verify filename is exist or not in storage
    if(title && localStorage.getItem(`${VOLTAGE_DATA}_${title}`)){
      toastMessage.next("File name already exists!")
    }
  },[title])

  useEffect(() => { // to set focus for acessibility
    measuringVoltageRef?.current?.focus()
  },[])

  const extraStyle = { backgroundColor: "#989DA3", cursor: "not-allowed" };
  return (
    <>
      <Header
        checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
        handleSave={handleSave}
        shouldCloseModal = {isOpen === "Voltage Sensor disconnected" ? true : false}
      />
      <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ className={styles.TopWrapper}>
        <div className={styles.HeaderWrapper}>
        <h4 style={{ fontWeight: 500 }}><button aria-label="Measuring Voltage" style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={measuringVoltageRef} >Measuring Voltage</button></h4>
          <div> </div>
        </div>
        {graphData?.length ? <div className={styles.SecondaryHeaderWrapper}>
          <div aria-label="voltage value in volt">
            Voltage Value : <span style={{fontWeight:600}}>{graphData[graphData.length - 1]?.temp > 0 ? "+" : ""}{(graphData[graphData.length - 1]?.temp ? (graphData[graphData.length - 1]?.temp).toFixed(2) : "+0.00") + "V"}</span>
          </div>
        </div> : <div style={{height:36}}>{}</div>}
        <div className={styles.TextBody}>
          <div className={styles.GraphStyle}>
            {/* <AppexCharts 
              data={graphData}
              showPoint={status?.setupData?.dataRate === "user" ? false : true}
              capturePoint={capturePoint}
              title={"Voltage"}
              labels={labels}
            /> */}
            <TemperatureGraph
              data={graphData}
              showPoint={status?.setupData?.dataRate === "user" ? false : true}
              capturePoint={capturePoint}
              title={"Voltage"}
              labels={labels}
            />
          </div>
          {window.innerWidth > mobileWidth ? (
            <div className={styles.ButtonWrapper}>
              <button
                aria-label="start button"
                onClick={() =>
                  clientId === status?.leaderSelected && status?.sensorConnected === "voltage"
                    ? setModal(isStart ? "restart" : "start")
                    : {}
                }
                className={styles.RestartButton}
                style={
                  clientId !== status?.leaderSelected || status?.sensorConnected !== "voltage"
                    ? extraStyle
                    : {}
                }
              >
                {isStart ? "Restart" : "Start"}
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
                  style={capturePoint[capturePoint?.length - 1] <= 0 ? {} : extraStyle}
                  onClick={() => (capturePoint[capturePoint?.length - 1] <= 0 ? handleCapture() : {})}
                >
                  Capture
                </button>
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.FooterTextWrapper} style={window?.innerWidth >= 580 ? {marginTop:40}:{}}>
          <div className={styles.FooterInnerTextWrapper}>
            <div aria-label="file name text" style={{fontWeight:600}}>File Name</div>
            <div className={styles.FooterText}>
              {/* <div aria-label="file format T101722-1334-M4">T101722-1334-M4</div>
               */}
              <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} style={{outline:"none",border:"none"}} />
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
                  clientId === status?.leaderSelected && status?.sensorConnected === "voltage"
                    ? setModal(isStart ? "restart" : "start")
                    : {}
                }
                className={styles.RestartHorizontalButton}
                style={
                  clientId !== status?.leaderSelected || status?.sensorConnected !== "voltage"
                    ? extraStyle
                    : {}
                }
              >
                {isStart ? "Restart" : "Start"}
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
                style={capturePoint[capturePoint?.length - 1] <= 0 ? {} : extraStyle}
                onClick={() => (capturePoint[capturePoint?.length - 1] <= 0 ? handleCapture() : {})}
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
              : isOpen === "Do you want to save the experiment data?" ? 
              handleSubmitProcess
              : (isOpen === "Sensor disconnected Do you want to save the experiment data?" ? handleSensorDisconnectedSaveData : handleStop)
          }
          message={isOpen === "Do you want to save the experiment data?" ? isOpen : isOpen === "Sensor disconnected Do you want to save the experiment data?" ? "Do you want to save the experiment data?" : `Do you want to ${isOpen} the experiment?`}
          handleCancel = {handleCancelModal}
        />}
        {connected && isOpen === "Voltage Sensor disconnected" && <SensorDisconnectModal 
          isOpen={isOpen ? true : false}
          setModal={(value) => handleSensorDisconnected(value)}
          submitModal={() => handleSensorDisconnectedSaveData()}
          message= {clientId === status?.leaderSelected ? "Voltage sensor is disconnected, please connect the voltage sensor to start the experiment again." : "Voltage sensor is disconnected."}
          // checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
        />}
        {/* <RightArrow
          isSelected={capturePoint?.some((el: number) => el > 0) ? true : false}
          handleSubmit={handleSubmit}
        /> */}
      </div>
    </>
  );
};

export default MeasuringVoltage;
