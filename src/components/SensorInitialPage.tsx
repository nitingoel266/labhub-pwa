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
    return <div className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <div className={styles.PimaryText}>{status?.sensorConnected ? `${status?.sensorConnected[0].toUpperCase()+status?.sensorConnected.slice(1)} sensor connected` :"Sensors not Detected"}</div>
            <div className={styles.SecondaryText}>{status?.sensorConnected ? "Press right arrow to start measuring" :"Connect sensor to proceed"}</div>
            <RightArrow isSelected={status?.sensorConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default Sensor