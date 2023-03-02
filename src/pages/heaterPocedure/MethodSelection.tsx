

import { useEffect, useState } from "react";
import {DataSetupIcon,IButtonIcon,TemperatureProbeIcon,CollapsedIcon,ExpandIcon,BlackIButtonIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";

let temperatureTimmer:any;

const MethodSelection = () => {
    const navigate = useNavigate();
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const [temperature,setTemperature] =useState<number>(0);
    const [temperatureShouldBe,setTemperatureShouldBe] =useState<number>(0);

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleTemperature = (title:string) => {
        if(title === 'sub' && temperature > 0)
        setTemperature((temp) => temp > 0 ? temp - 1 : temp)
        if(title === 'add' && temperature < 100)
        setTemperature((temp) => temp <100 ? temp + 1 : temp)
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
    const handleMouseDownEvent = (event:string,title:string) => {
        if(title === 'add'){
            if(event === 'enter'){
                temperatureTimmer = setInterval(() =>handleTemperature(title),100)
                setTemperatureShouldBe(temperature +1)
            }
             if(event === 'leave'){
                 clearInterval(temperatureTimmer)
                if(temperatureShouldBe > temperature) handleTemperature(title)
                setTemperatureShouldBe(0)
             }
        }
        if(title === 'sub'){
            if(event === 'enter'){
                temperatureTimmer = setInterval(() => handleTemperature(title),100)
                setTemperatureShouldBe(temperature - 1)
            }
             if(event === 'leave'){
                 clearInterval(temperatureTimmer)
                 if(temperatureShouldBe < temperature) handleTemperature(title)
                setTemperatureShouldBe(0)
             }
        }
    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
         <div className={styles.HeaderTextWrapper}>
            <div>Setpoint Temperature</div>
            <div className={styles.RateMeasureRightSide}>
                <div className={styles.DataMeasureButtom}>
                    <img /* onClick={() => handleTemperature('sub')} */ onMouseDown={() => handleMouseDownEvent('enter','sub')} onMouseUp={() => handleMouseDownEvent('leave','sub')} src={ExpandIcon} style={{cursor:"pointer"}} alt="subtract"/>
                    <div className={styles.TextStyle}>{temperature}</div>
                    <img /* onClick={() => handleTemperature('add')} */ onMouseDown={() => handleMouseDownEvent('enter','add')} onMouseUp={() => handleMouseDownEvent('leave','add')} src={CollapsedIcon} style={{cursor:"pointer"}} alt="add"/>
                </div>
                <img onClick={() => setModal("Setpoint Temperature")} src={BlackIButtonIcon} className={styles.IButton} alt="i Button"/>
            </div>
        </div>
        <div className={styles.HeaderSubText}>CONTROL METHOD</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:"Heater Element"},{icon:TemperatureProbeIcon,title:"Temperature Probe"}].map(el => (
              <div key={el.title} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}}>
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10,marginRight:10}}>{el.title}</div>
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

export default MethodSelection