import { useNavigate } from "react-router-dom";
import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";
import { useEffect, useRef } from "react";


const Sensor = () => {
    const navigate = useNavigate();
    const [status] = useDeviceStatus();

    const messageRef:any = useRef(null)

    const handleSubmit = () => {
        if(status?.sensorConnected)
        navigate(`/${status?.sensorConnected}-sensor`)
    }
    useEffect(() => { // to set focus for acessibility
        messageRef?.current?.focus()
      },[])
    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <button
                ref={messageRef}
                aria-label = {status?.sensorConnected ? `${status?.sensorConnected} sensor connected Press right arrow to start measuring` :"Sensors not Detected Connect sensor to proceed"}
                style={{outline:"none",border:"none"}}
            >
                <div className={styles.PimaryText}>{status?.sensorConnected ? `${status?.sensorConnected[0].toUpperCase()+status?.sensorConnected.slice(1)} sensor connected` :"Sensors not Detected"}</div>
                <div className={styles.SecondaryText}>{status?.sensorConnected ? "Press right arrow to start measuring" :"Connect sensor to proceed"}</div>
            </button>
           
            <RightArrow isSelected={status?.sensorConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default Sensor