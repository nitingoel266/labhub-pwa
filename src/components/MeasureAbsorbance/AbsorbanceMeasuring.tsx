import { useEffect, useState } from 'react';
import styles from '../../styles/AbsorbanceMeasuring.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,MEASURE,HIGHLIGHT_BACKGROUND,getFileName,validateFileName,getDate,getTime,getStorageKeys} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import {startRgbExperiment,simulateRgb} from "../../labhub/actions";
import { useDeviceDataFeed, useDeviceStatus } from '../../labhub/status';
import { LABHUB_CLIENT_ID ,RGB_DATA} from "../../utils/const";

const AbsorbanceMeasuring = () => {
    const navigate = useNavigate();
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataFeed();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isSaved,setIsSaved] = useState<boolean>(false);
    const [measure , setMeasure] = useState<any>([]);
    const [measuredValue,setMeasuredValue] = useState<any>([]) //{Measuement No,RED,GREEN,BLUE}
    const [isOpen,setModal] = useState("");

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            navigate("/measure-absorbance")
            if(clientId === status?.leaderSelected){
                startRgbExperiment()
                setMeasuredValue((prevState:any) => {
                    return [...prevState,{"Measuement No":prevState.length,"RED":measure[0],"GREEN":measure[1],"BLUE":measure[2]}]
                })
            }
          
            setMeasure([])
            setSelectedItem("")
            setIsSaved(false)
        }else {
            if(clientId === status?.leaderSelected)
            simulateRgb(null)
            
            navigate("/rgb-spect")
        }

    }
    const handleSave = () => {
        let resultRGB = [...measuredValue];
        console.log("resultData",[...resultRGB])
        if(measure.length > 0){
            resultRGB.push({"Measuement No":measuredValue.length,"RED":measure[0],"GREEN":measure[1],"BLUE":measure[2]})
        }
        let fileName = "R" + getFileName();
        if(clientId === status?.leaderSelected){ // for leader
            fileName += "L";
        }else if(clientId){
            fileName += "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
        }
       
        let verifiedFileName = validateFileName(getStorageKeys(RGB_DATA),fileName);

        let resultData = {name:verifiedFileName,date:getDate(),time:getTime(),isCalibratedAndTested:true , data:resultRGB}
        let storageRGBData = JSON.stringify(resultData)
        localStorage.setItem(`${RGB_DATA}_${verifiedFileName}`, storageRGBData);
        setIsSaved(true)
        // console.log("???????????? resultData",resultData)
    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    useEffect(() => {
        if(dataStream?.rgb){
            setMeasure(dataStream?.rgb?.measure || [])
            // if(dataStream?.rgb?.measure && dataStream?.rgb?.measure[2]){
            //     setMeasuredValue((prevState:any) => {
            //         return [...prevState,{"Measuement No":prevState.length,"RED":dataStream?.rgb?.measure && dataStream?.rgb?.measure[0],"GREEN":dataStream?.rgb?.measure && dataStream?.rgb?.measure[1],"BLUE":dataStream?.rgb?.measure && dataStream?.rgb?.measure[2]}]
            //     })
            // }
            
        }
    },[dataStream?.rgb,measure])
    useEffect(() => {
        if(clientId === status?.leaderSelected)
        startRgbExperiment()
    },[clientId, status?.leaderSelected])
    // console.log("???????????? measuredValue",measuredValue)
    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={MEASURE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(MEASURE)} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{MEASURE}</div>
                 </div>
                 <div onClick={() => handleIModal(MEASURE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === MEASURE && isMobile && <IButtonComponent title={MEASURE} description={getDescription(MEASURE)}/>}
        <div className={styles.BodyWrapper}>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>{measure[0]}</div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>{measure[1]}</div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>{measure[2]}</div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterPlainText}>Values are in Absorbance units (AU)</div>
        <div className={styles.FooterTextWrapper}>
            <div className={styles.FooterInnerTextWrapper}>
            <div>TITLE</div>
            <div className={styles.FooterText}>
                <div>T0918564122-1123-7T09185...</div>
                <div className={styles.SaveButton} onClick={() => measure.length> 0 ? handleSave() : {}} style = {measure.length > 0 && !isSaved ? {} : {backgroundColor: "#989DA3",cursor:"not-allowed"}}>Save</div>
            </div>
            </div>
        </div>
        <RightArrow isSelected={true} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={ getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default AbsorbanceMeasuring