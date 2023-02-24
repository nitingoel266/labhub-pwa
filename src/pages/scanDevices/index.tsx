import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon} from "../../images/index";
import { useDeviceStatus } from '../../labhub/status';
import LeadeSelectionModal from './leaderSelectionModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ScanDevices = () => {
    const [status] = useDeviceStatus();
    const [isOpen,setModal] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = () => {
        if(status?.leaderSelected){
            navigate("/mode-selection")
        }else {
            setModal(true)
        }
    }
    console.log("??>> status ",status)
    return <div className={styles.ScanDeviceWrapper}>
        <img src={LabHubSticker} className={styles.LabHubStickerWrapper} alt="al"/>
        <div className={styles.ScanDeviceButton} onClick={handleSubmit}>
            <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText}>Scan Devices</div>
        </div>
        <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/>
    </div>
}

export default ScanDevices;