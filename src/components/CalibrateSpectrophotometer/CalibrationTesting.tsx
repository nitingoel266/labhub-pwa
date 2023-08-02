import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/InsertReferenceCuvette.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,TEST_CALIBRATE,HIGHLIGHT_BACKGROUND, showLoader} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import {simulateRgb, startRgbExperiment} from "../../labhub/actions";
import {getClientId} from "../../labhub/utils";
import { useDeviceStatus } from '../../labhub/status';
import {delay} from "../../utils/utils";

const CalibrationTesting = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");

    const calibratedRef:any = useRef(null);

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = async () => {
        if(selectedItem){
            if(clientId === status?.leaderSelected){
                if(status?.rgbConnected !== "calibrate_test")
                simulateRgb('calibrate_test')
                startRgbExperiment()
            }
            await delay(1000)
            navigate("/spectrophotometer-testing")
            if(clientId === status?.leaderSelected)
            showLoader.next(true)
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }

    useEffect(() => { // to set focus for acessibility
        calibratedRef?.current?.focus()
      },[])

    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */>
        <h4 className={styles.HeaderHighLightText}><button aria-label="Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution." style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={calibratedRef} >Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution.</button></h4>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <button aria-label={`${TEST_CALIBRATE} ${getDescription(TEST_CALIBRATE)}`} onClick={() => clickHandler(TEST_CALIBRATE)} className={styles.SubButton} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                     <p style={{marginLeft:10,fontSize:15,fontWeight:500}}>{TEST_CALIBRATE}</p>
                 </button>
                 <div onClick={() => handleIModal(TEST_CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i icon"/>
                 </div>
             </div>
        </div>
        {isOpen === TEST_CALIBRATE && isMobile && <IButtonComponent title={TEST_CALIBRATE} description={getDescription(TEST_CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div aria-label='Red ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}></div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div aria-label='green ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}></div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div aria-label='blue ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}></div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && isOpen && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default CalibrationTesting