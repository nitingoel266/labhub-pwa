import styles from '../styles/measuringTemprature.module.css';
import RightArrow from './RightArrow';
import { useEffect, useState } from 'react';
import {useDeviceStatus, useDeviceDataFeed} from "../labhub/status";
import {startSensorExperiment,stopSensorExperiment} from "../labhub/actions";
import MemberDisconnect from './Modal/MemberDisconnectModal';
import TemperatureGraph from './Graphs/TemperatureGraph';
import {getFileName,getDate,getTime,validateFileName} from "./Constants";
import {LABHUB_CLIENT_ID,TEMPERATURE_DATA} from "../utils/const";
import Header from './header';

const MeasuringTemprature = () => {
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataFeed();
    const [isOpen,setModal] = useState<string>("");
    const [isSaved,setIsSaved] = useState<boolean>(false);
    const [isStart,setIsStart] = useState<boolean>(false);
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
        setIsStart(true)
    }
    const handleStop = () => {
        setModal("")
        stopSensorExperiment()
        setIsStart(false)
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
        let fileName = "T" + getFileName();
        if(clientId === status?.leaderSelected){ // for leader
            fileName += "L";
        }else if(clientId){
            fileName += "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        }
        let tempStorageData = localStorage.getItem(TEMPERATURE_DATA);
        let tempData = tempStorageData ? JSON.parse(tempStorageData) : []; 
       
        let resultData = {name: validateFileName(tempData,fileName) ,date:getDate(),time:getTime(), data:resultTemperature}
        let storageTempData = JSON.stringify([...tempData,resultData])
        localStorage.setItem(TEMPERATURE_DATA, storageTempData);
        // console.log("save the data in record section ",resultTemperature,fileName)
        //save the temperature in labhub device in celcis mode
    }
    useEffect(() => { // dataStream.sensor.temperatureLog can be use for member to get prev data
        if(dataStream && dataStream.sensor && dataStream.sensor.temperature && clientId === status?.leaderSelected){
            setGraphData((prevData:any) => {
                return [...prevData,{time:prevData.length * Number(status?.setupData?.dataRate === 'user' ? 1 : status?.setupData?.dataRate),temp:dataStream.sensor?.temperature}]
            })
            setCapturePoint((prevData:any) => [...prevData,status?.setupData?.dataRate === 'user' ? 0 : 2])
        }else if(clientId !== status?.leaderSelected && dataStream){
            let logData = [],capturePoint=[];
            if(dataStream?.sensor?.temperatureLog){
                for(let one in dataStream.sensor.temperatureLog){
                    if(Number(one) > 0){
                        logData.push({time: Number(one) * Number(status?.setupData?.dataRate === 'user' ? 1 : status?.setupData?.dataRate),temp:dataStream.sensor.temperatureLog[one]});
                        capturePoint.push(status?.setupData?.dataRate === 'user' ? 0 : 2)
                    }
                }
                setGraphData(logData)
                setCapturePoint(capturePoint)
            }
        }
    },[dataStream, dataStream?.sensor?.temperature,status?.setupData?.dataRate,clientId, status?.leaderSelected])
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
    useEffect(() => {
        if(dataStream.sensor === null){
            setIsStart(false)
        }else if(dataStream?.sensor?.temperature && !isStart){ // for test-screen
            setIsStart(true)
        }
    },[dataStream?.sensor,isStart])
    const extraStyle = {backgroundColor: "#989DA3",cursor:"not-allowed"};
    return <>
    <Header />
    <div className={styles.TopWrapper}>
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
                <div onClick={() => clientId === status?.leaderSelected ? setModal(graphData?.length ? 'restart' : "start") : {}} className={styles.RestartButton} style={(isStart || clientId !== status?.leaderSelected) ? extraStyle : {}}>{(isStart || graphData?.length) ? "Restart" : "Start"}</div>
                <div onClick={() => clientId === status?.leaderSelected && isStart ? setModal('stop') : {}} className={styles.StopButton} style={(!isStart || clientId !== status?.leaderSelected) ? extraStyle : {}}>Stop</div>
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
                <div onClick={() => clientId === status?.leaderSelected ? setModal(graphData?.length ? 'restart' : "start") : {}} className={styles.RestartHorizontalButton} style={(isStart || clientId !== status?.leaderSelected) ? extraStyle : {}}>{graphData?.length ? "Restart" : "Start"}</div>
                <div onClick={() => clientId === status?.leaderSelected && isStart ? setModal('stop') : {}} className={styles.StopHorizontalButton} style={(!isStart || clientId !== status?.leaderSelected) ? extraStyle : {}}>Stop</div>
                <div className={styles.CaptureHorizontalButton} onClick={handleCapture}>Capture</div>
            </div>
        </div> : null}
        <MemberDisconnect isOpen={isOpen ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={(isOpen === 'restart' || isOpen === 'start') ? handleRestart : handleStop} message={`Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={capturePoint?.some((el:number) => el > 0) ? true : false} handleSubmit={handleSubmit}/>
    </div>
    </>
}

export default MeasuringTemprature