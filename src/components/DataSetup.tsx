import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import { useEffect, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';
import IButtonComponent from './IButtonComponent';
import WheelPicker from './WheelPicker';
import {mobileWidth,getDataRate,getDataSample,getDescription,DATA_RATE,NO_OF_SAMPLES,dataRateOption,dataSampleOption} from "../components/Constants";
import IButtonModal from './Modal/IButtonModal';
import {LABHUB_CLIENT_ID} from "../utils/const";

const DataSetup = () => {
    const [status] = useDeviceStatus();
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [isOpen,setModal] = useState<string>("");
    const [dataSetup,setDataSetup] = useState<any>({dataRate:dataRateOption[0],dataSample:dataSampleOption[0]});
    const isLeader = clientId === status?.leaderSelected ? true : false;
    
    useEffect(() => {
        if(status?.setupData){
            let rate;
            for(let one in getDataRate){
                if(getDataRate[one] === status?.setupData?.dataRate){
                    rate = one;
                }
            }
            setDataSetup({dataRate:rate,dataSample:status?.setupData?.dataSample === 'cont' ? 'CONT' : status?.setupData?.dataSample})
        }
    },[status?.setupData])
    const handleSubmit = () => {
        setupData({ dataRate:getDataRate[dataSetup.dataRate], dataSample: getDataSample[dataSetup.dataSample]})
        // setSelectedFunction(null)
        navigate(-1)
    }
    const handleDataSetup = (value:any) => {
        let key = Object.keys(value)[0]
        if(dataSetup[key] !== value[key])
        setDataSetup((prevState:any) => {
            return {
                ...prevState,
                ...value
            }
        })
    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div className={styles.DataSetupWrapper}>
        <div style={{fontWeight:500}}>Setup</div>
        <div className={styles.RateMeasureRightSide}>
            <div>{DATA_RATE}</div>
            <img onClick={() => handleIModal(DATA_RATE)} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === DATA_RATE && isMobile && <IButtonComponent title={DATA_RATE} description={getDescription(DATA_RATE)} marginTop = {5}/>}
        <div className={styles.DataRateWapper}>
            <WheelPicker data={dataRateOption.map((el:string,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataRateOption.indexOf(dataSetup?.dataRate)}`} handleData={(value:string) => handleDataSetup({dataRate:value})}/>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div>{NO_OF_SAMPLES}</div>
            <img onClick={() => handleIModal(NO_OF_SAMPLES)} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === NO_OF_SAMPLES && isMobile && <IButtonComponent title={NO_OF_SAMPLES} description={getDescription(NO_OF_SAMPLES)} marginTop = {5}/>}
        <div className={styles.DataRateWapper}>
            <WheelPicker data={dataSampleOption.map((el:any,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataSampleOption.indexOf(dataSetup?.dataSample)}`} handleData={(value:any) => handleDataSetup({dataSample:value === 'CONT' ? value : Number(value)})}/>
        </div>
        <RightArrow isSelected={(getDataRate[dataSetup.dataRate] !== status?.setupData?.dataRate || getDataSample[dataSetup.dataSample] !== status?.setupData?.dataSample) && isLeader ? true : false} handleSubmit = {handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default DataSetup;