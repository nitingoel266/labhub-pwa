import {
  ExpandIcon,
  CollapsedIcon,
  // BlackIButtonIcon,
  HeaterIcon,
  HeaterAnimation,
} from "../../images/index";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/heaterElement.module.css";
import IButtonModal from "../../components/Modal/IButtonModal";
import RightArrow from "../../components/RightArrow";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import { useDeviceStatus, useDeviceDataFeed, useDeviceConnected } from "../../labhub/status";
import {
  changeSetpointTemp,
  startHeaterExperiment,
  stopHeaterExperiment,
} from "../../labhub/actions";
import { getClientId } from "../../labhub/utils";
import IButtonComponent from "../../components/IButtonComponent";
import {
  mobileWidth,
  SETPOINT_TEMPERATURE,
  getDescription,
  useIsTouchDeviceDetect,
  getTitle,
  toastMessage,
  validateFileName,
  getStorageKeys,
  getDate,
  getDeviceClientName,
  usePrevHeaterElementValue,
  useCurrentHeaterElementValue,
} from "../../components/Constants";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import SensorDisconnectModal from "../../components/Modal/SensorDisconnectModal";
import AppexCharts from "../../components/Graphs/AppexChart";
import { TEMPERATURE_DATA } from "../../utils/const";
import HighChart from "../../components/Graphs/HighChart";


