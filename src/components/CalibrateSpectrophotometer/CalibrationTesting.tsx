import { useState } from 'react';
import styles from '../../styles/InsertReferenceCuvette.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,TEST_CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';

const CalibrationTesting = () => {
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
            navigate("/spectrophotometer-testing")
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div>
        <div className={styles.HeaderHighLightText}>Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution.</div>
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
                <div className={styles.BodyRedBoll}></div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}></div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}></div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default CalibrationTesting