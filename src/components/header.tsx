import {useDeviceStatus,useSocketConnected} from "../labhub/status";
// import {uninitSetup} from "../labhub/setup";
import {resetLeader/* ,unjoinMember */}from "../labhub/actions";
import {setSelectedFunction,setSelectedMode} from "../labhub/actions-client";
import styles from '../styles/header.module.css';
import {DeviceIcon,BatteryIcon,BackIcon,ShareIcon,TextIcon,WhiteShareIcon,SyncIcon,WhiteDownloadIcon,WhiteDeleteIcon} from "../images/index"
import { useNavigate ,useLocation} from 'react-router-dom';
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useEffect, useState } from "react";


function Header(props: HeaderProps) {  
  const [status] = useDeviceStatus();
  const [connected] = useSocketConnected();
  const clientId = localStorage.getItem('labhub_client_id')
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen,setModal] = useState("")
  const [screenName,setScreenName] = useState("")


  const handleBack = () => {
    if(location?.pathname === '/mode-selection')
      setScreenName("/scan-devices")
      else setScreenName("")
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
    // navigate("/my-records")
  }
  const handleConnectionManager = () => {
    navigate("/scan-devices")
    setScreenName("/scan-devices")
  }
  const handleDisconnectLeaderMember = () => {
    if(clientId === status?.leaderSelected){
      resetLeader()
      // navigate("/scan-devices")
    }if(clientId && status?.membersJoined && status?.membersJoined.includes(clientId)){
      // unjoinMember()
    }
    setModal("")
  }
  const handleDelete = () => {
    setModal("")

  }
  useEffect(() => { // if connection is refused or leader disconnect then scan devices screen
    if((!connected && location.pathname !== "/") || (!status?.leaderSelected)){
      if(!status?.leaderSelected)
      setScreenName("")
      navigate("/scan-devices")
    }
  },[connected,navigate,location?.pathname,status?.leaderSelected])
  useEffect(() => { // if leader selected and connection established the all members should be on mode selection screen
    if(connected && status && status?.leaderSelected && screenName !== '/scan-devices'){
        // joinAsMember()
        // setModal(false)
        if(location.pathname === '/scan-devices')
        navigate("/mode-selection")
    }
},[status?.leaderSelected,connected,navigate,status,location?.pathname,screenName])
  // console.log("??>>> connected and status",connected,"status :- ",status)
  return (<div>
    <FirstHeader handleClick={handleClick} status={status} connected={connected} clientId={clientId}/>
    <SecondHeader handleBack={handleBack} handleClick={handleClick} status={status} connected={connected} clientId={clientId} handleMyRecord={handleMyRecord} setModal={(value) => setModal(value)} handleConnectionManager={handleConnectionManager}/>
    <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === 'delete' ? handleDelete : handleDisconnectLeaderMember} message={isOpen === 'delete' ? "Aye you sure you want to Delete?" : "Are you sure to Disconnect!"}/>
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
        <div style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{connected ? status?.deviceName : ""}</div>
        <div onClick={() => handleClick("leaderMember")} style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{connected && (clientId === status?.leaderSelected ? "(Leader)" : "(Member)") }</div>
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


const SecondHeader = ({handleBack,handleMyRecord,handleClick,connected,status,clientId,setModal,handleConnectionManager}:SecondHeaderprops) => {
  const location = useLocation();
  return <div className={styles.SecondHeaderWrapper}>
    <img onClick={location?.pathname === "/scan-devices" ? () =>{} : handleBack} src={BackIcon} style={{cursor:location?.pathname === '/scan-devices' ? "not-allowed" : "pointer",width:25}} alt="Back Icon"/>
    {!["/temperature-records","/voltage-records","/rgb-records"].includes(location?.pathname) ? <div className={styles.FistHeaderSubWrapper}>
      <img onClick={() => connected ? handleMyRecord() : {}} src={TextIcon} style={{cursor:"pointer",width:37,marginRight:5}} alt="Text Icon"/>
      <img onClick={() => connected ? handleConnectionManager() : {}} src={ShareIcon} style={{cursor:"pointer",width:25}} alt="Share Icon"/>
      {connected && clientId !== status?.leaderSelected && <img src={SyncIcon} style={{cursor:"pointer",marginLeft:10,width:20}} alt="syn button"/>}
    </div> :
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
  handleClick:(value:any) => void;
  handleConnectionManager:() => void;
  connected?:any;
}

export interface HeaderProps {}