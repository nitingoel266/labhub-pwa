import styles from '../styles/measuringTemprature.module.css';
import RightArrow from './RightArrow';
import { useEffect, useState } from 'react';
import {useDeviceStatus, useDeviceDataStream} from "../labhub/status";
import {startSensorExperiment} from "../labhub/actions";
import MemberDisconnect from './Modal/MemberDisconnectModal';
import { useNavigate } from 'react-router-dom';
import TemperatureGraph from './Graphs/TemperatureGraph';

const MeasuringTemprature = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataStream();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [temprature,setTemprature] = useState<any>(0)
    const [isMobile,setIsMobile] = useState<boolean>(false)
    const [tempratureUnit,setTempratureUnit] = useState<string>('c');
    const [graphData,setGraphData] = useState<any>([
        {time:0,temp:10},
        {time:1,temp:20},
        {time:2,temp:25},
        {time:3,temp:35},
        {time:4,temp:40},
        {time:5,temp:45},
        {time:6,temp:50},
        {time:7,temp:21},
        {time:8,temp:11},
        {time:9,temp:31},

    ]) // {time:in sec,temp}

    const handleTemperatureUnit = (title:string) => {
        if(title === 'f' && tempratureUnit !== title){
            let updatedTemp = [];
            for(let one of graphData){
                if(one && one.temp){
                    let fahrenheit = ((9/5 * one.temp) + 32).toFixed(0);
                    updatedTemp.push({...one,temp:fahrenheit})
                }
            }
            setGraphData(updatedTemp)
            setTempratureUnit(title)
        }else if(title === 'c' && tempratureUnit !== title){
            let updatedTemp = [];
            for(let one of graphData){
                if(one && one.temp){
                    let celcius = (((one.temp-32)*5)/9).toFixed(0);
                    updatedTemp.push({...one,temp:celcius})
                }
            }
            setGraphData(updatedTemp)
            setTempratureUnit(title)
        }
    }
    const handleSubmit = () => {

    }
    const handleRestart = () => {
        setGraphData([])
        // startSensorExperiment()
        setModal("")
    }
    const handleStop = () => {
        setModal("")
        navigate(-1)
    }
    const handleCapture = (value:any) => {
        setTemprature(value)
    }
    const handleSave = () => {
        let resultTemperature = temprature;
        if(resultTemperature && tempratureUnit === 'f'){
            resultTemperature = (((resultTemperature-32)*5)/9).toFixed(0);
        }
        //save the temperature in labhub device in celcis mode
    }
    useEffect(() => {
        if(dataStream && dataStream.temperature)
        setGraphData((prevData:any) => {
            return [...prevData,{time:prevData.length * Number(status?.setupData?.dataRate),temp:dataStream.temperature}]
        })
    },[dataStream, dataStream?.temperature,status?.setupData?.dataRate])
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
                <div onClick={() => handleTemperatureUnit('f')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'f' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}}>
                    <div>F</div>
                    <div className={styles.TempratureDegreeIcon} style={{border:`1px solid ${tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}`}}>{" "}</div>
                </div>
                <div onClick={() => handleTemperatureUnit('c')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'c' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'c' ? '#FFFFFF' : "#000000"}}>
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
                <TemperatureGraph data={graphData} showPoint={false}/>
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