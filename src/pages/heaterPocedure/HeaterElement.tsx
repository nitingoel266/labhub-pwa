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
import { useDeviceStatus, useDeviceDataFeed } from "../../labhub/status";
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
  useIsTouchDeviceDetect
} from "../../components/Constants";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import SensorDisconnectModal from "../../components/Modal/SensorDisconnectModal";

let temperatureTimmer: any;
const HeaterElement = () => {
  const clientId = getClientId();
  const navigate = useNavigate();
  const [status] = useDeviceStatus();
  const isDeviceTouchable =  useIsTouchDeviceDetect();
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [dataStream] = useDeviceDataFeed();
  const [isOpen, setModal] = useState("");
  const [isStart, setIsStart] = useState<boolean>(false);
  const [eventIs,setEventIs] = useState<any>(null);
  const [temperature, setTemperature] = useState<number>(25); //20-150
  const [temperatureShouldBe, setTemperatureShouldBe] = useState<number>(0);
  const [power, setPower] = useState<number>(0);

  const setPointTempRef:any = useRef(null);

  const handleTemperature = (title: string) => {
    if (title === "sub" && temperature > 25)
      setTemperature((temp) => (temp > 25 ? temp - 1 : temp));
    if (title === "add" && temperature < 150)
      setTemperature((temp) => (temp < 150 ? temp + 1 : temp));
  };
  const handleStart = () => {
    setIsStart(true);
    startHeaterExperiment();
    setModal("");
  };
  const handleStop = () => {
    setIsStart(false);
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

  const handleSensorDisconnected = (value:any) => {
    setModal(value)
    navigate("/heater")
  }

  useEffect(() => {
    if (dataStream?.heater?.element) {
      if (!isStart) setIsStart(true);
      setPower(dataStream.heater.element[0]);
    }
    if (dataStream?.heater === null) {
      setIsStart(false);
    }
  }, [isStart, dataStream?.heater, dataStream?.heater?.element]);

  useEffect(() => {
    if (status?.setpointTemp) {
      setTemperature(status?.setpointTemp);
    }
  }, [status?.setpointTemp]);

  useEffect(() => { // stop element experiment and show a modal that sensor disconnected and for go back
    if(!status?.heaterConnected){
      if(status?.operation === "heater_control"){
        setIsStart(false);
        stopHeaterExperiment();
      }
      setModal("Heater Element disconnected")
    }else if(status?.heaterConnected){
      setModal("")
    }
  },[status?.heaterConnected,status?.operation])

  useEffect(() => { // to set focus for acessibility
    setPointTempRef?.current?.focus()
  },[])

  const extraStyle =
    clientId !== status?.leaderSelected
      ? { backgroundColor: "#989DA3", cursor: "not-allowed" }
      : {};
  return (
    <>
     <Header 
      setPointTemp={temperature} 
      shouldCloseModal = {isOpen === "Heater Element disconnected" ? true : false}
      />
    <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ style={{ position: "relative" }}>
      <div className={styles.HeaderTextWrapper}>
        <div style={{display:"flex",flexDirection:"row"}}>
          <h4><button aria-label="Set Point Temperature degree C" style={{outline:"none",border:"none",fontSize:16,fontWeight:550,marginBottom:10}} ref={setPointTempRef} >Set Point Temperature</button>(</h4>
          <h4
           className={styles.TempratureDegreeIcon}  
           style={{
                  border: `1px solid #000000`,
                }}>{" "}</h4>
          <h4>C)</h4>
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
        <div aria-label="heater element sub header">HEATER ELEMENT</div>
      </div>
      <div className={styles.HeaterElementWraper}>
        <div className={styles.HeaterElementSubWraper}>
          <div aria-label="heater element image" style={{ height: 180 }}>
            <img
              src={isStart ? HeaterAnimation : HeaterIcon}
              className={styles.HeaterEelementImage}
              style={isStart ? { height: 200, width: 220 } : { height: 180 }}
              alt="heater element"
            />
          </div>
          <div className={styles.ButtonWrapper}>
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
          </div>
        </div>
        <div aria-label="Power in watt" className={styles.HeaterElementText} style={{visibility:status?.operation === "heater_control" ? "visible" : "hidden"}}>
          Power Value: <span style={{ color: "#DC2828" }}>{power && Number(power).toFixed(0)} W</span>
        </div>
      </div>
      {isOpen !== "Heater Element disconnected" && isOpen && <MemberDisconnect
        isOpen={isOpen !== SETPOINT_TEMPERATURE ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={isOpen === "start" ? handleStart : handleStop}
        message={`Do you want to ${isOpen} the experiment.`}
      />}
      {isOpen === "Heater Element disconnected" && <SensorDisconnectModal 
          isOpen={isOpen ? true : false}
          setModal={(value) => handleSensorDisconnected(value)}
          message= {clientId === status?.leaderSelected ? "Heater is disconnected, please connect the heater to start the experiment again." : "Heater is disconnected!"}
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
