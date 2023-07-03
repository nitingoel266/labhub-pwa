import { useNavigate } from "react-router-dom";
import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";
import { useEffect, useRef } from "react";


const HeaterInitialPage = () => {
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const messageRef:any = useRef(null)

    const handleSubmit = () => {
        if(status?.heaterConnected)
        navigate("/method-selection")
    }
    useEffect(() => { // to set focus for acessibility
        messageRef?.current?.focus()
      },[])
    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
                <button ref={messageRef} aria-label={status?.heaterConnected ? 'Heater is Connected Press right arrow to proceed' : 'You must plug in both the heater and power connected before you can proceed'} className={styles.PimaryText} style={{outline:"none",border:"none",fontSize:18,fontWeight:500}}>
                    {status?.heaterConnected ? 'Heater is Connected' : 'You must plug in both the heater and power cord before you can proceed'}
                    {status?.heaterConnected && <div aria-label="Press right arrow to proceed">Press right arrow to proceed</div>}
                </button>
            
            <RightArrow isSelected={status?.heaterConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default HeaterInitialPage