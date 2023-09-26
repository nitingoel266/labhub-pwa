// import {WhiteWarningIcon} from "../../images/index";
import { useDeviceStatus } from "../../labhub/status";
import styles from "../../styles/temperatureSelectionModal.module.css";
import { useIsTouchDeviceDetect } from "../Constants";
import {
    ExpandIcon,
    CollapsedIcon,
  } from "../../images/index";
import { getClientId } from "../../labhub/utils";
import { useState } from "react";

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    handleTemp:(temp:number)=>void;
}

let temperatureTimmer: any;
const TempratureSettingModal = ({setModal,isOpen, handleTemp} : Props)=> {
    const isDeviceTouchable =  useIsTouchDeviceDetect();
    const [status] = useDeviceStatus();
    const clientId = getClientId();
    const [eventIs,setEventIs] = useState<any>(null);
    const [temp, setTemp] = useState(20)
    const [temperatureShouldBe, setTemperatureShouldBe] = useState<number>(0);
    

    const handleTemperature = (title: string) => {
        if (title === "sub" && temp > 20)
          setTemp((temperature) => (temperature > 20 ? temperature - 1 : temperature));
        if (title === "add" && temp < 150)
          setTemp((temperature) => (temperature < 150 ? temperature + 1 : temperature));
      };

    const handleMouseDownEvent = (event: string, title: string) => {
        if(eventIs !== event)
        setEventIs(event)
    
        
        if (title === "add" && event !== eventIs) {
          if (event === "enter") {
            console.log("enter");
            temperatureTimmer = setInterval(() => handleTemperature(title), 100);
            setTemperatureShouldBe(temp + 1);
          }
          if (event === "leave") {
            clearInterval(temperatureTimmer);
            if (temperatureShouldBe > temp) handleTemperature(title);
            setTemperatureShouldBe(0);
          }
        }
        if (title === "sub" && event !== eventIs) {
          if (event === "enter") {
            temperatureTimmer = setInterval(() => handleTemperature(title), 100);
            setTemperatureShouldBe(temp - 1);
          }
          if (event === "leave") {
            clearInterval(temperatureTimmer);
            if (temperatureShouldBe < temp) handleTemperature(title);
            setTemperatureShouldBe(0);
          }
        }
      };
      
    return (
        <div style={{position:"absolute",zIndex:100}}>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        onClick={() => setModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        }}
         role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
        >
            <div className={styles.TextContainer}>
                <div className={styles.Headertext}>
                    <h4>Set Point Temperature (°C)</h4>
                </div>
                <div className={styles.BodyWrapper}>
                    <div className={styles.Bodytext}>
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
            <div aria-label={"setpoint temperature is"+ temp} className={styles.TextStyle}>{temp}</div>
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
          </div>
                    </div>
                    <div className={styles.ButtonWrapper}>
                        <button onClick={() =>  setModal("")} className={styles.CancelButton}>Cancel</button>
                        <button onClick={()=>{
                            handleTemp(temp)
                            setModal("");
                            }} className={styles.YesButton}>Set</button>
                    </div>
                </div>
            </div>
        </div>
        </div>)
}

export default TempratureSettingModal