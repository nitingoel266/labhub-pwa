import { useEffect, useState } from 'react';
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
import { LABHUB_CLIENT_ID } from "../../utils/const";

const SpectrophotometerCalibration = () => {
    const navigate = useNavigate();
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [calibrate,setCalibrate] = useState<any>(null)
    const [isOpen,setModal] = useState("");

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            // navigate("/spectrophotometer-calibration")
            setSelectedItem("")
            if(clientId === status?.leaderSelected)
            calibrateRgb()
        }else navigate("/calibration-testing") 

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    useEffect(() => {
        if(clientId === status?.leaderSelected)
        calibrateRgb()
    },[clientId, status?.leaderSelected])
    useEffect(() => {
        if(status){
            setCalibrate(status?.rgbCalibrated)
        }
    },[status, status?.rgbCalibrated])
    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(CALIBRATE)} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{CALIBRATE}</div>
                 </div>
                 <div onClick={() => handleIModal(CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === CALIBRATE && isMobile && <IButtonComponent title={CALIBRATE} description={getDescription(CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>
                    {calibrate !== null && <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>
                    {calibrate !== null &&  <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>
                    {calibrate !== null && <img src={calibrate ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer calibrated successfully. You can test calibration now.</div>
        <RightArrow isSelected={calibrate || selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerCalibration