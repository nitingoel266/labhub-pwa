import { useState } from "react";
import {DataSetupIcon,IButtonIcon,RGBSpectIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import {setSelectedMode} from "../../labhub/actions-client"
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";

const SelectFunction = () => {
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
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default SelectFunction