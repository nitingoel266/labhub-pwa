

import { useEffect, useRef, useState } from "react";
import {DataSetupIcon,IButtonIcon,TemperatureProbeIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import {mobileWidth,HEATER_ELEMENT,TEMPERATURE_PROBE,getDescription,HIGHLIGHT_BACKGROUND} from "../../components/Constants";
import IButtonComponent from "../../components/IButtonComponent";
import { useDeviceStatus } from "../../labhub/status";
import SensorDisconnectModal from "../../components/Modal/SensorDisconnectModal";

const MethodSelection = () => {
    const navigate = useNavigate();
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");

    const controlMethodRef:any = useRef(null);

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

    const handleSensorDisconnected = (value:any) => {
        setModal(value)
        navigate("/heater")
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

    useEffect(() => { // stop probe experiment and show a modal that sensor disconnected and for go back
        if(status?.heaterConnected === null){
          setModal("Heater isn't Connected!")
        }else if(status?.heaterConnected !== null){
          setModal("")
        }
      },[status?.heaterConnected,status?.operation])

      useEffect(() => { // to set focus for acessibility
        controlMethodRef?.current?.focus()
      },[])
    
    return <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" style={{position:"relative"}}>
            <h4 className={styles.HeaderText} style={{marginBottom:25,marginTop:40}}><button aria-label="Control Method" style={{outline:"none",border:"none",fontSize:16,fontWeight:550,marginBottom:10}} ref={controlMethodRef} >Control Method</button></h4>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:HEATER_ELEMENT},{icon:TemperatureProbeIcon,title:TEMPERATURE_PROBE}].map((el:any) => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
              <div className={styles.Button} style={el.title === selectedItem ? {...HIGHLIGHT_BACKGROUND,maxWidth:235} : {maxWidth:235}}>
                 <button aria-label={el.title + getDescription(el?.title)} onClick={() => clickHandler(el.title)} className={styles.SubButton} style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <p style={{ marginLeft: 10,fontSize:14,fontWeight:500,marginRight:8 }}>{el.title}</p>
                 </button>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt={el.title + "i icon"}/>
                 </div>
             </div>
             {isOpen === el.title && isMobile && <IButtonComponent title={el.title} description={getDescription(el?.title)}/>}
                </div>
            ))}
            </div>
            {isOpen === "Heater isn't Connected!" && <SensorDisconnectModal 
             isOpen={isOpen ? true : false}
             setModal={(value) => handleSensorDisconnected(value)}
             message="Heater isn't Connected!"
        />}
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && isOpen && isOpen !== "Heater isn't Connected!" && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default MethodSelection