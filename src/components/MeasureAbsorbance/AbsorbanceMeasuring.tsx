import { useEffect, useState } from 'react';
import styles from '../../styles/AbsorbanceMeasuring.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,MEASURE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import {startRgbExperiment,simulateRgb} from "../../labhub/actions";
import { useDeviceDataFeed } from '../../labhub/status';

const AbsorbanceMeasuring = () => {
    const navigate = useNavigate();
    const [dataStream] = useDeviceDataFeed();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [measure , setMeasure] = useState<any>([]);
    // const [measuredValue,setMeasuredValue] = useState<any>([]) //{Measuement No,RED,GREEN,BLUE}
    const [isOpen,setModal] = useState("");

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            navigate("/measure-absorbance")
            startRgbExperiment()
            setSelectedItem("")
        }else {
            simulateRgb(null)
            navigate("/rgb-spect")
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    useEffect(() => {
        if(dataStream?.rgb){
            setMeasure(dataStream?.rgb?.measure || [])
        }
    },[dataStream?.rgb])
    useEffect(() => {
        startRgbExperiment()
    },[])
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
                <div className={styles.SaveButton}>Save</div>
            </div>
            </div>
        </div>
        <RightArrow isSelected={true} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={ getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default AbsorbanceMeasuring