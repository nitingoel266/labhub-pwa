
import styles from '../styles/header.module.css';
import {DeviceIcon,BatteryIcon,BackIcon,ShareIcon,TextIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';


function Header(props: HeaderProps) {  
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1)
  }
  const handleLeader = () => {

  }
  return (<>
    <FirstHeader handleLeader={handleLeader}/>
    <SecondHeader handleBack={handleBack}/>
  </>);
}

export default Header;

const FirstHeader = ({handleLeader}:FirstHeaderProps) => {
  return <div className={styles.FistHeaderWrapper}>
    <div className={styles.FistHeaderSubWrapper}>
      <img src={DeviceIcon} alt="Device Icon"/>
      <div className={styles.FistHeaderSubWrapper}>
        <div style={{color:"white",marginLeft:8,fontSize:15}}>LabHub Device 2</div>
        <div onClick={handleLeader} style={{color:"white",marginLeft:8,fontSize:15}}>(Leader)</div>
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
  handleLeader:() => void;
}

type SecondHeaderprops = {
  handleBack:() => void;
}

export interface HeaderProps {}