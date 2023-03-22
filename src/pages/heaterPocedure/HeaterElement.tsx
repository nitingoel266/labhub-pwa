import {ExpandIcon,CollapsedIcon,BlackIButtonIcon,HeaterIcon,HeaterAnimation} from "../../images/index"
import { useEffect, useState } from 'react';
import styles from '../../styles/heaterElement.module.css';
import IButtonModal from "../../components/Modal/IButtonModal";
import RightArrow from "../../components/RightArrow";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import {useDeviceStatus ,useDeviceDataFeed} from "../../labhub/status";
import {changeSetpointTemp, startHeaterExperiment} from "../../labhub/actions";
import { useNavigate } from "react-router-dom";
import IButtonComponent from "../../components/IButtonComponent";
import {mobileWidth,SETPOINT_TEMPERATURE,getDescription} from "../../components/Constants";

let temperatureTimmer:any;
const HeaterElement = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [dataStream] = useDeviceDataFeed();
    const [isOpen,setModal] = useState("");
    const [isStart,setIsStart] = useState<boolean>(false)
    const [temperature,setTemperature] =useState<number>(status?.setpointTemp || 25); //25-150
    const [temperatureShouldBe,setTemperatureShouldBe] = useState<number>(0);
    const [power,setPower] = useState<number>(0);

    const handleTemperature = (title:string) => {
        if(title === 'sub' && temperature > 25)
        setTemperature((temp) => temp > 25 ? temp - 1 : temp)
        if(title === 'add' && temperature < 150)
        setTemperature((temp) => temp <150 ? temp + 1 : temp)
    }
    const handleStart = () => {
        setIsStart(true)
        startHeaterExperiment()
        setModal("")
    }
    const handleStop = () => {
        setIsStart(false)
        setModal("")
        // navigate(-1)
    }
    const handleSubmit = () => {
        changeSetpointTemp(temperature)
        navigate(-1)
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
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    // useEffect(() => {
    //     const handleTabClose = (event:any) => {
    //       event.preventDefault();
    
    //       console.log('beforeunload event triggered');
    
    //       return (event.returnValue =
    //         'Are you sure you want to exit..................?');
    //     };
    
    //     window.addEventListener('beforeunload', handleTabClose);
    
    //     return () => {
    //       window.removeEventListener('beforeunload', handleTabClose);
    //     };
    //   }, []);
    useEffect(() => {
        if(dataStream?.heater?.element){
            setPower(dataStream.heater.element[0])
        }
    },[dataStream?.heater?.element])
    const extraStyle = clientId !== status?.leaderSelected ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : {}
    return <div style={{position:"relative"}}>
             <div className={styles.HeaderTextWrapper}>
            <div>{SETPOINT_TEMPERATURE}</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img onMouseDown={() => clientId === status?.leaderSelected ? handleMouseDownEvent('enter','sub') : {}} onMouseUp={() => clientId === status?.leaderSelected ? handleMouseDownEvent('leave','sub') : {}} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{temperature}</div>
                    <img onMouseDown={() => clientId === status?.leaderSelected ? handleMouseDownEvent('enter','add') : {}} onMouseUp={() => clientId === status?.leaderSelected ? handleMouseDownEvent('leave','add') : {}} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => handleIModal(SETPOINT_TEMPERATURE)} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        {isOpen === SETPOINT_TEMPERATURE && isMobile && <IButtonComponent title={SETPOINT_TEMPERATURE} description={getDescription(SETPOINT_TEMPERATURE)} marginTop = {10}/>}

        <div className={styles.HeaderTextWrapper}>
            <div>Control Method</div>
            <div>HEATER ELEMENT</div>
        </div>
        <div className={styles.HeaterElementWraper}>
            <div className={styles.HeaterElementSubWraper}>
                <img src={isStart ? HeaterAnimation : HeaterIcon} className={styles.HeaterEelementImage} alt="heater element"/>
                <div className={styles.ButtonWrapper}>
                    <div onClick={() => clientId === status?.leaderSelected && !isStart ? setModal('start') : {}} className={styles.Button} style={isStart ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : extraStyle}>Start</div>
                    <div onClick={() => clientId === status?.leaderSelected && isStart ? setModal('stop') : {}} className={styles.Button} style={!isStart ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : extraStyle}>Stop</div>
                </div>
            </div>
            <div className={styles.HeaterElementText}>Power: <span style={{color:"#DC2828"}}>{power} W</span></div>
        </div>
        <MemberDisconnect isOpen={isOpen && isOpen !== SETPOINT_TEMPERATURE ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'start' ? handleStart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={clientId === status?.leaderSelected && temperature !== status?.setpointTemp ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen === SETPOINT_TEMPERATURE ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}

    </div>
}

export default HeaterElement