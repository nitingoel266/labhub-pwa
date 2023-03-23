import { useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,TEST_CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import MemberDisconnect from '../Modal/MemberDisconnectModal';

const SpectrophotometerTesting = () => {
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
            // navigate("/spectrophotometer-testing")
            setSelectedItem("")
        }else setModal("measure now")

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    const handleMeasure = () => {
        setModal("")
        navigate("/cuvette-insertion")
    }
    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(TEST_CALIBRATE)} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{TEST_CALIBRATE}</div>
                 </div>
                 <div onClick={() => handleIModal(TEST_CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === TEST_CALIBRATE && isMobile && <IButtonComponent title={TEST_CALIBRATE} description={getDescription(TEST_CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>0.1</div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>0.0</div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>0.1</div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer tested for calibration successfully.</div>
        <div className={styles.FooterText}>These values should be within the range of -0.2 to 0.2. If these values are outside of the range, please check with your teacher.</div>
        <MemberDisconnect isOpen={isOpen === 'measure now' ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={handleMeasure} message={`Do you want to ${isOpen}?`}/>
        <RightArrow isSelected={true} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen === TEST_CALIBRATE ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerTesting