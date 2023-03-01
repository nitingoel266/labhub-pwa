import { useState } from 'react';
import styles from '../../styles/InsertReferenceCuvette.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import IButtonContent from '../IButtonContent';

const CalibrationTesting = () => {
    const navigate = useNavigate();
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

    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div>
        <div className={styles.HeaderHighLightText}>Spectrophotometer calibrated successfully. Test calibration by measuring absorbance of reference solution.</div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={"Test Calibrate" === selectedItem ? extraStyle : {}}>
                 <div onClick={() => clickHandler("Test Calibrate")} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{"Test Calibrate"}</div>
                 </div>
                 <div onClick={() => setModal("Test Calibrate")} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
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
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default CalibrationTesting