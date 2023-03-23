import { useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import {WhiteTickIcon} from "../../images/index";
import IButtonComponent from '../IButtonComponent';

const SpectrophotometerCalibration = () => {
    const navigate = useNavigate();
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
            // navigate("/spectrophotometer-calibration")
            setSelectedItem("")
        }else navigate("/calibration-testing") 

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
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
                    <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>
                </div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>
                    <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>
                </div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>
                    <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>
                </div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer calibrated successfully. You can test calibration now.</div>
        <RightArrow isSelected={true} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerCalibration