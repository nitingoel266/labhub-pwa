import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon,BlackBluetoothIcon} from "../../images/index";
import { useDeviceConnected,useDeviceStatus,applicationErrorMessage} from '../../labhub/status';
import {initSetup,uninitSetup} from "../../labhub/init-setup";
import RightArrow from '../../components/RightArrow';
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from '../../components/Modal/MemberDisconnectModal';
import { useState } from 'react';

const ScanDevices = () => {
    const navigate = useNavigate();
    const [connected] = useDeviceConnected();
    const [status] = useDeviceStatus();
    const [isOpen,setModal] = useState("")


    const handleRightArrow = () => {
        navigate("/mode-selection")
    }
    const handleSubmit = async () => {
           await initSetup()
           if(status?.leaderSelected){
            navigate("/mode-selection")
           }
    }

    const changeConnection = () => {
        applicationErrorMessage.next('Do you want to connect to another device?');
    }
   
    const handleDisconnectDevice = async () => {
    if(connected){
      await uninitSetup()
    }
    setModal("")
  }
    return <> 
        <div className={styles.ScanDeviceWrapper}>
            <img src={LabHubSticker} className={styles.LabHubStickerWrapper} alt="al"/>
            <div className={styles.ScanDeviceButton} style={connected ? {} : {backgroundColor:"#FFFFFF",boxShadow:"0px 1px 2px 1px #B6B5B5"}} onClick={() => connected ? changeConnection() : handleSubmit()}>
                <img src={connected ? BluetoothIcon : BlackBluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText} style={connected ? {} :{color:"#424C58"}}>Scan Devices</div>
            </div>
            {connected ? <div className={styles.ScanDeviceButton} onClick={() => setModal("device")}>
                <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText}>Disconnect</div>
            </div> : null}
            {connected && status?.leaderSelected && <RightArrow isSelected={status?.leaderSelected ? true : false} handleSubmit={handleRightArrow}/>}
        </div>
        <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={handleDisconnectDevice} message={`Are you sure to Disconnect from ${status?.deviceName}!`}/>
    </>
}

export default ScanDevices;