

import { useEffect, useRef, useState } from "react";
import {DataSetupIcon,IButtonIcon,TemperatureProbeIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import {mobileWidth,HEATER_ELEMENT,TEMPERATURE_PROBE,getDescription,HIGHLIGHT_BACKGROUND} from "../../components/Constants";
import IButtonComponent from "../../components/IButtonComponent";

const MethodSelection = () => {
    const heaterElementRef = useRef()
    const temperatureProbeRef = useRef()
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
            // let mode = selectedItem.slice(0,selectedItem.indexOf(" ")).toLowerCase()
            // setSelectedMode(mode)
            navigate(selectedItem === HEATER_ELEMENT ? "/heater-element" : "/temperature-probe")
        }

    }
    useEffect(() => {
        // if(status?.modeSelected){
        //     let result = status.modeSelected[0].toUpperCase()+status.modeSelected.slice(1) + " Mode"
        //     setSelectedItem(result)
        // }
    },[navigate])
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    return <div style={{position:"relative"}}>
         <div className={styles.HeaderText}>
            <div style={{marginBottom:20,marginTop:20}}>Control Method</div>
        </div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:HEATER_ELEMENT,ref:heaterElementRef},{icon:TemperatureProbeIcon,title:TEMPERATURE_PROBE,ref:temperatureProbeRef}].map((el:any) => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
              <div ref={el.ref} className={styles.Button} style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10,marginRight:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
             {isOpen === el.title && isMobile && <IButtonComponent title={el.title} description={getDescription(el?.title)}/>}
                </div>
            ))}
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default MethodSelection