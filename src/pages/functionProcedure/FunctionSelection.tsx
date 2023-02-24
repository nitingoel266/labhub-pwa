

import { useState } from "react";
import {DataSetupIcon,IButtonIcon,SensorIcon,RGBSpectIcon,HeaterIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";

const FunctionSelection = () => {
    const [selectedItem,setSelectedItem] = useState("")
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        {[[{icon:DataSetupIcon,title:"Data Setup"},{icon:SensorIcon,title:"Sensor"}],[{icon:HeaterIcon,title:"Heater"},{icon:RGBSpectIcon,title:"RGB Spect"}]].map(e => (<div key={e[0]['title']} className={styles.ButtonWrapper}>
            {e.map(el => (
              <div key={el.title} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}} onClick={() => clickHandler(el.title)}>
                 <div className={styles.SubButton}>
                     <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>))}
        <RightArrow isSelected={selectedItem ? true : false}/>
    </div>
}

export default FunctionSelection