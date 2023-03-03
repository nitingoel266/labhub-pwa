import styles from '../styles/measuringTemprature.module.css';
import RightArrow from './RightArrow';
import { useEffect, useState } from 'react';
import {useDeviceStatus} from "../labhub/status";
import MemberDisconnect from './Modal/MemberDisconnectModal';
import { useNavigate } from 'react-router-dom';
import TemperatureGraph from './Graphs/TemperatureGraph';

const MeasuringTemprature = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [temprature,setTemprature] = useState<any>(0)
    const [isMobile,setIsMobile] = useState<boolean>(false)
    const [tempratureUnit,setTempratureUnit] = useState<string>('c');
    const graphData = [
        {id:1,x:1,y:9},
        {id:2,x:2,y:9.2},
        {id:3,x:3,y:4.5},
        {id:4,x:4,y:6},
        {id:4,x:5,y:10},
        {id:4,x:6,y:1.5},
        {id:4,x:7,y:3},
        {id:4,x:8,y:8.9},
        {id:4,x:9,y:9},
        {id:4,x:10,y:7},

    ]
    const handleSubmit = () => {

    }
    const handleRestart = () => {
        setTemprature(0)
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
            <div style={{fontWeight:500}}>Measuring Temperature</div>
            <div className={styles.HeaderRightWrapper}>
                <div onClick={() => setTempratureUnit('f')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'f' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}}>
                    <div>F</div>
                    <div className={styles.TempratureDegreeIcon} style={{border:`1px solid ${tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}`}}>{" "}</div>
                </div>
                <div onClick={() => setTempratureUnit('c')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'c' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'c' ? '#FFFFFF' : "#000000"}}>
                    <div>C</div>
                    <div className={styles.TempratureDegreeIcon} style={{border:`1px solid ${tempratureUnit === 'c' ? '#FFFFFF' : "#000000"}`}}>{" "}</div>
                </div>
            </div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
            <div>Temperature Value in </div>
            <div className={styles.DegreeStyle}>{" "}</div>
            <div>{tempratureUnit.toUpperCase()}</div>
        </div>
        <div className={styles.TextBody}>
            <div className={styles.GraphStyle}>
                <TemperatureGraph data={graphData}/>
            </div>
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
        <RightArrow isSelected={temprature ? true : false} handleSubmit={handleSubmit}/>
    </div>
}

export default MeasuringTemprature