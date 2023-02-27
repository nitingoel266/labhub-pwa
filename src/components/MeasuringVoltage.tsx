import styles from '../styles/measuringTemprature.module.css';
import {TempratureGraph} from "../images/index";
import RightArrow from './RightArrow';
import { useState } from 'react';
import MemberDisconnect from './Modal/MemberDisconnectModal';
import { useNavigate } from 'react-router-dom';

const MeasuringVoltage = () => {
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [voltage,setVoltage] = useState<any>(0)
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
            <div className={styles.ButtonWrapper}>
                <div onClick={() => setModal('restart')} className={styles.RestartButton}>Restart</div>
                <div onClick={() => setModal('stop')} className={styles.StopButton}>Stop</div>
                <div className={styles.CaptureButton}>Capture</div>

            </div>
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
        <MemberDisconnect isOpen={isOpen ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'restart' ? handleRestart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={voltage ? true : false} handleSubmit={handleSubmit}/>
    </div>
}


export default MeasuringVoltage