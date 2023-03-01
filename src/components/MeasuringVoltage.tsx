import styles from '../styles/measuringTemprature.module.css';
import {TempratureGraph} from "../images/index";
import RightArrow from './RightArrow';
import { useEffect, useState } from 'react';
import {useDeviceStatus} from "../labhub/status";
import MemberDisconnect from './Modal/MemberDisconnectModal';
import { useNavigate } from 'react-router-dom';

const MeasuringVoltage = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [voltage,setVoltage] = useState<any>(0)
    const [isMobile,setIsMobile] = useState<boolean>(false)
    const handleSubmit = () => {

    }
    const handleRestart = () => {
        setVoltage(0)
        setModal("")
    }
    const handleStop = () => {
        setModal("")
        navigate(-1)
    }
    const handleCapture = () => {

    }
    const handleSave = () => {

    }
    useEffect(() => {
        window.addEventListener('resize', () =>{
            if(window.innerWidth <= 580)
            setIsMobile(true)
            else 
            setIsMobile(false)
        });
        return () => {
            window.removeEventListener('resize', () => {setIsMobile(false)})
        }
    },[])
    const extraStyle = clientId !== status?.leaderSelected ? {backgroundColor: "#989DA3",cursor:"not-allowed"} : {}
    return <div className={styles.TopWrapper}>
        <div className={styles.HeaderWrapper}>
            <div style={{fontWeight:500}}>Measuring Voltage</div>
            <div></div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
            <div>Voltage Value</div>
        </div>
        <div className={styles.TextBody}>
            <img src={TempratureGraph} className={styles.GraphStyle} alt="graph"/>
            {!isMobile ? <div className={styles.ButtonWrapper}>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('restart') : {}} className={styles.RestartButton} style={extraStyle}>Restart</div>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.StopButton} style={extraStyle}>Stop</div>
                <div className={styles.CaptureButton}>Capture</div>

            </div> : null}
        </div>
        <div className={styles.FooterTextWrapper}>
            <div className={styles.FooterInnerTextWrapper}>
            <div>TITLE</div>
            <div className={styles.FooterText}>
                <div>T0918564122-1123-7T09185...</div>
                <div className={styles.SaveButton}>Save</div>
            </div>
            </div>
        </div>
        {isMobile ? <div className={styles.ButtonHorizontalWrapper}>
            <div className={styles.ButtonHorizontalInnerWrapper}>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('restart') : {}} className={styles.RestartHorizontalButton} style={extraStyle}>Restart</div>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.StopHorizontalButton} style={extraStyle}>Stop</div>
                <div className={styles.CaptureHorizontalButton}>Capture</div>
            </div>
        </div> : null}
        <MemberDisconnect isOpen={isOpen ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'restart' ? handleRestart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={voltage ? true : false} handleSubmit={handleSubmit}/>
    </div>
}


export default MeasuringVoltage