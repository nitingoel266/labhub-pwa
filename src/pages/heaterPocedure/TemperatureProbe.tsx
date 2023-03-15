
import styles from '../../styles/temperatureProbe.module.css';
import {ExpandIcon,CollapsedIcon,BlackIButtonIcon,HeaterIcon} from "../../images/index"
import { useRef, useState } from 'react';
import IButtonModal from "../../components/Modal/IButtonModal";
import RightArrow from "../../components/RightArrow";
import {useDeviceStatus} from "../../labhub/status";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import { useNavigate } from "react-router-dom";
import IButtonContent from '../../components/IButtonContent';

let temperatureTimmer:any;
const TemperatureProbe = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const setpointTemperatureRef = useRef<any>()
    const [isOpen,setModal] = useState("");
    const [iModalPostion,setIModalPosition] = useState<any>({})
    const [temperature,setTemperature] =useState<number>(25);
    const [temperatureShouldBe,setTemperatureShouldBe] =useState<number>(0);

    const handleTemperature = (title:string) => {
        if(title === 'sub' && temperature > 25)
        setTemperature((temp) => temp > 25 ? temp - 1 : temp)
        if(title === 'add' && temperature < 150)
        setTemperature((temp) => temp <150 ? temp + 1 : temp)
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
    const handleIModal = (title:string) => {
        const getRef:any = {
            'Setpoint Temperature':setpointTemperatureRef,
        }
        setModal(title)
        setIModalPosition({left:getRef[title] && getRef[title].current?.offsetLeft , top:getRef[title] && getRef[title].current?.offsetTop -65})
    }
    const extraStyle = clientId !== status?.leaderSelected ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : {}
    return <div style={{position:"relative"}}>
             <div className={styles.HeaderTextWrapper}>
            <div>Setpoint Temperature</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img onMouseDown={() => clientId === status?.leaderSelected ?  handleMouseDownEvent('enter','sub') : {}} onMouseUp={() =>clientId === status?.leaderSelected ?  handleMouseDownEvent('leave','sub') : {}} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{temperature}</div>
                    <img onMouseDown={() => clientId === status?.leaderSelected ?  handleMouseDownEvent('enter','add') : {}} onMouseUp={() =>clientId === status?.leaderSelected ?  handleMouseDownEvent('leave','add') : {}} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => handleIModal("Setpoint Temperature")} ref={setpointTemperatureRef} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <div className={styles.HeaderTextWrapper}>
            <div>Control Method</div>
            <div>TEMPRATURE PROBE</div>
        </div>
        <div className={styles.HeaderSubTextWrapper}>Please make sure the probe is always in contact with the soution.</div>
        <div className={styles.HeaterElementWraper}>
            <div className={styles.TemperatureWrapper}>
                <div>50</div>
                <div className={styles.TemperatureDegree}>{" "}</div>
                <div>C</div>
            </div>
            <img src={HeaterIcon} className={styles.HeaterEelementImage} alt="heater element"/>
            <div className={styles.HeaterElementText}>Power: <span style={{color:"#DC2828"}}>0 W</span></div>
        </div>
        <div className={styles.ButtonWrapper}>
            <div onClick={() => clientId === status?.leaderSelected ? setModal('start') : {}} className={styles.Button} style={extraStyle}>Start</div>
            <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.Button} style={extraStyle}>Stop</div>
        </div>
        <MemberDisconnect isOpen={isOpen && isOpen !== "Setpoint Temperature" ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'start' ? handleStart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={clientId === status?.leaderSelected && temperature ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen === "Setpoint Temperature" ? true : false} pos={iModalPostion} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>

    </div>
}

export default TemperatureProbe