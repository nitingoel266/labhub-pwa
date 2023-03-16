import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import {setSelectedFunction} from "../labhub/actions-client";
import { useEffect, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon,ExpandIcon,CollapsedIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';
import IButtonContent from './IButtonContent';
import IButtonComponent from './IButtonComponent';

const DataSetup = () => {
    const [status] = useDeviceStatus();
    const clientId = localStorage.getItem('labhub_client_id');
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [dataRateIndex,setDataRateIndex] = useState<number>(0)
    const [dataSampleIndex,setDataSampleIndex] = useState<number>(0)
    const [dataRateOption] = useState<any>(['1 SEC','5 SEC','10 SEC','30 SEC','1 MIN','10 MIN','30 MIN','1 HOUR','USER'])
    const [dataSampleOption]= useState<any>([5,10,25,50,100,200,'CONT']);
    const isLeader = clientId === status?.leaderSelected ? true : false;
    const [getDataRate] = useState<any>({"1 SEC":1, '5 SEC':5, "10 SEC":10,'30 SEC':30,"60 SEC":60, "10 MIN":600 ,'30 MIN': 1800 ,'1 HOUR': 3600,'USER':'user'});
    
    useEffect(() => {
        if(status?.setupData){
            let rate;
            for(let one in getDataRate){
                if(getDataRate[one] === status?.setupData?.dataRate){
                    rate = one;
                }
            }
            setDataRateIndex(dataRateOption.indexOf(rate || 0))
            setDataSampleIndex(dataSampleOption.indexOf((status?.setupData?.dataSample === 'cont' ? 'CONT' : status?.setupData?.dataSample) || 0))
        }
    },[navigate,status?.setupData,dataRateOption,dataSampleOption,getDataRate])
    const handleSubmit = () => {
        setupData({ dataRate:getDataRate[dataRateOption[dataRateIndex]], dataSample:dataSampleOption[dataSampleIndex] === 'CONT' ? 'cont' : dataSampleOption[dataSampleIndex] })
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
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div className={styles.DataSetupWrapper}>
        <div style={{fontWeight:500}}>Setup</div>
        <div className={styles.RateMeasureRightSide}>
            <div>Data Rate</div>
            <img onClick={() => handleIModal("Data Rate")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === 'Data Rate' && <IButtonComponent title={"Data Rate"} description={IButtonContent['Data_Rate']}/>}
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => handleDataRate('add')} className={styles.OuterText}>{dataRateOption[(dataRateIndex + 1)%dataRateOption.length] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => handleDataRate('sub')} src={ExpandIcon} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataRateOption[dataRateIndex]}</div>
                        <img onClick={() => handleDataRate('add') } src={CollapsedIcon} alt="add"/>
                    </div>
                    <div onClick={() => handleDataRate('sub')} className={styles.OuterText}>{dataRateOption[(dataRateOption.length + dataRateIndex -1)%dataRateOption.length]}</div>
                </div>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div>Number of samples</div>
            <img onClick={() => handleIModal("Number of samples")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === 'Number of samples' && <IButtonComponent title={"Number of samples"} description={IButtonContent["Number_of_samples"]}/>}
        <div className={styles.DataRateWapper}>
            <div className={styles.RateMeasureRightSideSubWrapper}>
                    <div onClick={() => handleDataSample('add')} className={styles.OuterText}>{dataSampleOption[(dataSampleIndex + 1)%dataSampleOption.length] || " "}</div>
                    <div className={styles.DataMeasureButtom}>
                        <img onClick={() => handleDataSample('sub')} src={ExpandIcon} alt="subtract"/>
                        <div className={styles.TextStyle}>{dataSampleOption[dataSampleIndex]}</div>
                        <img onClick={() =>handleDataSample('add')} src={CollapsedIcon} alt="add"/>
                    </div>
                    <div onClick={() =>handleDataSample('sub')} className={styles.OuterText}>{dataSampleOption[(dataSampleOption.length + dataSampleIndex -1)%dataSampleOption.length]}</div>
            </div>
        </div>
        <RightArrow isSelected={dataRateIndex >=0 && dataSampleIndex >= 0 && isLeader ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default DataSetup;