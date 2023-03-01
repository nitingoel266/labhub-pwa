import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon} from "../../images/index";
import { useSocketConnected,useDeviceStatus} from '../../labhub/status';
import {resetLeader} from "../../labhub/actions"
import {initSetup,uninitSetup} from "../../labhub/setup";
// import { useState } from 'react';


const ScanDevices = () => {
    // const [isOpen,setModal] = useState(false)
    const [connected] = useSocketConnected();
    const clientId = localStorage.getItem('labhub_client_id')
    const [status] = useDeviceStatus();

    const handleSubmit = () => {
        // if(status?.leaderSelected){
        //     navigate("/mode-selection")
        // }else {
        //     setModal(true)
        // }
        if(!connected){
            initSetup()
        }
        // setModal(true)
    }
    const handleDisconnect = () => {
        if(connected){
            if(clientId === status?.leaderSelected){
              resetLeader()
            }
            uninitSetup()
        }
    }
    // console.log("In the scan screen ",status, "connected ",connected)
    return <div className={styles.ScanDeviceWrapper}>
        <img src={LabHubSticker} className={styles.LabHubStickerWrapper} alt="al"/>
        <div className={styles.ScanDeviceButton} onClick={handleSubmit}>
            <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText}>Scan Devices</div>
        </div>
        {connected ? <div className={styles.ScanDeviceButton} onClick={handleDisconnect}>
            <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText}>Disconnect</div>
        </div> : null}
        {/* <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/> */}
    </div>
}

export default ScanDevices;