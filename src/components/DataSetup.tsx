import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
import {getClientId} from "../labhub/utils";
import { useEffect, useRef, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';
import IButtonComponent from './IButtonComponent';
import WheelPicker from './WheelPicker';
import {mobileWidth,getDataRate,getDataSample,getDescription,DATA_RATE,NO_OF_SAMPLES,dataRateOption,dataSampleOption,toastMessage} from "../components/Constants";
import IButtonModal from './Modal/IButtonModal';

const DataSetup = () => {
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [isOpen,setModal] = useState<string>("");
    const [dataSetup,setDataSetup] = useState<any>({dataRate:dataRateOption[0],dataSample:dataSampleOption[0]});
    const isLeader = clientId === status?.leaderSelected ? true : false;
    
    const setupRef:any = useRef(null);

    useEffect(() => {
        if(status?.setupData?.dataRate){
            let rate;
            for(let one in getDataRate){
                if(getDataRate[one] === status?.setupData?.dataRate){
                    rate = one;
                }
            }
            setDataSetup({dataRate:rate,dataSample:status?.setupData?.dataSample === 'cont' ? 'Continuous' : status?.setupData?.dataSample})
        }
    },[status?.setupData?.dataRate,status?.setupData?.dataSample])

    const handleSubmit = () => {
        setupData({ dataRate:getDataRate[dataSetup.dataRate], dataSample: getDataSample[dataSetup.dataSample]})
        // setSelectedFunction(null)
        toastMessage.next("Data configured successfully!")
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

    useEffect(() => { // to set focus for acessibility
        setupRef?.current?.focus()
      },[])

    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ className={styles.DataSetupWrapper}>
        <h4 style={{fontWeight:500}}><button aria-label="Setup" style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={setupRef} >Setup</button></h4>
        <div className={styles.RateMeasureRightSide}>
            <div aria-label={DATA_RATE + "title"} >{DATA_RATE}</div>
            <button
                aria-label={DATA_RATE + "i button"}
                style={{border:"none",outline:"none",backgroundColor:"inherit"}}
                onClick={() => handleIModal(DATA_RATE)}
            >
                <img  src={BlackIButtonIcon} className={styles.IButton} alt="i Icon"/>
            </button>
        </div>
        {isOpen === DATA_RATE && isMobile && <IButtonComponent title={DATA_RATE} description={getDescription(DATA_RATE)} marginTop = {5}/>}
        <div aria-label={DATA_RATE + "picker"} className={styles.DataRateWapper}>
            <WheelPicker data={dataRateOption.map((el:string,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataRateOption.indexOf(dataSetup?.dataRate)}`} handleData={(value:string) => handleDataSetup({dataRate:value})}/>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div aria-label={NO_OF_SAMPLES +"title"}>{NO_OF_SAMPLES}</div>
            <button
                aria-label={NO_OF_SAMPLES+"i button"}
                style={{border:"none",outline:"none",backgroundColor:"inherit"}}
                onClick={() => handleIModal(NO_OF_SAMPLES)}
            >
                <img  src={BlackIButtonIcon} className={styles.IButton} alt="i icon"/>
            </button>
        </div>
        {isOpen === NO_OF_SAMPLES && isMobile && <IButtonComponent title={NO_OF_SAMPLES} description={getDescription(NO_OF_SAMPLES)} marginTop = {5}/>}
        <div aria-label={NO_OF_SAMPLES + "picker"} className={styles.DataRateWapper}>
            <WheelPicker data={dataSampleOption.map((el:any,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataSampleOption.indexOf(dataSetup?.dataSample)}`} handleData={(value:any) => handleDataSetup({dataSample:value === 'Continuous' ? value : Number(value)})}/>
        </div>
        <RightArrow isSelected={(getDataRate[dataSetup.dataRate] !== status?.setupData?.dataRate || getDataSample[dataSetup.dataSample] !== status?.setupData?.dataSample) && isLeader ? true : false} handleSubmit = {handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default DataSetup;