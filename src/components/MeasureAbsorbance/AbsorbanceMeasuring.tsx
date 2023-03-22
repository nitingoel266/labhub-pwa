import { useState } from 'react';
import styles from '../../styles/AbsorbanceMeasuring.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,MEASURE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';

const AbsorbanceMeasuring = () => {
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
            navigate("/rgb-spect")
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }

    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={MEASURE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(MEASURE)} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{MEASURE}</div>
                 </div>
                 <div onClick={() => handleIModal(MEASURE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === MEASURE && isMobile && <IButtonComponent title={MEASURE} description={getDescription(MEASURE)}/>}
        <div className={styles.BodyWrapper}>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>4.9</div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>0.0</div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>3.9</div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterPlainText}>Values are in Absorbance units (AU)</div>
        <div className={styles.FooterTextWrapper}>
            <div className={styles.FooterInnerTextWrapper}>
            <div>TITLE</div>
            <div className={styles.FooterText}>
                <div>T0918564122-1123-7T09185...</div>
                <div className={styles.SaveButton}>Save</div>
            </div>
            </div>
        </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={ getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default AbsorbanceMeasuring