

import { useRef, useState } from "react";
import {DataIcon,IButtonIcon,SensorIcon,RGBSpectIcon,HeaterIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import IButtonModal from "../../components/Modal/IButtonModal";
import {setSelectedFunction} from "../../labhub/actions-client";
// import {navStatus} from "../../labhub/status-client";
// import {useDeviceStatus} from "../../labhub/status";
import { useNavigate } from "react-router-dom";
import IButtonComponent from "../../components/IButtonComponent";
import {mobileWidth,SENSORS,HEATER,DATA_SETUP,RGB_SPECT,getDescription,HIGHLIGHT_BACKGROUND} from "../../components/Constants";

const FunctionSelection = () => {
    const dataSetUpRef = useRef()
    const sensorRef = useRef()
    const heaterRef = useRef()
    const rgbSpectRef = useRef()
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const navigate = useNavigate();
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
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        {[[{icon:DataIcon,title:DATA_SETUP,ref:dataSetUpRef},{icon:SensorIcon,title:SENSORS,ref:sensorRef}],[{icon:HeaterIcon,title:HEATER,ref:heaterRef},{icon:RGBSpectIcon,title:RGB_SPECT,ref:rgbSpectRef}]].map((e:any) => (<div key={e[0]['title']} className={styles.ButtonWrapper}>
            {e.map((el:any) => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
              <div ref={el.ref} className={styles.Button} style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}} >
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
             {isOpen === el.title && isMobile && <IButtonComponent title={el.title} description={getDescription(el?.title)}/>}
             </div>
            ))}
            </div>))}
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit = {handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default FunctionSelection