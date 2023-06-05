import styles from "../../styles/temperatureProbe.module.css";
import {
  ExpandIcon,
  CollapsedIcon,
  // BlackIButtonIcon,
  HeaterIcon,
  HeaterAnimation,
} from "../../images/index";
import { useEffect, useState } from "react";
import IButtonModal from "../../components/Modal/IButtonModal";
import RightArrow from "../../components/RightArrow";
import { useDeviceStatus, useDeviceDataFeed } from "../../labhub/status";
import {
  changeSetpointTemp,
  startHeaterExperiment,
  stopHeaterExperiment,
} from "../../labhub/actions";
import { getClientId } from "../../labhub/utils";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import {
  mobileWidth,
  SETPOINT_TEMPERATURE,
  getDescription,
  useIsTouchDeviceDetect,
} from "../../components/Constants";
import IButtonComponent from "../../components/IButtonComponent";
import Header from "../../components/header";
import SensorDisconnectModal from "../../components/Modal/SensorDisconnectModal";
import { useNavigate } from "react-router-dom";

let temperatureTimmer: any;
const TemperatureProbe = () => {
  const clientId = getClientId();
  const navigate = useNavigate();
  const [status] = useDeviceStatus();
  const isDeviceTouchable = useIsTouchDeviceDetect();
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [dataStream] = useDeviceDataFeed();
  const [isOpen, setModal] = useState("");
  const [isStart, setIsStart] = useState<boolean>(false);
  const [eventIs,setEventIs] = useState<any>(null);
  const [temperature, setTemperature] = useState<number>(25);
  const [temperatureShouldBe, setTemperatureShouldBe] = useState<number>(0);
  const [power, setPower] = useState<number>(0);
  const [istemperature, setisTemperature] = useState<number>(0);

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

    if (title === "add"  && event !== eventIs) {
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
    if (title === "sub"  && event !== eventIs) {
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
    if (dataStream?.heater?.probe) {
      if (!isStart) setIsStart(true);
      setPower(dataStream.heater.probe[0]);
      setisTemperature(dataStream.heater.probe[1]);
    }
    if (dataStream?.heater === null) {
      setIsStart(false);
    }
  }, [isStart, dataStream?.heater, dataStream?.heater?.probe]);

  useEffect(() => {
    if (status?.setpointTemp) {
      setTemperature(status?.setpointTemp);
    }
  }, [status?.setpointTemp]);

  useEffect(() => { // stop probe experiment and show a modal that sensor disconnected and for go back
    if(status?.heaterConnected !== "probe"){
      if(status?.operation === 'heater_probe'){
        setIsStart(false);
        stopHeaterExperiment();
      }
      setModal("Temperature probe disconnected")
    }else if(status?.heaterConnected === "probe"){
      setModal("")
    }
  },[status?.heaterConnected,status?.operation])



  const extraStyle =
    clientId !== status?.leaderSelected
      ? { backgroundColor: "#989DA3", cursor: "not-allowed" }
      : {};
  return (
    <>
    <Header 
      setPointTemp={temperature} 
      shouldCloseModal = {isOpen === "Temperature probe disconnected" ? true : false}
      />
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" style={{ position: "relative" }}>
      <div className={styles.HeaderTextWrapper}>
        <div style={{display:"flex",flexDirection:"row"}}>
          <h4 aria-label={SETPOINT_TEMPERATURE + " header"}>{SETPOINT_TEMPERATURE} (</h4>
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
            <div aria-label={"setpoint temperature is "+temperature} className={styles.TextStyle}>{temperature}</div>
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
        <div aria-label="temperature probe sub header">TEMPRATURE PROBE</div>
      </div>
      <div aria-label="Please make sure the probe is always in contact with the soution text" className={styles.HeaderSubTextWrapper}>
        Please make sure the probe is always in contact with the soution.
      </div>
      <div className={styles.HeaterElementWraper}>
        <div aria-label={"temperatue is "+istemperature && Number(istemperature).toFixed(1)+"degree celcius"} className={styles.TemperatureWrapper}>
          <div>{istemperature && Number(istemperature).toFixed(0)}</div>
          <div className={styles.TemperatureDegree}> </div>
          <div>C</div>
        </div>
        <div className={styles.HeaterElementSubWraper}>
          <div aria-label="temperatuee probe image" style={{ height: 180 }}>
            <img
              src={isStart ? HeaterAnimation : HeaterIcon}
              className={styles.HeaterEelementImage}
              style={isStart ? { height: 200, width: 220 } : { height: 180 }}
              alt="temperaure probe icon"
            />
          </div>
          <div className={styles.ButtonWrapper}>
            <button
              aria-label="start button"
              onClick={() =>
                clientId === status?.leaderSelected &&
                status?.heaterConnected === "probe" &&
                !isStart
                  ? setModal("start")
                  : {}
              }
              className={styles.Button}
              style={
                isStart || status?.heaterConnected !== "probe"
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
        <div aria-label={"power is"+power && Number(power).toFixed(2)+"watt"} className={styles.HeaterElementText}>
          Power: <span style={{ color: "#DC2828" }}>{power && Number(power).toFixed(0)} W</span>
        </div>
      </div>
      {isOpen !== "Temperature probe disconnected" && isOpen && <MemberDisconnect
        isOpen={isOpen !== SETPOINT_TEMPERATURE ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={isOpen === "start" ? handleStart : handleStop}
        message={`Do you want to ${isOpen} the experiment.`}
      />}
     {isOpen === "Temperature probe disconnected" && <SensorDisconnectModal 
          isOpen={isOpen ? true : false}
          setModal={(value) => handleSensorDisconnected(value)}
          message="Please connect temperature probe to proceed."
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

export default TemperatureProbe;
