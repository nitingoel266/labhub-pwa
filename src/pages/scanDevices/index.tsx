import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon,BlackBluetoothIcon} from "../../images/index";
import { useDeviceConnected,useDeviceStatus} from '../../labhub/status';
import {resetLeader} from "../../labhub/actions"
import {initSetup,uninitSetup} from "../../labhub/setup";
import RightArrow from '../../components/RightArrow';
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from '../../components/Modal/MemberDisconnectModal';
import { useState } from 'react';
import {LABHUB_CLIENT_ID} from "../../utils/const";

const ScanDevices = () => {
    const navigate = useNavigate();
    const [connected] = useDeviceConnected();
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID)
    const [status] = useDeviceStatus();
    const [isOpen,setModal] = useState("")


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
    // const handleDisconnect = () => {
    //     if(connected){
    //         if(clientId === status?.leaderSelected){
    //           resetLeader()
    //         }
    //         uninitSetup()
    //     }
    // }
    const handleDisconnectDevice = () => {
    if(connected){
      if(clientId === status?.leaderSelected){
        resetLeader()
      }
      uninitSetup()
    }
    setModal("")
  }
    // console.log("In the scan screen ",status, "connected ",connected)
    return <> 
        <div className={styles.ScanDeviceWrapper}>
            <img src={LabHubSticker} className={styles.LabHubStickerWrapper} alt="al"/>
            <div className={styles.ScanDeviceButton} style={connected ? {} : {backgroundColor:"#FFFFFF",boxShadow:"0px 1px 2px 1px #B6B5B5"}} onClick={handleSubmit}>
                <img src={connected ? BluetoothIcon : BlackBluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText} style={connected ? {} :{color:"#424C58"}}>Scan Devices</div>
            </div>
            {connected ? <div className={styles.ScanDeviceButton} onClick={() => setModal("device")}>
                <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText}>Disconnect</div>
            </div> : null}
            {/* <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/> */}
            {connected && status?.leaderSelected && <RightArrow isSelected={status?.leaderSelected ? true : false} handleSubmit={handleRightArrow}/>}
        </div>
        <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={handleDisconnectDevice} message={`Are you sure to Disconnect from ${status?.deviceName}!`}/>
    </>
}

export default ScanDevices;