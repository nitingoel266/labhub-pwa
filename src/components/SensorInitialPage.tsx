import { useNavigate } from "react-router-dom";
import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";


const Sensor = () => {
    const navigate = useNavigate();
    const [status] = useDeviceStatus();
    const handleSubmit = () => {
        if(status?.sensorConnected)
        navigate(`/${status?.sensorConnected}-sensor`)
    }
    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <div aria-label={status?.sensorConnected ? `${status?.sensorConnected} sensor connected` :"Sensors not Detected"} className={styles.PimaryText}>{status?.sensorConnected ? `${status?.sensorConnected[0].toUpperCase()+status?.sensorConnected.slice(1)} sensor connected` :"Sensors not Detected"}</div>
            <div aria-label={status?.sensorConnected ? "Press right arrow to start measuring" :"Connect sensor to proceed"} className={styles.SecondaryText}>{status?.sensorConnected ? "Press right arrow to start measuring" :"Connect sensor to proceed"}</div>
            <RightArrow isSelected={status?.sensorConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default Sensor