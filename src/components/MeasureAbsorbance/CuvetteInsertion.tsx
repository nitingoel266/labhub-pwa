import { useState } from 'react';
import styles from '../../styles/CuvetteInsertion.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import IButtonContent from '../IButtonContent';

const CuvetteInsertion = () => {
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
            navigate("/absorbance-insertion")
        }

    }

    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div>
        <div className={styles.HeaderText}>Please insert cuvette to measure absorbance of RGB light.</div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={"Measure" === selectedItem ? extraStyle : {}}>
                 <div onClick={() => clickHandler("Measure")} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{"Measure"}</div>
                 </div>
                 <div onClick={() => setModal("Measure")} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        <div className={styles.SecondaryText}>Values are in Absorbance units (AU)</div>
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
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default CuvetteInsertion