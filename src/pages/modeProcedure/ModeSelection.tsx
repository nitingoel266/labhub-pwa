

import { useState } from "react";
import {DataSetupIcon,IButtonIcon,SensorIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../RightArrow";
import {setSelectedMode} from "../../labhub/actions"
import { useNavigate } from "react-router-dom";

const ModeSelection = () => {
    const navigate = useNavigate();
    const [selectedItem,setSelectedItem] = useState<any>("")
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem){
            setSelectedMode(selectedItem)
            navigate(selectedItem === "Manual Mode" ? "/function-selection" : "/project-mode")
        }

    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:"Manual Mode"},{icon:SensorIcon,title:"Project Mode"}].map(el => (
              <div className={styles.Button} style={el.title === selectedItem ? extraStyle : {}} onClick={() => clickHandler(el.title)}>
                 <div className={styles.SubButton}>
                     <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
    </div>
}

export default ModeSelection