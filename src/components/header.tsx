import {useDeviceStatus,useSocketConnected} from "../labhub/status";
import {uninitSetup} from "../labhub/setup";
import {resetLeader,unjoinMember,setSelectedMode,setSelectedFunction,setupData}from "../labhub/actions";
import styles from '../styles/header.module.css';
import {DeviceIcon,BatteryIcon,BackIcon,ShareIcon,TextIcon,WhiteShareIcon,SyncIcon,WhiteDownloadIcon,WhiteDeleteIcon} from "../images/index"
import { useNavigate ,useLocation} from 'react-router-dom';
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useState } from "react";


function Header(props: HeaderProps) {  
  const [status] = useDeviceStatus();
  const [connected] = useSocketConnected();
  const clientId = localStorage.getItem('labhub_client_id')
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen,setModal] = useState("")

  const handleBack = () => {
    const getPathFunc:any = {
      "/mode-selection":() => setSelectedMode(null),
      "/function-selection":() => setSelectedFunction(null),
      // "/data-setup":() => setupData(),
    }
    if(getPathFunc[location.pathname])
    getPathFunc[location.pathname]()
    navigate(-1)
  }
  const handleClick = (value:any) => {
    setModal(value)
  }
  const handleMyRecord = () => {
    navigate("/my-records")
  }
  const handleDisconnectLeaderMember = () => {
    if(clientId === status?.leaderSelected){
      resetLeader()
      navigate("/scan-devices")
    }if(clientId && status?.membersJoined && status?.membersJoined.includes(clientId)){
      unjoinMember()
    }
    setModal("")
  }
  const handleDisconnectDevice = () => {
    if(connected){
      if(clientId === status?.leaderSelected){
        resetLeader()
      }
      uninitSetup()
      navigate("/scan-devices")
    }
    setModal("")
  }
  const handleDelete = () => {
    setModal("")

  }
  return (<div>
    <FirstHeader handleClick={handleClick} status={status} connected={connected} clientId={clientId}/>
    <SecondHeader handleBack={handleBack} status={status} clientId={clientId} handleMyRecord={handleMyRecord} setModal={(value) => setModal(value)}/>
    <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === "device" ? handleDisconnectDevice : (isOpen === 'delete' ? handleDelete : handleDisconnectLeaderMember)} message={isOpen === "device" ? `Are you sure to Disconnect from ${status?.deviceName}!` : (isOpen === 'delete' ? "Aye you sure you want to Delete?" : "Are you sure to Disconnect!")}/>
  </div>);
}

export default Header;

const FirstHeader = ({handleClick,status,clientId,connected}:FirstHeaderProps) => {
  const filledStyle = {flex:`${connected ? status?.batteryLevel : 0}%`,backgroundColor: status?.batteryLevel > 10 ? "#79D179" : "	#FF0000"};
  const unFilledStyle = {flex:`${connected ? (100 - status?.batteryLevel) : 100}%`,backgroundColor:connected && status?.batteryLevel > 10 ? "#FFC0CB" : "#FFFFFF"};
  return <div className={styles.FistHeaderWrapper}>
    <div className={styles.FistHeaderSubWrapper}>
      <img src={DeviceIcon} alt="Device Icon"/>
      <div className={styles.FistHeaderSubWrapper}>
        <div onClick={() => handleClick("device")} style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{connected && status?.deviceName || ""}</div>
        <div onClick={() => handleClick("leaderMember")} style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{connected && status?.leaderSelected && (clientId === status?.leaderSelected ? "(Leader)" : "(Member)") }</div>
    </div>
    </div>
    <div className={styles.BatteryWapper}>
    <div className={styles.BatteryInnerWapper} >
      <div style={unFilledStyle}></div>
      <div style={filledStyle}></div>
    <img src={BatteryIcon} className={styles.BatteryIcon} alt="battery Icon"/>
    </div>
    <div className={styles.BatteryHandle}></div>
    </div>
  </div>
}


const SecondHeader = ({handleBack,handleMyRecord,status,clientId,setModal}:SecondHeaderprops) => {
  const location = useLocation();
  return <div className={styles.SecondHeaderWrapper}>
    <img onClick={handleBack} src={BackIcon} style={{cursor:"pointer",width:25}} alt="Back Icon"/>
    {!["/temperature-records","/voltage-records","/rgb-records"].includes(location?.pathname) && <div className={styles.FistHeaderSubWrapper}>
      <img onClick={handleMyRecord} src={TextIcon} style={{cursor:"pointer",width:37,marginRight:5}} alt="Text Icon"/>
      <img src={ShareIcon} style={{cursor:"pointer",width:25}} alt="Share Icon"/>
      {clientId !== status?.leaderSelected && <img src={SyncIcon} style={{cursor:"pointer",marginLeft:10,width:20}} alt="syn button"/>}
    </div> || 
    <div className={styles.FistHeaderSubWrapper}>
      <img src={WhiteShareIcon} style={{cursor:"pointer",width:20,marginRight:15}} alt="Share Icon"/>
      <img src={WhiteDownloadIcon} style={{cursor:"pointer",width:20,marginRight:15}} alt="Download Icon"/>
      <img onClick={() => setModal('delete')} src={WhiteDeleteIcon} style={{cursor:"pointer",width:20,marginRight:10}} alt="Delete Icon"/>
  </div>}
  </div>
}

type FirstHeaderProps = {
  handleClick:(value:any) => void;
  status:any;
  clientId?:any;
  connected?:any;
}

type SecondHeaderprops = {
  status:any;
  clientId?:any;
  handleBack:() => void;
  handleMyRecord:() => void;
  setModal:(value:string) => void;
}

export interface HeaderProps {}