import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon} from "../../images/index";
import { useDeviceStatus ,useSocketConnected} from '../../labhub/status';
import {initSetup} from "../../labhub/setup";
import LeadeSelectionModal from '../../components/Modal/leaderSelectionModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ScanDevices = () => {
    const [status] = useDeviceStatus();
    const [isOpen,setModal] = useState(false)
    const navigate = useNavigate();
  const [connected] = useSocketConnected();

    const handleSubmit = () => {
        // if(status?.leaderSelected){
        //     navigate("/mode-selection")
        // }else {
        //     setModal(true)
        // }
        if(!connected){
            initSetup()
        }
        setModal(true)
    }
    return <div className={styles.ScanDeviceWrapper}>
        <img src={LabHubSticker} className={styles.LabHubStickerWrapper} alt="al"/>
        <div className={styles.ScanDeviceButton} onClick={handleSubmit}>
            <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText}>Scan Devices</div>
        </div>
        {/* <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/> */}
    </div>
}

export default ScanDevices;