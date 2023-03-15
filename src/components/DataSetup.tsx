import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import {setSelectedFunction} from "../labhub/actions-client";
import { useEffect, useRef, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon,ExpandIcon,CollapsedIcon} from "../images/index"
import IButtonModal from './Modal/IButtonModal';
import { useNavigate } from 'react-router-dom';
import IButtonContent from './IButtonContent';

const DataSetup = () => {
    const dataRateRef = useRef<any>()
    const noOfSamplesRef = useRef<any>()
    const [status] = useDeviceStatus();
    const clientId = localStorage.getItem('labhub_client_id');
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("");
    const [iModalPostion,setIModalPosition] = useState<any>({})
    const [dataRateIndex,setDataRateIndex] = useState<number>(0)
    const [dataSampleIndex,setDataSampleIndex] = useState<number>(0)
    const [dataRateOption] = useState<any>(['1s','5s','10s','30s','1m','10m','30m','1h','user']/* ['0s','1s','5s','10s','30s','1m','10m','30m','1h'] */);
    const [dataSampleOption]= useState<any>([5,10,25,50,100,200,'cont']);
    const isLeader = clientId === status?.leaderSelected ? true : false;
    const [getDataRate] = useState<any>({"1s":1, '5s':5, "10s":10,'30s':30,"60s":60, "10m":600 ,'30m': 1800 ,'1h': 3600,'user':'user'});
    
    useEffect(() => {
        if(status?.setupData){
            let rate;
            for(let one in getDataRate){
                if(getDataRate[one] === status?.setupData?.dataRate){
                    rate = one;
                }
            }
            setDataRateIndex(dataRateOption.indexOf(rate || 0))
            setDataSampleIndex(dataSampleOption.indexOf(status?.setupData?.dataSample || 0))
        }
    },[navigate,status?.setupData,dataRateOption,dataSampleOption,getDataRate])
    const handleSubmit = () => {
        setupData({ dataRate:getDataRate[dataRateOption[dataRateIndex]], dataSample:dataSampleOption[dataSampleIndex] })
        setSelectedFunction(null)
        navigate(-1)
    }
    const handleDataRate = (title:string) => {
        if(title === 'sub' )
        setDataRateIndex((dataRateOption.length + dataRateIndex - 1)%dataRateOption.length)
        if(title === 'add')
        setDataRateIndex((dataRateIndex + 1)%dataRateOption.length)
    }
    const handleDataSample = (title:string) => {
        if(title === 'sub')
        setDataSampleIndex((dataSampleOption.length + dataSampleIndex - 1)%dataSampleOption.length)
        if(title === 'add')
        setDataSampleIndex((dataSampleIndex + 1)%dataSampleOption.length)
    }
    const handleIModal = (title:string) => {
        const getRef:any = {
            'Data Rate':dataRateRef,
            'Number of samples':noOfSamplesRef
        }
        setModal(title)
        setIModalPosition({left:getRef[title] && getRef[title].current?.offsetLeft, top:getRef[title] && getRef[title].current?.offsetTop - 170})
    }
    return <div className={styles.DataSetupWrapper}>
        <div style={{fontWeight:500}}>Setup</div>
        <div className={styles.RateMeasureRightSide}>
            <div>Data Rate</div>
            <img onClick={() => handleIModal("Data Rate")} ref={dataRateRef} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    {isLeader && <div onClick={() => isLeader ? handleDataRate('add') : {}} className={styles.OuterText}>{dataRateOption[(dataRateIndex + 1)%dataRateOption.length] || " "}</div>}
                    <div className={styles.DataMeasureButtom}>
                        {isLeader && <img onClick={() => isLeader ? handleDataRate('sub') : {}} src={ExpandIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="subtract"/>}
                        <div className={styles.TextStyle}>{dataRateOption[dataRateIndex]}</div>
                        {isLeader && <img onClick={() => isLeader ? handleDataRate('add') : {}} src={CollapsedIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="add"/>}
                    </div>
                    {isLeader && <div onClick={() => isLeader ? handleDataRate('sub') : {}} className={styles.OuterText}>{dataRateOption[(dataRateOption.length + dataRateIndex -1)%dataRateOption.length]}</div>}
                </div>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div>Number of samples</div>
            <img onClick={() => handleIModal("Number of samples")} ref={noOfSamplesRef} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    {isLeader && <div onClick={() => isLeader ? handleDataSample('add') : {}} className={styles.OuterText}>{dataSampleOption[(dataSampleIndex + 1)%dataSampleOption.length] || " "}</div>}
                    <div className={styles.DataMeasureButtom}>
                        {isLeader && <img onClick={() => isLeader ? handleDataSample('sub') : {}} src={ExpandIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="subtract"/>}
                        <div className={styles.TextStyle}>{dataSampleOption[dataSampleIndex]}</div>
                        {isLeader && <img onClick={() =>isLeader ? handleDataSample('add') : {}} src={CollapsedIcon} style={{cursor:isLeader ?"pointer" : "not-allowed"}} alt="add"/>}
                    </div>
                    {isLeader && <div onClick={() =>isLeader ? handleDataSample('sub') : {}} className={styles.OuterText}>{dataSampleOption[(dataSampleOption.length + dataSampleIndex -1)%dataSampleOption.length]}</div>}
            </div>
        </div>
        <RightArrow isSelected={dataRateIndex >=0 && dataSampleIndex >= 0 && isLeader ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} pos={iModalPostion} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
        
    </div>
}

export default DataSetup;