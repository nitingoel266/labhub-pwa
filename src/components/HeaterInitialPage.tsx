import { useNavigate } from "react-router-dom";
import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";


const HeaterInitialPage = () => {
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const handleSubmit = () => {
        if(status?.heaterConnected)
        navigate("/method-selection")
    }
    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <div aria-label={status?.heaterConnected ? 'Heater is Connected' : 'Plug in the Heater and connect Power to proceed'} className={styles.PimaryText}>{status?.heaterConnected ? 'Heater is Connected' : 'Plug in the Heater and connect Power to proceed'}</div>
            {status?.heaterConnected && <div aria-label="Press right arrow to proceed">Press right arrow to proceed</div>}
            <RightArrow isSelected={status?.heaterConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default HeaterInitialPage