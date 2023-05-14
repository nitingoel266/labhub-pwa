import { useState } from 'react';
import styles from '../../styles/InsertReferenceCuvette.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,TEST_CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import {simulateRgb, startRgbExperiment} from "../../labhub/actions";
import {getClientId} from "../../labhub/utils";
import { useDeviceStatus } from '../../labhub/status';

const CalibrationTesting = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            if(clientId === status?.leaderSelected){
                simulateRgb('calibrate_test')
                startRgbExperiment()
            }
            navigate("/spectrophotometer-testing")
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc">
        <h4 aria-label="Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution. header" className={styles.HeaderHighLightText}>Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution.</h4>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <button aria-label={TEST_CALIBRATE + "button"} onClick={() => clickHandler(TEST_CALIBRATE)} className={styles.SubButton} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                     <p style={{marginLeft:10,fontSize:15,fontWeight:500}}>{TEST_CALIBRATE}</p>
                 </button>
                 <button aria-label={TEST_CALIBRATE + "i button"} onClick={() => handleIModal(TEST_CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i icon"/>
                 </button>
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