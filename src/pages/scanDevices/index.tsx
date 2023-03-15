import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon,BlackBluetoothIcon} from "../../images/index";
import { useSocketConnected,useDeviceStatus} from '../../labhub/status';
import {resetLeader} from "../../labhub/actions"
import {initSetup,uninitSetup} from "../../labhub/setup";
import RightArrow from '../../components/RightArrow';
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';


const ScanDevices = () => {
    // const [isOpen,setModal] = useState(false)
    const navigate = useNavigate();
    const [connected] = useSocketConnected();
    const clientId = localStorage.getItem('labhub_client_id')
    const [status] = useDeviceStatus();

    const handleRightArrow = () => {
        navigate("/mode-selection")
    }
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
        <div className={styles.ScanDeviceButton} style={connected ? {} : {backgroundColor:"#FFFFFF",boxShadow:"0px 1px 2px 1px #B6B5B5"}} onClick={handleSubmit}>
            <img src={connected ? BluetoothIcon : BlackBluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText} style={connected ? {} :{color:"#424C58"}}>Scan Devices</div>
        </div>
        {connected ? <div className={styles.ScanDeviceButton} onClick={handleDisconnect}>
            <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
            <div className={styles.ScanDeviceText}>Disconnect</div>
        </div> : null}
        {/* <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/> */}
        {connected && status?.leaderSelected && <RightArrow isSelected={status?.leaderSelected ? true : false} handleSubmit={handleRightArrow}/>}
    </div>
}

export default ScanDevices;