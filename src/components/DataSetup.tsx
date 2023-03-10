import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import {setSelectedFunction} from "../labhub/actions-client";
import { useEffect, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon,ExpandIcon,CollapsedIcon} from "../images/index"
import IButtonModal from './Modal/IButtonModal';
import { useNavigate } from 'react-router-dom';
import IButtonContent from './IButtonContent';

const DataSetup = () => {
    const [status] = useDeviceStatus();
    const clientId = localStorage.getItem('labhub_client_id');
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("");
    const [dataRateIndex,setDataRateIndex] = useState<number>(0)
    const [dataSampleIndex,setDataSampleIndex] = useState<number>(0)
    const [dataRateOption] = useState<any>([1,5,10,30,60,600,1800,'user']/* ['0s','1s','5s','10s','30s','1m','10m','30m','1h'] */);
    const [dataSampleOption]= useState<any>([5,10,25,50,100,200,'cont']);
    const isLeader = clientId === status?.leaderSelected ? true : false;

    useEffect(() => {
        if(status?.setupData){
            setDataRateIndex(dataRateOption.indexOf(status?.setupData?.dataRate || 0))
            setDataSampleIndex(dataSampleOption.indexOf(status?.setupData?.dataSample || 0))
        }
    },[navigate,status?.setupData,dataRateOption,dataSampleOption])
    const handleSubmit = () => {
        setupData({ dataRate:dataRateOption[dataRateIndex], dataSample:dataSampleOption[dataSampleIndex] })
        setSelectedFunction(null)
        navigate(-1)
    }
    const handleDataRate = (title:string) => {
        if(title === 'sub' && dataRateIndex > 0)
        setDataRateIndex(dataRateIndex - 1)
        if(title === 'add' && dataRateIndex < dataRateOption.length-1)
        setDataRateIndex(dataRateIndex + 1)
    }
    const handleDataSample = (title:string) => {
        if(title === 'sub' && dataSampleIndex > 0)
        setDataSampleIndex(dataSampleIndex - 1)
        if(title === 'add' && dataSampleIndex < dataSampleOption.length-1)
        setDataSampleIndex(dataSampleIndex + 1)
    }
    return <div className={styles.DataSetupWrapper}>
        <div style={{fontWeight:500}}>Setup</div>
        <div className={styles.RateMeasureRightSide}>
            <div>Data Rate</div>
            <img onClick={() => setModal("Data Rate")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => isLeader ? handleDataRate('add') : {}} className={styles.OuterText}>{dataRateOption[dataRateIndex + 1] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => isLeader ? handleDataRate('sub') : {}} src={ExpandIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataRateOption[dataRateIndex]}</div>
                        <img onClick={() => isLeader ? handleDataRate('add') : {}} src={CollapsedIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="add"/>
                    </div>
                    <div onClick={() => isLeader ? handleDataRate('sub') : {}} className={styles.OuterText}>{dataRateOption[dataRateIndex -1]}</div>
                </div>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div>Number of samples</div>
            <img onClick={() => setModal("Number of samples")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => isLeader ? handleDataSample('add') : {}} className={styles.OuterText}>{dataSampleOption[dataSampleIndex + 1] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => isLeader ? handleDataSample('sub') : {}} src={ExpandIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataSampleOption[dataSampleIndex]}</div>
                        <img onClick={() =>isLeader ? handleDataSample('add') : {}} src={CollapsedIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="add"/>
                    </div>
                    <div onClick={() =>isLeader ? handleDataSample('sub') : {}} className={styles.OuterText}>{dataSampleOption[dataSampleIndex -1]}</div>
            </div>
        </div>
        <RightArrow isSelected={dataRateIndex >=0 && dataSampleIndex >= 0 && isLeader ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
        
    </div>
}

export default DataSetup;