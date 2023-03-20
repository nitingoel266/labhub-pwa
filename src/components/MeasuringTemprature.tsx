import styles from '../styles/measuringTemprature.module.css';
import RightArrow from './RightArrow';
import { useEffect, useState } from 'react';
import {useDeviceStatus, useDeviceDataFeed} from "../labhub/status";
import {startSensorExperiment} from "../labhub/actions";
import MemberDisconnect from './Modal/MemberDisconnectModal';
import { useNavigate } from 'react-router-dom';
import TemperatureGraph from './Graphs/TemperatureGraph';

const MeasuringTemprature = () => {
    const clientId = localStorage.getItem('labhub_client_id');
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataFeed();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [isSaved,setIsSaved] = useState<boolean>(false);
    const [capturePoint, setCapturePoint] = useState<any>([]);

    const [isMobile,setIsMobile] = useState<boolean>(false)
    const [tempratureUnit,setTempratureUnit] = useState<string>('c');
    const [graphData,setGraphData] = useState<any>([]) // {time:in sec,temp}

    const handleTemperatureUnit = (title:string) => {
        if(title === 'f' && tempratureUnit !== title){
            let updatedTemp = [];
            for(let one of graphData){
                if(one && one.temp){
                    let fahrenheit = ((9/5 * one.temp) + 32).toFixed(1);
                    updatedTemp.push({...one,temp:fahrenheit})
                }
            }
            setGraphData(updatedTemp)
            setTempratureUnit(title)
        }else if(title === 'c' && tempratureUnit !== title){
            let updatedTemp = [];
            for(let one of graphData){
                if(one && one.temp){
                    let celcius = (((one.temp-32)*5)/9).toFixed(1);
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
        setCapturePoint([])
        startSensorExperiment()
        setModal("")
    }
    const handleStop = () => {
        setModal("")
        navigate(-1)
    }
    const handleCapture = () => {
        if(graphData){
            setIsSaved(false)
            let items = [...capturePoint];
            items[graphData.length-1] = 2;
            setCapturePoint(items)
        }
    }
    const handleSave = () => {
        setIsSaved(true)
        let resultTemperature = [];
        for(let one in capturePoint){
            if(capturePoint[one] > 0){
                let item = graphData[one];
                if(tempratureUnit === 'f')
                item = {...item,temp:Number(((item?.temp-32)*5/9).toFixed(1))}
                resultTemperature.push(item)
            }
        }
        // console.log("save the data in record section ",resultTemperature)
        //save the temperature in labhub device in celcis mode
    }
    useEffect(() => {
        if(dataStream && dataStream.sensor && dataStream.sensor.temperature){
            setGraphData((prevData:any) => {
                return [...prevData,{time:prevData.length * Number(status?.setupData?.dataRate === 'user' ? 1 : status?.setupData?.dataRate),temp:dataStream.sensor?.temperature}]
            })
            setCapturePoint((prevData:any) => [...prevData,status?.setupData?.dataRate === 'user' ? 0 : 2])
        }
    },[dataStream, dataStream?.sensor?.temperature,status?.setupData?.dataRate])
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
                <div onClick={() => handleTemperatureUnit('c')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'c' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'c' ? '#FFFFFF' : "#000000"}}>
                    <div>C</div>
                    <div className={styles.TempratureDegreeIcon} style={{border:`1px solid ${tempratureUnit === 'c' ? '#FFFFFF' : "#000000"}`}}>{" "}</div>
                </div>
                <div onClick={() => handleTemperatureUnit('f')} className={styles.TempratureDegree} style={{backgroundColor: tempratureUnit === 'f' ? "#424C58" : "#9CD5CD",color:tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}}>
                    <div>F</div>
                    <div className={styles.TempratureDegreeIcon} style={{border:`1px solid ${tempratureUnit === 'f' ? '#FFFFFF' : "#000000"}`}}>{" "}</div>
                </div>
            </div>
        </div>
        <div className={styles.SecondaryHeaderWrapper}>
            <div>Temperature Value : {graphData[graphData.length -1]?.temp}</div>
            <div className={styles.DegreeStyle}>{" "}</div>
            <div>{tempratureUnit.toUpperCase()}</div>
        </div>
        <div className={styles.TextBody}>
            <div className={styles.GraphStyle}>
                <TemperatureGraph data={graphData} showPoint={status?.setupData?.dataRate === 'user' ? false : true} capturePoint={capturePoint} title={"Temperature"}/>
            </div>
            {!isMobile ? <div className={styles.ButtonWrapper}>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('restart') : {}} className={styles.RestartButton} style={extraStyle}>Restart</div>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.StopButton} style={extraStyle}>Stop</div>
                {status?.setupData?.dataRate === 'user'  && <div className={styles.CaptureButton} onClick={handleCapture}>Capture</div>}

            </div> : null}
        </div>
        <div className={styles.FooterTextWrapper}>
            <div className={styles.FooterInnerTextWrapper}>
            <div>TITLE</div>
            <div className={styles.FooterText}>
                <div>T101722-1334-M4</div>
                <div className={styles.SaveButton} style={capturePoint?.some((el:number) => el > 0) <= 0  ? {backgroundColor:"#A0A5AB"} : {}} onClick={() => capturePoint?.length > 0 ? handleSave() : {}}>Save</div>
            </div>
            </div>
        </div>
        {isMobile ? <div className={styles.ButtonHorizontalWrapper}>
            <div className={styles.ButtonHorizontalInnerWrapper}>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('restart') : {}} className={styles.RestartHorizontalButton} style={extraStyle}>Restart</div>
                <div onClick={() => clientId === status?.leaderSelected ? setModal('stop') : {}} className={styles.StopHorizontalButton} style={extraStyle}>Stop</div>
                <div className={styles.CaptureHorizontalButton} onClick={handleCapture}>Capture</div>
            </div>
        </div> : null}
        <MemberDisconnect isOpen={isOpen ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'restart' ? handleRestart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={capturePoint?.some((el:number) => el > 0) ? true : false} handleSubmit={handleSubmit}/>
    </div>
}

export default MeasuringTemprature