let temperatureTimmer: any;
const HeaterElement = () => {
  const clientId = getClientId();
  const navigate = useNavigate();
  const [status] = useDeviceStatus();
  const [connected] = useDeviceConnected();
  const isDeviceTouchable =  useIsTouchDeviceDetect();
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [dataStream] = useDeviceDataFeed();

  const [heaterElementPrevTemp] = usePrevHeaterElementValue()
  const [heaterElementCurrentTemp] = useCurrentHeaterElementValue()

  const [isOpen, setModal] = useState("");
  const [isStart, setIsStart] = useState<boolean>(false);
  const [eventIs,setEventIs] = useState<any>(null);
  const [temperature, setTemperature] = useState<number>(20); //20-150
  const [temperatureShouldBe, setTemperatureShouldBe] = useState<number>(0);
  const [power, setPower] = useState<number>(0);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [capturePoint, setCapturePoint] = useState<any>([]);
  const [title,setTitle] = useState<any>(getTitle("HE", clientId,status));
  const [graphData, setGraphData] = useState<any>([]); // {time:in sec,temp,power,setPoint}
  const [maxTempValue,setMaxTempValue] = useState<number>(50)
  const [labels,setLabels] = useState<any>([]);

  const [sensorDisconnectCheckForSave , setSensorDisconnectCheckForSave] = useState<boolean>(false);



  const setPointTempRef:any = useRef(null);

  const handleTemperature = (title: string) => {
    if (title === "sub" && temperature > 20)
      setTemperature((temp) => (temp > 20 ? temp - 1 : temp));
    if (title === "add" && temperature < 150)
      setTemperature((temp) => (temp < 150 ? temp + 1 : temp));
  };
  const handleStart = () => {
    // setIsStart(true);
    startHeaterExperiment();

    setGraphData([]);
    setCapturePoint([]);
    // if(isOpen === "restart"){
    //   restartSensorExperiment()
    // }else
    // startSensorExperiment();
    setIsSaved(false);
    setModal("");
  };
  const handleStop = () => {
    // setIsStart(false);
    setModal("");
    stopHeaterExperiment();
  };

  const handleSubmit = () => {
    changeSetpointTemp(temperature);
  };
  const handleMouseDownEvent = (event: string, title: string) => {
    if(eventIs !== event)
    setEventIs(event)

    if (title === "add" && event !== eventIs) {
      if (event === "enter") {
        temperatureTimmer = setInterval(() => handleTemperature(title), 100);
        setTemperatureShouldBe(temperature + 1);
      }
      if (event === "leave") {
        clearInterval(temperatureTimmer);
        if (temperatureShouldBe > temperature) handleTemperature(title);
        setTemperatureShouldBe(0);
      }
    }
    if (title === "sub" && event !== eventIs) {
      if (event === "enter") {
        temperatureTimmer = setInterval(() => handleTemperature(title), 100);
        setTemperatureShouldBe(temperature - 1);
      }
      if (event === "leave") {
        clearInterval(temperatureTimmer);
        if (temperatureShouldBe < temperature) handleTemperature(title);
        setTemperatureShouldBe(0);
      }
    }
  };
  // const handleIModal = (title: string) => {
  //   if (isOpen === title) setModal("");
  //   else setModal(title);
  // };

  const handleCancelModal = () => {
    if(isOpen === "Heater disconnected Do you want to save the experiment data?"){
      navigate("/heater")
    }
    setModal("")
  }

  const handleSensorDisconnected = (value:any) => {
    if(capturePoint.some((e:any) => e > 0) && !isSaved){
      setModal("Heater disconnected Do you want to save the experiment data?")
    }else{
      setModal(value)
      navigate("/heater")
    }
  }

  const handleSensorDisconnectedSaveData = () => {
    handleSave()
    setModal("")
    navigate("/heater")
  }

  useEffect(() => {
    if (dataStream?.heater?.element) {
      // if (!isStart) setIsStart(true);
      setPower(dataStream.heater.element[0]);
    }
    // if (dataStream?.heater === null) {
    //   setIsStart(false);
    // }
  }, [isStart, dataStream?.heater, dataStream?.heater?.element]);

  useEffect(() => {
    if (status?.setpointTemp) {
      setTemperature(status?.setpointTemp);
    }
  }, [status?.setpointTemp]);

  useEffect(() => {
    if (status?.operation !== "heater_control" || !status?.heaterConnected ) {
      setIsStart(false);
    } else if (status?.operation === "heater_control" && !isStart) {
      setIsStart(true);
    }
  }, [status?.operation,status?.heaterConnected, isStart]);

  useEffect(() => { // stop element experiment and show a modal that sensor disconnected and for go back
    if(!status?.heaterConnected){
      if(status?.operation === "heater_control"){
        // setIsStart(false);
        stopHeaterExperiment();
        setSensorDisconnectCheckForSave(true)
        if(connected)
        setModal("Heater Element disconnected")
        // setModal("Temperature Sensor disconnected")
      }else if(!sensorDisconnectCheckForSave){
        if(connected)
        handleSensorDisconnected(null)
      }
    }else if(status?.heaterConnected){
      setModal("")
      setSensorDisconnectCheckForSave(false)
    }
  },[status?.heaterConnected,status?.operation,connected])


  useEffect(() => { // to set focus for acessibility
    setPointTempRef?.current?.focus()
  },[])

  //related to graph changes

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
        // let fileName = "T" + getFileName();
        // if (clientId === status?.leaderSelected) {
        // // for leader
        // fileName += "L";
        // } else if (clientId) {
        // fileName +=
        //     "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        // }
        let fileName = title;
        let verifiedFileName = validateFileName(
        getStorageKeys(TEMPERATURE_DATA),
        fileName
        );
        let resultData = {
        name: verifiedFileName,
        date: getDate(),
        time: `${title.slice(9,11)}:${title.slice(11,13)}`, //getTime(),
        deviceWithClientName:getDeviceClientName(clientId,status),
        storedBy:"Heater Element",
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

  useEffect(() => { // graph data
    const getTemperatureData = async () =>{
    if (
      status?.heaterConnected &&
      dataStream?.heater?.element &&
      dataStream?.heater?.element?.length > 0 &&
      dataStream?.heater?.element[1] !== null &&
      status?.operation === "heater_control"
    ) {
      if(clientId !== status?.leaderSelected && heaterElementPrevTemp === -1 && heaterElementCurrentTemp !== -1){
        setGraphData([]);
        setCapturePoint([]);
      }
      // setGraphData((prevData: any) => {
      //   return [
      //     ...prevData,
      //     {
      //       time:
      //         prevData.length *
      //         Number(
      //           status?.setupData?.dataRate === "user"
      //             ? 1
      //             : status?.setupData?.dataRate
      //         ),
      //       temp: dataStream?.sensor?.temperature,
      //     },
      //   ];
      // });
      setGraphData((prevData: any) => {
        return [
          ...prevData,
          {
            time:
              prevData.length *
              Number(1),
            temp: dataStream?.heater?.element && dataStream?.heater?.element[1],
            power:dataStream?.heater?.element && dataStream?.heater?.element[0],
            setPoint:status?.setpointTemp
          },
        ];
      });
      // setCapturePoint((prevData: any) => [
      //   ...prevData,
      //   status?.setupData?.dataRate === "user" ? 0 : 2,
      // ]);
      setCapturePoint((prevData: any) => [
        ...prevData,
        2,
      ]);
      // if(status?.setupData?.dataRate !== "user"){
      //   setIsSaved(false);
      // }
      setIsSaved(false);
    } 
  }
  getTemperatureData()
  }, [
    dataStream?.heater?.element,
    status?.heaterConnected,
  ]);

  // console.log(">>>>> status in heater",status?.heaterConnected,status?.operation,connected)

  useEffect(() => { // set y axis for the graph
    let maxTempFromGraph = 0
    for(let one of graphData){
      if(Number(one.temp) > maxTempFromGraph) maxTempFromGraph = Number(one.temp)
    }
    if(graphData?.length > 0 && ((Number(maxTempFromGraph) / maxTempValue)*100) >= 80){
      let customMaxTempValue = Number(Number(maxTempValue * 1.3).toFixed(0));
      if(customMaxTempValue !== maxTempValue)
      setMaxTempValue(customMaxTempValue);
    }else if(graphData?.length === 0 || graphData?.length === 1) setMaxTempValue(50)
  },[graphData,maxTempValue])
  
  useEffect(() => { // set x axis of graph
    // let rate = typeof status?.setupData?.dataRate === "number" ? Number(status?.setupData?.dataRate) : 1;
    let rate = 1;

    let maxTime:any = labels?.length > 0 ? labels[labels?.length -1] : Number(rate * 9);
    if(graphData?.length === 0 || graphData?.length === 1){
        let initialLabels = []
      for(let i=0;i<=(rate * 9);i=i+rate){
        initialLabels.push(Number(i))
      }
      if(JSON.stringify(initialLabels) !== JSON.stringify(labels))
      setLabels(initialLabels)
    }else if(graphData?.length > 0 && ((Number(graphData[graphData.length -1]?.time) / maxTime)*100) >= 80){
      // let rate = typeof status?.setupData?.dataRate === "number" ? status?.setupData?.dataRate : 1;
      let rate = 1;
      let initialLabels = [...labels]
      for(let i= maxTime + rate ;i<=(Number(Number(Number(graphData[graphData.length -1]?.time) * 1.3).toFixed(0)));i=i+rate){
        initialLabels.push(Number(i))
      }
      if(JSON.stringify(initialLabels) !== JSON.stringify(labels))
      setLabels(initialLabels)
    }
  },[graphData,labels])

  useEffect(() => { // verify filename is exist or not in storage
    if(title && localStorage.getItem(`${TEMPERATURE_DATA}_${title}`)){
      toastMessage.next("File name already exists!")
    }
  },[title])


  // console.log(">>>>>> status in heater  ",status,dataStream)
  // const extraStyle = // prev
  //   clientId !== status?.leaderSelected
  //     ? { backgroundColor: "#989DA3", cursor: "not-allowed" }
  //     : {};
      const extraStyle = { backgroundColor: "#989DA3", cursor: "not-allowed" };
  
  return (
    <>
     <Header 
      checkForSave={capturePoint.some((e:any) => e > 0) && !isSaved ? true : false}
      handleSave={handleSave}
      setPointTemp={temperature} 
      shouldCloseModal = {isOpen === "Heater Element disconnected" ? true : false}
      />
    <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ style={{ position: "relative" }}>
      <div className={styles.HeaderTextWrapper}>
        <div style={{display:"flex",flexDirection:"row"}}>
          <h4><button aria-label="Set Point Temperature degree C" style={{outline:"none",border:"none",fontSize:16,fontWeight:550,marginBottom:10}} ref={setPointTempRef} >Set Point Temperature (°C)</button></h4>
        </div>
        <div className={styles.RateMeasureRightSide}>
          <div className={styles.DataMeasureButtom}>
            <button
                aria-label="setpoint temperature decrease button"
                className={styles.ArrowButtonContainer}

                onMouseDown={() =>
                  clientId === status?.leaderSelected && !isDeviceTouchable
                    ? handleMouseDownEvent("enter", "sub")
                    : {}
                }
                onMouseUp={() =>
                  clientId === status?.leaderSelected && !isDeviceTouchable
                    ? handleMouseDownEvent("leave", "sub")
                    : {}
                }
                
                onKeyDown={(e:any) => 
                  clientId === status?.leaderSelected && (e.key === "Enter" || e.key === " ") && !isDeviceTouchable
                    ? handleMouseDownEvent("enter", "sub")
                    : {}
                }
                onKeyUp={(e:any) =>
                  clientId === status?.leaderSelected && (e.key === "Enter" || e.key === " ") && !isDeviceTouchable
                    ? handleMouseDownEvent("leave", "sub")
                    : {}
                }

                onTouchStart={
                  () =>
                  clientId === status?.leaderSelected && isDeviceTouchable
                    ? handleMouseDownEvent("enter", "sub")
                    : {}
                }
                onPointerOut={
                  () =>
                  clientId === status?.leaderSelected && isDeviceTouchable
                    ? handleMouseDownEvent("leave", "sub")
                    : {}
                }
            >
            <img
              src={ExpandIcon}
              alt="subtract"
            />
            </button>
            <div aria-label={"setpoint temperature is"+ temperature} className={styles.TextStyle}>{temperature}</div>
            <button
              aria-label="setpoint temperature increase button"
                className={styles.ArrowButtonContainer}

                onMouseDown={() =>
                  clientId === status?.leaderSelected && !isDeviceTouchable
                    ? handleMouseDownEvent("enter", "add")
                    : {}
                }
                onMouseUp={() =>
                  clientId === status?.leaderSelected && !isDeviceTouchable
                    ? handleMouseDownEvent("leave", "add")
                    : {}
                }

                onKeyDown={(e:any) => 
                  clientId === status?.leaderSelected && (e.key === "Enter" || e.key === " ") && !isDeviceTouchable
                    ? handleMouseDownEvent("enter", "add")
                    : {}
                }
                onKeyUp={(e:any) =>
                  clientId === status?.leaderSelected && (e.key === "Enter" || e.key === " ") && !isDeviceTouchable
                    ? handleMouseDownEvent("leave", "add")
                    : {}
                }

                onTouchStart={
                  () =>
                  clientId === status?.leaderSelected && isDeviceTouchable
                    ? handleMouseDownEvent("enter", "add")
                    : {}
                }
                onPointerOut={
                  () =>
                  clientId === status?.leaderSelected && isDeviceTouchable
                    ? handleMouseDownEvent("leave", "add")
                    : {}
                }
            >
            <img
              src={CollapsedIcon}
              alt="add"
            />
            </button>
          </div>
          {/* <button
            aria-label="i button"
            style={{border:"none",outline:"none"}}
            onClick={() => handleIModal(SETPOINT_TEMPERATURE)}
          >
          <img
            src={BlackIButtonIcon}
            className={styles.IButton}
            alt="i icon"
          />
            </button> */}
        </div>
      </div>
      {isOpen === SETPOINT_TEMPERATURE && isMobile && (
        <IButtonComponent
          title={SETPOINT_TEMPERATURE}
          description={getDescription(SETPOINT_TEMPERATURE)}
          marginTop={10}
        />
      )}

      <div className={styles.HeaderTextWrapper}>
        <div aria-label="control method sub header">Control Method</div>
        <div aria-label="heater element sub header">Heater Element</div>
      </div>
      <div className={styles.HeaterElementWraper}>
        <div className={styles.HeaterElementSubWraper}>
          <div aria-label="heater element image" style={{ height: 120 }}>
            <img
              src={isStart ? HeaterAnimation : HeaterIcon}
              className={styles.HeaterEelementImage}
              style={isStart ? { height: 148 } : { height: 120,marginTop:14 }}
              alt="heater element"
            />
          </div>
          {/* <div className={styles.ButtonWrapper}>
            <button
              aria-label="start button"
              onClick={() =>
                clientId === status?.leaderSelected &&
                status?.heaterConnected &&
                !isStart
                  ? setModal("start")
                  : {}
              }
              className={styles.Button}
              style={
                isStart || !status?.heaterConnected
                  ? { backgroundColor: "#989DA3", cursor: "not-allowed" }
                  : extraStyle
              }
            >
              Start
            </button>
            <button
              aria-label="stop button"
              onClick={() =>
                clientId === status?.leaderSelected && isStart
                  ? setModal("stop")
                  : {}
              }
              className={styles.Button}
              style={
                !isStart
                  ? { backgroundColor: "#989DA3", cursor: "not-allowed" }
                  : extraStyle
              }
            >
              Stop
            </button>
          </div> */}
        </div>
        <div aria-label="Power in watt" className={styles.HeaterElementText} style={{visibility:status?.operation === "heater_control" ? "visible" : "hidden"}}>
          Power Value: <span style={{ color: "#DC2828" }}>{power && Number(power).toFixed(0)} W</span>
        </div>
      </div>

      <div className={styles.TextBody}>
          <div className={styles.GraphStyle}>
          <HighChart 
            data={graphData}
            capturePoint={capturePoint}
            showPoint={status?.setupData?.dataRate === "user" ? false : true}
            title={"Temperature"}
            maxTempValue ={maxTempValue}
            dataRate = {status?.setupData?.dataRate === "user" ? 1 : status?.setupData?.dataRate}
            />
          {/* <AppexCharts 
              data={graphData}
              showPoint={true}
              capturePoint={capturePoint}
              title={"Temperature "}
              // temperatureUnit = {tempratureUnit}
              maxTempValue ={maxTempValue}
              labels= {labels}
              isRunning = {false} // {status?.operation === "measure_temperature" ? true : false}
          /> */}
            {/* <TemperatureGraph
              data={graphData}
              showPoint={status?.setupData?.dataRate === "user" ? false : true}
              capturePoint={capturePoint}
              title={"Temperature"}
              temperatureUnit = {tempratureUnit}
              maxTempValue ={maxTempValue}
              labels={labels}
            /> */}
          </div>
          {window.innerWidth > mobileWidth ? (
            <div className={styles.ButtonForGraphWrapper}>
              <button
                aria-label="Start button"
                onClick={() =>
                  clientId === status?.leaderSelected && status?.heaterConnected && !isStart
                    ? setModal(isStart ? "restart" : "start")
                    : {}
                }
                className={styles.RestartButton}
                style={
                  
                   clientId !== status?.leaderSelected || !status?.heaterConnected || isStart
                    ? extraStyle
                    : {}
                }
              >
                {/* {isStart ? "Restart" : "Start"} */}{"Start"}
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
            </div>
          ) : null}
        </div>
        <div className={styles.FooterTextWrapper} style={window.innerWidth <= mobileWidth ? {} : {marginBottom:40}}>
          <div className={styles.FooterInnerTextWrapper}>
            <div aria-label="File name sub header" style={{fontWeight:600}}>File Name</div>
            <div className={styles.FooterText}>
              <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} style={{outline:"none",border:"none"}} />
              {/* <div aria-label="file format T101722-1334-M4">T101722-1334-M4</div> */}
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
            <div className={styles.ButtonHorizontalInnerWrapper} /* style={status?.setupData?.dataRate !== "user" ? {justifyContent:"center"} : {}} */ >
              <button
                aria-label="Start button"
                onClick={() =>
                  clientId === status?.leaderSelected && status?.heaterConnected && !isStart
                    ? setModal(isStart ? "restart" : "start")
                    : {}
                }
                className={styles.RestartHorizontalButton}
                style={
                  clientId !== status?.leaderSelected || !status?.heaterConnected || isStart
                    ? extraStyle
                    : {}
                }
              >
                {/* {isStart ? "Restart" : "Start"} */} {"Start"}
              </button>
              <button
                aria-label="stop button"
                onClick={() =>
                  clientId === status?.leaderSelected && isStart
                    ? setModal("stop")
                    : {}
                }
                className={styles.StopHorizontalButton}
                // style={
                //   !isStart || clientId !== status?.leaderSelected
                //     ? {...extraStyle,...(status?.setupData?.dataRate !== "user" ? {marginLeft:20} : {})}
                //     : {...(status?.setupData?.dataRate !== "user" ? {marginLeft:20} : {})}
                // }
                style={
                  !isStart || clientId !== status?.leaderSelected
                    ? extraStyle
                    : {}
                }
              >
                Stop
              </button>
            </div>
          </div>
        ) : null}

      {isOpen !== "Heater Element disconnected" && isOpen && <MemberDisconnect
        isOpen={isOpen !== SETPOINT_TEMPERATURE ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={isOpen === "start" ? handleStart : (isOpen === "Heater disconnected Do you want to save the experiment data?" ? handleSensorDisconnectedSaveData : handleStop)}
        message={isOpen === "Heater disconnected Do you want to save the experiment data?" ? "Do you want to save the experiment data?" : `Do you want to ${isOpen} the experiment.`}
        handleCancel = {handleCancelModal}
      />}
      {isOpen === "Heater Element disconnected" && <SensorDisconnectModal 
          isOpen={isOpen ? true : false}
          setModal={(value) => handleSensorDisconnected(value)}
          message= {clientId === status?.leaderSelected ? "Heater is disconnected, please connect the heater to start the experiment again." : "Heater is disconnected."}
      />}
      <RightArrow
        isSelected={
          clientId === status?.leaderSelected &&
          temperature !== status?.setpointTemp
            ? true
            : false
        }
        handleSubmit={handleSubmit}
      />
      {!isMobile && isOpen && (
        <IButtonModal
          isOpen={isOpen === SETPOINT_TEMPERATURE ? true : false}
          title={isOpen}
          description={getDescription(isOpen)}
          setModal={(value) => setModal(value)}
        />
      )}
    </div>
    </>
  );
};

export default HeaterElement;
