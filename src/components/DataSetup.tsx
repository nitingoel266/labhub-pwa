import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import {setSelectedFunction} from "../labhub/actions-client";
import { useEffect, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon,ExpandIcon,CollapsedIcon} from "../images/index"
import IButtonModal from './Modal/IButtonModal';
import { useNavigate } from 'react-router-dom';

const DataSetup = () => {
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("");
    const [dataRate,setDataRate] = useState<any>(0)
    const [dataSample,setNuOfSamples] = useState<any>(0)
    useEffect(() => {
        if(status?.setupData){
           setDataRate(status?.setupData?.dataRate || 0)
           setNuOfSamples(status?.setupData?.dataSample || 0)
        }
    },[navigate])
    const handleSubmit = () => {
        setupData({ dataRate, dataSample })
        setSelectedFunction(null)
        navigate(-1)
    }
    const handleDataRate = (title:string) => {
        if(title === 'sub' && dataRate > 0)
        setDataRate(dataRate - 1)
        if(title === 'add' && dataRate < 60)
        setDataRate(dataRate + 1)
    }
    const handleDataSample = (title:string) => {
        if(title === 'sub' && dataSample > 0)
        setNuOfSamples(dataSample - 1)
        if(title === 'add' && dataSample < 60)
        setNuOfSamples(dataSample + 1)
    }
    const getDescription:any = {
        "Data Rate":"Choose your desired data sampling rate: 1 s, 5 s, 10 s, 30 s, 	1 min, 10 min, 30 min, 1 hr, USER (manually select when each measurement is recorded).",
        "Number of samples":"Choose the number of samples to take: 5, 10, 	25, 50, 100, 200, CONT (no set endpoint)."
    }
    return <div className={styles.DataSetupWrapper}>
        <div style={{fontWeight:500}}>Setup</div>
        <div className={styles.DataRateWapper}>
            <div>Data Rate</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img onClick={() => handleDataRate('sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{dataRate}</div>
                    <img onClick={() => handleDataRate('add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => setModal("Data Rate")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <div className={styles.DataRateWapper}>
            <div>Number of samples</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img onClick={() => handleDataSample('sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{dataSample}</div>
                    <img onClick={() => handleDataSample('add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => setModal("Number of samples")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <RightArrow isSelected={dataRate && dataSample ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription[isOpen]} setModal={(value) => setModal(value)}/>
        
    </div>
}

export default DataSetup;