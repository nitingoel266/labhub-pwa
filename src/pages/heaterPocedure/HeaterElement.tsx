import {ExpandIcon,CollapsedIcon,BlackIButtonIcon,HeaterIcon} from "../../images/index"
import { useState } from 'react';
import styles from '../../styles/heaterElement.module.css';
import IButtonModal from "../../components/Modal/IButtonModal";
import RightArrow from "../../components/RightArrow";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import {useDeviceStatus} from "../../labhub/status";
import { useNavigate } from "react-router-dom";
import IButtonContent from "../../components/IButtonContent";

let temperatureTimmer:any;
const HeaterElement = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("");
    const [temperature,setTemperature] =useState<number>(0);
    const [temperatureShouldBe,setTemperatureShouldBe] =useState<number>(0);

    const handleTemperature = (title:string) => {
        if(title === 'sub' && temperature > 0)
        setTemperature((temp) => temp > 0 ? temp - 1 : temp)
        if(title === 'add' && temperature < 100)
        setTemperature((temp) => temp <100 ? temp + 1 : temp)
    }
    const handleStart = () => {

    }
    const handleStop = () => {
        navigate(-1)
    }
    const handleSubmit = () => {

    }
    const handleMouseDownEvent = (event:string,title:string) => {
        if(title === 'add'){
            if(event === 'enter'){
                temperatureTimmer = setInterval(() =>handleTemperature(title),100)
                setTemperatureShouldBe(temperature +1)
            }
             if(event === 'leave'){
                 clearInterval(temperatureTimmer)
                if(temperatureShouldBe > temperature) handleTemperature(title)
                setTemperatureShouldBe(0)
             }
        }
        if(title === 'sub'){
            if(event === 'enter'){
                temperatureTimmer = setInterval(() => handleTemperature(title),100)
                setTemperatureShouldBe(temperature - 1)
            }
             if(event === 'leave'){
                 clearInterval(temperatureTimmer)
                 if(temperatureShouldBe < temperature) handleTemperature(title)
                setTemperatureShouldBe(0)
             }
        }
    }
    const extraStyle = clientId !== status?.leaderSelected ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : {}
    return <div style={{position:"relative"}}>
             <div className={styles.HeaderTextWrapper}>
            <div>Setpoint Temperature</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img onMouseDown={() => handleMouseDownEvent('enter','sub')} onMouseUp={() => handleMouseDownEvent('leave','sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{temperature}</div>
                    <img onMouseDown={() => handleMouseDownEvent('enter','add')} onMouseUp={() => handleMouseDownEvent('leave','add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => setModal("Setpoint Temperature")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <div className={styles.HeaderTextWrapper}>
            <div>Control Method</div>
            <div>HEATER ELEMENT</div>
        </div>
        <div className={styles.HeaterElementWraper}>
            <img src={HeaterIcon} className={styles.HeaterEelementImage} alt="heater element"/>
            <div className={styles.HeaterElementText}>Power: <span style={{color:"#DC2828"}}>0 W</span></div>
        </div>
        <div className={styles.ButtonWrapper}>
            <div onClick={() => clientId === status?.leaderSelected ? setModal('start') : {}} className={styles.Button} style={extraStyle}>Start</div>
            <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.Button} style={extraStyle}>Stop</div>
        </div>
        <MemberDisconnect isOpen={isOpen && isOpen !== "Setpoint Temperature" ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'start' ? handleStart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={temperature ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen === "Setpoint Temperature" ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>

    </div>
}

export default HeaterElement