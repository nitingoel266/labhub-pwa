import { useNavigate } from "react-router-dom";
import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";


const HeaterInitialPage = () => {
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const handleSubmit = () => {
        if(status?.sensorConnected)
        navigate("/method-selection")
    }
    return <div className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <div className={styles.PimaryText}>{status?.sensorConnected ? 'Heater is Connected.' : 'Plug in the Heater and connect Power to proceed'}</div>
            <RightArrow isSelected={status?.sensorConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default HeaterInitialPage