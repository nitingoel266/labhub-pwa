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
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("");
    const [dataRateIndex,setDataRateIndex] = useState<number>(0)
    const [dataSampleIndex,setDataSampleIndex] = useState<number>(0)
    const [dataRateOption] = useState<any>(['0s','1s','5s','10s','30s','1m','10m','30m','1h']);
    const [dataSampleOption]= useState<any>([0,5,10,25,50,100,200]);
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
        <div className={styles.DataRateWapper}>
            <div>Data Rate</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => handleDataRate('add')} className={styles.OuterText}>{dataRateOption[dataRateIndex + 1] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => handleDataRate('sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataRateOption[dataRateIndex]}</div>
                        <img onClick={() => handleDataRate('add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                    </div>
                    <div onClick={() => handleDataRate('sub')} className={styles.OuterText}>{dataRateOption[dataRateIndex -1]}</div>
                </div>
                <img onClick={() => setModal("Data Rate")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <div className={styles.DataRateWapper}>
            <div>Number of samples</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => handleDataSample('add')} className={styles.OuterText}>{dataSampleOption[dataSampleIndex + 1] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => handleDataSample('sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataSampleOption[dataSampleIndex]}</div>
                        <img onClick={() => handleDataSample('add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                    </div>
                    <div onClick={() => handleDataSample('sub')} className={styles.OuterText}>{dataSampleOption[dataSampleIndex -1]}</div>
                </div>
                <img onClick={() => setModal("Number of samples")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <RightArrow isSelected={dataRateIndex && dataSampleIndex ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
        
    </div>
}

export default DataSetup;