import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/InsertReferenceCuvette.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import { simulateRgb, startRgbExperiment } from '../../labhub/actions';
import {getClientId} from "../../labhub/utils";
import { useDeviceStatus } from '../../labhub/status';

const InsertReferenceCuvette = () => {
    const clientId = getClientId()
    const navigate = useNavigate();
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");

    const insertCuvetteRef:any = useRef(null)

    const clickHandler = () => {
        if(clientId === status?.leaderSelected){
            simulateRgb('calibrate')
            startRgbExperiment()
        }
        navigate("/spectrophotometer-calibration")
    }

    const handleSubmit = () => {
    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }

    useEffect(() => { // to set focus for acessibility
        insertCuvetteRef?.current?.focus()
      },[])
      
    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */>
        <h4 className={styles.HeaderText}><button aria-label="Please Insert Reference Cuvette and press calibrate" style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={insertCuvetteRef} >Please Insert Reference Cuvette and press calibrate</button></h4>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button}>
                 <button aria-label={`${CALIBRATE} ${getDescription(CALIBRATE)}`} onClick={() => clickHandler()} className={styles.SubButton}>
                    <p style={{ marginLeft: 10,fontSize:15,fontWeight:500 }}>{CALIBRATE}</p>
                 </button>
                 <div onClick={() => handleIModal(CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i icon"/>
                 </div>
             </div>
        </div>
        {isOpen === CALIBRATE && isMobile && <IButtonComponent title={CALIBRATE} description={getDescription(CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div aria-label='red ball' className={styles.BodyBollWrapper}>
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

export default InsertReferenceCuvette