import {useDeviceStatus} from "../labhub/status";
import {resetLeader,unjoinMember}from "../labhub/actions";
import styles from '../styles/header.module.css';
import {DeviceIcon,BatteryIcon,BackIcon,ShareIcon,TextIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from "./Modal/MemberDisconnectModal";
import { useState } from "react";


function Header(props: HeaderProps) {  
  const [status] = useDeviceStatus();
  const clientId = localStorage.getItem('labhub_client_id')
  const navigate = useNavigate();
  const [isOpen,setModal] = useState("")

  const handleBack = () => {
    navigate(-1)
  }
  const handleClick = (value:any) => {
    setModal(value)
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
  return (<div>
    <FirstHeader handleClick={handleClick} status={status} clientId={clientId}/>
    <SecondHeader handleBack={handleBack}/>
    <MemberDisconnect isOpen={isOpen ? true : false} setModal={(value) => setModal(value)} handleDisconnect={isOpen === "device" ? handleDisconnectDevice : handleDisconnectLeaderMember} message={isOpen === "device" ? `Are you sure to Disconnect from ${status?.deviceName}!` : "Are you sure to Disconnect!"}/>
  </div>);
}

export default Header;

const FirstHeader = ({handleClick,status,clientId}:FirstHeaderProps) => {
  return <div className={styles.FistHeaderWrapper}>
    <div className={styles.FistHeaderSubWrapper}>
      <img src={DeviceIcon} alt="Device Icon"/>
      <div className={styles.FistHeaderSubWrapper}>
        <div onClick={() => handleClick("device")} style={{color:"white",marginLeft:8,fontSize:15,cursor:"pointer"}}>{status?.deviceName}</div>
        <div onClick={() => handleClick("leaderMember")} style={{color:"white",marginLeft:8,fontSize:15}}>{status?.leaderSelected && (clientId === status?.leaderSelected ? "(Leader)" : "(Member)") }</div>
    </div>
    </div>
    <img src={BatteryIcon} alt="battery Icon"/>
  </div>
}


const SecondHeader = ({handleBack}:SecondHeaderprops) => {
  return <div className={styles.SecondHeaderWrapper}>
    <img onClick={handleBack} src={BackIcon} style={{cursor:"pointer",width:25}} alt="Back Icon"/>
    <div className={styles.FistHeaderSubWrapper}>
      <img src={TextIcon} style={{cursor:"pointer",width:37,marginRight:5}} alt="Text Icon"/>
      <img src={ShareIcon} style={{cursor:"pointer",width:25}} alt="Share Icon"/>
    </div>
  </div>
}

type FirstHeaderProps = {
  handleClick:(value:any) => void;
  status:any;
  clientId?:any;
}

type SecondHeaderprops = {
  handleBack:() => void;
}

export interface HeaderProps {}