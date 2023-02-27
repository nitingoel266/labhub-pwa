import { useEffect, useState } from "react";
import {DataSetupIcon,IButtonIcon,RGBSpectIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import {setSelectedMode} from "../../labhub/actions"
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import {useDeviceStatus} from "../../labhub/status";

const SelectFunction = () => {
    const navigate = useNavigate();
    const [status] = useDeviceStatus();
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem){
            let mode = selectedItem.slice(0,selectedItem.indexOf(" ")).toLowerCase()
            setSelectedMode(mode)
            navigate(selectedItem === "Manual Mode" ? "/function-selection" : "/project-mode")
        }

    }
    // useEffect(() => {
    //     if(status?.modeSelected){
    //         let result = status.modeSelected[0].toUpperCase()+status.modeSelected.slice(1) + " Mode"
    //         setSelectedItem(result)
    //     }
    // },[navigate])
    const extraStyle = {backgroundColor:"#9CD5CD",maxWidth:220} 
    const getDescription:any = {"Manual Mode":"This mode requires you to choose which sensors to use and to set sampling rate and other data collection parameters.","Calibrate Spectrophotometer":"This mode is currently contains no any parameters."}
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:"Calibrate Spectrophotometer"},{icon:RGBSpectIcon,title:"Measure Absorbance"}].map(el => (
              <div key={el.title} className={styles.Button} style={el.title === selectedItem ? extraStyle : {maxWidth:220}}>
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => setModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription[isOpen]} setModal={(value) => setModal(value)}/>
    </div>
}

export default SelectFunction