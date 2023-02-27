import {useDeviceStatus} from "../labhub/status";
import {resetLeader,unjoinMember,setSelectedMode,setSelectedFunction,setupData}from "../labhub/actions";
import styles from '../styles/header.module.css';
import {DeviceIcon,BatteryIcon,BackIcon,ShareIcon,TextIcon,WhiteShareIcon,WhiteDownloadIcon,WhiteDeleteIcon} from "../images/index"
import { useNavigate ,useLocation} from 'react-router-dom';
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useState } from "react";


function Header(props: HeaderProps) {  
  const [status] = useDeviceStatus();
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
    }else if(clientId && status?.membersJoined && status?.membersJoined.includes(clientId)){
      unjoinMember()
    }
    setModal("")
  }
  const handleDisconnectDevice = () => {
    setModal("")
  }
  const handleDelete = () => {
    setModal("")

  }
  return (<div>
    <FirstHeader handleClick={handleClick} status={status} clientId={clientId}/>
    <SecondHeader handleBack={handleBack} handleMyRecord={handleMyRecord} setModal={(value) => setModal(value)}/>
    <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === "device" ? handleDisconnectDevice : (isOpen === 'delete' ? handleDelete : handleDisconnectLeaderMember)} message={isOpen === "device" ? `Are you sure to Disconnect from ${status?.deviceName}!` : (isOpen === 'delete' ? "Aye you sure you want to Delete?" : "Are you sure to Disconnect!")}/>
  </div>);
}

export default Header;

const FirstHeader = ({handleClick,status,clientId}:FirstHeaderProps) => {
  const filledStyle = {flex:`${status?.batteryLevel}%`,backgroundColor: status?.batteryLevel > 10 ? "#79D179" : "	#FF0000"};
  const unFilledStyle = {flex:`${100 - status?.batteryLevel}%`,backgroundColor:status?.batteryLevel > 10 ? "#FFC0CB" : "#FFFFFF"};
  return <div className={styles.FistHeaderWrapper}>
    <div className={styles.FistHeaderSubWrapper}>
      <img src={DeviceIcon} alt="Device Icon"/>
      <div className={styles.FistHeaderSubWrapper}>
        <div onClick={() => handleClick("device")} style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{status?.deviceName}</div>
        <div onClick={() => handleClick("leaderMember")} style={{color:"white",marginLeft:8,fontSize:15}}>{status?.leaderSelected && (clientId === status?.leaderSelected ? "(Leader)" : "(Member)") }</div>
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


const SecondHeader = ({handleBack,handleMyRecord,setModal}:SecondHeaderprops) => {
  const location = useLocation();
  return <div className={styles.SecondHeaderWrapper}>
    <img onClick={handleBack} src={BackIcon} style={{cursor:"pointer",width:25}} alt="Back Icon"/>
    {!["/temperature-records","/voltage-records","/rgb-records"].includes(location?.pathname) && <div className={styles.FistHeaderSubWrapper}>
      <img onClick={handleMyRecord} src={TextIcon} style={{cursor:"pointer",width:37,marginRight:5}} alt="Text Icon"/>
      <img src={ShareIcon} style={{cursor:"pointer",width:25}} alt="Share Icon"/>
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
}

type SecondHeaderprops = {
  handleBack:() => void;
  handleMyRecord:() => void;
  setModal:(value:string) => void;
}

export interface HeaderProps {}