import { useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import IButtonContent from '../IButtonContent';
import {WhiteTickIcon} from "../../images/index";

const SpectrophotometerCalibration = () => {
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
            navigate("/calibration-testing")
        }

    }

    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={"Calibrate" === selectedItem ? extraStyle : {}}>
                 <div onClick={() => clickHandler("Calibrate")} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{"Calibrate"}</div>
                 </div>
                 <div onClick={() => setModal("Calibrate")} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
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
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default SpectrophotometerCalibration