import { useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import IButtonContent from '../IButtonContent';

const SpectrophotometerTesting = () => {
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
            navigate("/rgb-spect")
        }

    }

    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div>
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
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default SpectrophotometerTesting