

import { useState } from "react";
import {DataSetupIcon,IButtonIcon,SensorIcon,RGBSpectIcon,HeaterIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";
import {setSelectedFunction} from "../../labhub/actions-client";
// import {navStatus} from "../../labhub/status-client";
// import {useDeviceStatus} from "../../labhub/status";
import { useNavigate } from "react-router-dom";

const FunctionSelection = () => {
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const navigate = useNavigate();
    // const [status] = useDeviceStatus();
    // set the initial value from function selection
    // useEffect(() => {
    //     if(navStatus?.funcSelected){
    //         let result = []
    //         for(let one of navStatus.funcSelected.split("_")){
    //             result.push(one[0].toUpperCase()+one.slice(1))
    //         }
    //         setSelectedItem(result.join(" "))
    //     }
    // },[navigate,navStatus?.funcSelected])
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem){
            setSelectedFunction(selectedItem.replace(" ","_").toLowerCase())
            navigate(`/${selectedItem.replace(" ","-").toLowerCase()}`)
        }
    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        {[[{icon:DataSetupIcon,title:"Data Setup"},{icon:SensorIcon,title:"Sensor"}],[{icon:HeaterIcon,title:"Heater"},{icon:RGBSpectIcon,title:"RGB Spect"}]].map(e => (<div key={e[0]['title']} className={styles.ButtonWrapper}>
            {e.map(el => (
              <div key={el.title} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}} >
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => setModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>))}
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={IButtonContent[isOpen.replace(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default FunctionSelection