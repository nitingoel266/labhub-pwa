

import { useEffect, useRef, useState } from "react";
import {DataSetupIcon,IButtonIcon,TemperatureProbeIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";

const MethodSelection = () => {
    const heaterElementRef = useRef()
    const temperatureProbeRef = useRef()
    const navigate = useNavigate();
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const [iModalPostion,setIModalPosition] = useState<any>({})


    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem){
            // let mode = selectedItem.slice(0,selectedItem.indexOf(" ")).toLowerCase()
            // setSelectedMode(mode)
            navigate(selectedItem === "Heater Element" ? "/heater-element" : "/temperature-probe")
        }

    }
    useEffect(() => {
        // if(status?.modeSelected){
        //     let result = status.modeSelected[0].toUpperCase()+status.modeSelected.slice(1) + " Mode"
        //     setSelectedItem(result)
        // }
    },[navigate])
    const handleIModal = (title:string) => {
        const getRef:any = {
            'Heater Element':heaterElementRef,
            'Temperature Probe':temperatureProbeRef,
        }
        setModal(title)
        setIModalPosition({top:getRef[title] && getRef[title].current?.offsetTop})
    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
         <div className={styles.HeaderText}>
            <div style={{marginBottom:20,marginTop:20}}>Control Method</div>
        </div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:"Heater Element",ref:heaterElementRef},{icon:TemperatureProbeIcon,title:"Temperature Probe",ref:temperatureProbeRef}].map((el:any) => (
              <div key={el.title} ref={el.ref} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}}>
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10,marginRight:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} pos={iModalPostion} title={isOpen} description={IButtonContent[isOpen.replaceAll(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default MethodSelection