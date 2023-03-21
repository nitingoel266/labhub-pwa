import styles from '../styles/dataSetup.module.css';
import {useDeviceStatus} from "../labhub/status";
import {setupData} from "../labhub/actions";
// import {setSelectedFunction} from "../labhub/actions-client";
import { useEffect, useState } from 'react';
import RightArrow from './RightArrow';
import {BlackIButtonIcon} from "../images/index"
import { useNavigate } from 'react-router-dom';
import IButtonContent from './IButtonContent';
import IButtonComponent from './IButtonComponent';
import WheelPicker from './WheelPicker';

const DataSetup = () => {
    const [status] = useDeviceStatus();
    const clientId = localStorage.getItem('labhub_client_id');
    const navigate = useNavigate();
    const [isOpen,setModal] = useState<string>("");
    const [dataSetup,setDataSetup] = useState<any>({dataRate:'1 SEC',dataSample:5});
    const [dataRateOption] = useState<any>(['1 SEC','5 SEC','10 SEC','30 SEC','1 MIN','10 MIN','30 MIN','1 HOUR','USER'])
    const [dataSampleOption]= useState<any>([5,10,25,50,100,200,'CONT']);
    const isLeader = clientId === status?.leaderSelected ? true : false;
    const [getDataRate] = useState<any>({"1 SEC":1, '5 SEC':5, "10 SEC":10,'30 SEC':30,"60 SEC":60, "10 MIN":600 ,'30 MIN': 1800 ,'1 HOUR': 3600,'USER':'user'});
    const [getDataSample] = useState<any>({5:5,10:10,25:25,50:50,100:100,200:200,"CONT":'cont'})
    
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
    },[status?.setupData,getDataRate])
    const handleSubmit = () => {
        setupData({ dataRate:getDataRate[dataSetup.dataRate], dataSample:dataSetup.dataSample === 'CONT' ? 'cont' : dataSetup.dataSample })
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
            <div>Data Rate</div>
            <img onClick={() => handleIModal("Data Rate")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === 'Data Rate' && <IButtonComponent title={"Data Rate"} description={IButtonContent['Data_Rate']}/>}
        <div className={styles.DataRateWapper}>
            <WheelPicker data={dataRateOption.map((el:string,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataRateOption.indexOf(dataSetup?.dataRate)}`} handleData={(value:string) => handleDataSetup({dataRate:value})}/>
        </div>
        <div className={styles.RateMeasureRightSide}>
            <div>Number of samples</div>
            <img onClick={() => handleIModal("Number of samples")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
        </div>
        {isOpen === 'Number of samples' && <IButtonComponent title={"Number of samples"} description={IButtonContent["Number_of_samples"]}/>}
        <div className={styles.DataRateWapper}>
            <WheelPicker data={dataSampleOption.map((el:any,index:number) => ({id:`${index}`,value:el}))} selectedId={`${dataSampleOption.indexOf(dataSetup?.dataSample)}`} handleData={(value:any) => handleDataSetup({dataSample:value === 'CONT' ? value : Number(value)})}/>
        </div>
        <RightArrow isSelected={(getDataRate[dataSetup.dataRate] !== status?.setupData?.dataRate || getDataSample[dataSetup.dataSample] !== status?.setupData?.dataSample) && isLeader ? true : false} handleSubmit = {handleSubmit}/>
    </div>
}

export default DataSetup;