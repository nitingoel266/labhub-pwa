import styles from '../../styles/scanDevice.module.css';
import {LabHubSticker,BluetoothIcon,BlackBluetoothIcon,LoaderImage,UpdateIcon,DownloadIcon} from "../../images/index";
import { useDeviceConnected,useDeviceStatus,useConnectionStablished, usePwaInstallPromotion, useSwPendingUpdate} from '../../labhub/status';
import {initSetup,uninitSetup} from "../../labhub/init-setup";
import RightArrow from '../../components/RightArrow';
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from '../../components/Modal/MemberDisconnectModal';
import {  useState } from 'react';
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

    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc"> 
        <div className={styles.ExtraButtonWrapper}>
            {installPromotion && <button aria-label={"Add to home screen Button"} className={styles.ExtraButton} onClick={installClickHandler}>
                <img src={DownloadIcon} style={{width:18,marginRight:8}} alt="add to home icon"/>
                <div>Add to Home Screen</div>
                </button>}
            {updatePending && <button aria-label={"update Button"} className={styles.ExtraButton} style={{backgroundColor:"#32cd32"}} onClick={updateServiceWorker}>
                <img src={UpdateIcon} style={{width:18,marginRight:8}} alt="update icon"/>
                <div>Update Application</div>
                </button>}
        </div>
        <div className={styles.ScanDeviceWrapper}>
            <div className={styles.LabHubStickerWrapper}>
            <img src={LabHubSticker} style={{width:'100%'}} alt="labhub images"/>
            </div>
           {!isConnected && <button aria-label={"Scan Device Button"} className={styles.ScanDeviceButton} style={connected ? {} : {backgroundColor:"#FFFFFF",boxShadow:"0px 1px 2px 1px #B6B5B5"}} onClick={() => connected ? setModal("resetConnection") : handleSubmit()}>
                <img src={connected ? BluetoothIcon : BlackBluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText} style={connected ? {} :{color:"#424C58"}}>Scan Devices</div>
            </button>}
            {!isConnected && connected ? <button aria-label={"Disconnect Device Button"} className={styles.ScanDeviceButton} onClick={() => setModal("device")}>
                <img src={BluetoothIcon} className={styles.BluetoothIconWrapper} alt="bluetoothIcon"/>
                <div className={styles.ScanDeviceText}>Disconnect</div>
            </button> : null}
            {connected && status?.leaderSelected && <RightArrow isSelected={!isConnected && status?.leaderSelected ? true : false} handleSubmit={handleRightArrow}/>}
            {isConnected && <img src={LoaderImage} style={{width:70}} alt="loader gif"/>}
        </div>
        {isOpen && isOpen !== "Device isn't Connected!" && <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === "resetConnection" ? resetConnection : handleDisconnectDevice} message={isOpen === "resetConnection" ? "Do you want to connect to another device?" : `Are you sure to Disconnect from <strong style="white-space: nowrap;">${status?.deviceName}</strong>!`}/>}
    </div>
}

export default ScanDevices;
