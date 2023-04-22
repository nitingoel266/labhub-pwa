import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon,BlackBluetoothIcon,LoaderImage} from "../../images/index";
import { useDeviceConnected,useDeviceStatus,useConnectionStablished, usePwaInstallPromotion, useSwPendingUpdate} from '../../labhub/status';
import {initSetup,uninitSetup} from "../../labhub/init-setup";
import RightArrow from '../../components/RightArrow';
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from '../../components/Modal/MemberDisconnectModal';
import { useState } from 'react';
import { installClickHandler, updateServiceWorker } from '../../pwaSetup';

const ScanDevices = () => {
    const navigate = useNavigate();
    const [isConnected] = useConnectionStablished();
    const [connected] = useDeviceConnected();
    const [status] = useDeviceStatus();
    const [installPromotion] = usePwaInstallPromotion();
    const [updatePending] = useSwPendingUpdate();
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

    const resetConnection = async () => {
        setModal("")
        await initSetup()
        if(status?.leaderSelected){
            navigate("/mode-selection")
           }

    }
   
    const handleDisconnectDevice = async () => {
    if(connected){
      await uninitSetup()
    }
    setModal("")
  }
    return <> 
        <div>
            {installPromotion && <button onClick={installClickHandler}>Add to Home Screen</button>}
            {updatePending && <button onClick={updateServiceWorker}>Update Application</button>}
        </div>
        <div className={styles.ScanDeviceWrapper}>
            <div className={styles.LabHubStickerWrapper}>
            <img src={LabHubSticker} style={{width:'100%'}} alt="al"/>
            </div>
           {!isConnected && <div className={styles.ScanDeviceButton} style={connected ? {} : {backgroundColor:"#FFFFFF",boxShadow:"0px 1px 2px 1px #B6B5B5"}} onClick={() => connected ? setModal("resetConnection") : handleSubmit()}>
                <img src={connected ? BluetoothIcon : BlackBluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText} style={connected ? {} :{color:"#424C58"}}>Scan Devices</div>
            </div>}
            {!isConnected && connected ? <div className={styles.ScanDeviceButton} onClick={() => setModal("device")}>
                <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText}>Disconnect</div>
            </div> : null}
            {connected && status?.leaderSelected && <RightArrow isSelected={!isConnected && status?.leaderSelected ? true : false} handleSubmit={handleRightArrow}/>}
            {isConnected && <img src={LoaderImage} style={{width:70}} alt="loader gif"/>}
        </div>
        <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === "resetConnection" ? resetConnection : handleDisconnectDevice} message={isOpen === "resetConnection" ? "Do you want to connect to another device?" : `Are you sure to Disconnect from ${status?.deviceName}!`}/>
    </>
}

export default ScanDevices;
