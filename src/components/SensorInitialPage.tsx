import {useDeviceStatus} from "../labhub/status";
import styles from '../styles/sensorInitialPage.module.css';
import RightArrow from "./RightArrow";


const Sensor = () => {
    const [status] = useDeviceStatus();
    const handleSubmit = () => {

    }
    return <div className={styles.TopWrapper} style={{height:window.innerHeight-150}}>
            <div className={styles.PimaryText}>{status?.sensorConnected ? `Temperature/Voltage sensor connected` :"Sensors not Detected"}</div>
            <div className={styles.SecondaryText}>{status?.sensorConnected ? "Press right arrow to start measuring" :"Connect sensor to proceed"}</div>
            <RightArrow isSelected={status?.sensorConnected ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default Sensor