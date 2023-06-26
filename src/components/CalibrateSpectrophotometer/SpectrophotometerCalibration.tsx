import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import {WhiteTickIcon,WhiteCrossIcon} from "../../images/index";
import IButtonComponent from '../IButtonComponent';
import { useDeviceStatus } from '../../labhub/status';
import { calibrateRgb } from '../../labhub/actions';
import {getClientId} from "../../labhub/utils";

const SpectrophotometerCalibration = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [calibrate,setCalibrate] = useState<any>(null)
    const [isOpen,setModal] = useState("");

    const calibrateRef:any = useRef(null)

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            setSelectedItem("")
            if(clientId === status?.leaderSelected){
                setCalibrate(null)
                calibrateRgb()
            }
        }else navigate("/calibration-testing") 

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    // useEffect(() => {
    //     if(clientId === status?.leaderSelected)
    //     calibrateRgb()
    // },[clientId, status?.leaderSelected])
    useEffect(() => {
        if(status){
            setCalibrate(status?.rgbCalibrated)
        }
    },[status, status?.rgbCalibrated])

    useEffect(() => { // to set focus for acessibility
        calibrateRef?.current?.focus()
      },[])

    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc">
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <button ref={calibrateRef} aria-label={CALIBRATE +getDescription(CALIBRATE)} onClick={() => clickHandler(CALIBRATE)} className={styles.SubButton} style={CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                    <p style={{ marginLeft: 10,fontSize:15,fontWeight:500 }}>{CALIBRATE}</p>
                 </button>
                 <div onClick={() => handleIModal(CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === CALIBRATE && isMobile && <IButtonComponent title={CALIBRATE} description={getDescription(CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div aria-label='RED ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>
                    {calibrate && <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div aria-label='green ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>
                    {calibrate &&  <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div aria-label='blue ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>
                    {calibrate && <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer calibrated successfully. You can test calibration now.</div>
        <RightArrow isSelected={calibrate || selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && isOpen && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerCalibration