

import { useRef, useState } from "react";
import {DataIcon,IButtonIcon,SensorIcon,RGBSpectIcon,HeaterIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";
import {setSelectedFunction} from "../../labhub/actions-client";
// import {navStatus} from "../../labhub/status-client";
// import {useDeviceStatus} from "../../labhub/status";
import { useNavigate } from "react-router-dom";

const FunctionSelection = () => {
    const dataSetUpRef = useRef()
    const sensorRef = useRef()
    const heaterRef = useRef()
    const rgbSpectRef = useRef()
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");
    const [iModalPostion,setIModalPosition] = useState<any>({})
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
    const handleIModal = (title:string) => {
        const getRef:any = {
            'Data Setup':dataSetUpRef,
            'Sensor':sensorRef,
            "Heater":heaterRef,
            "RGB Spect":rgbSpectRef
        }
        setModal(title)
        setIModalPosition({top:getRef[title] && getRef[title].current?.offsetTop})
    }
    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        {[[{icon:DataIcon,title:"Data Setup",ref:dataSetUpRef},{icon:SensorIcon,title:"Sensor",ref:sensorRef}],[{icon:HeaterIcon,title:"Heater",ref:heaterRef},{icon:RGBSpectIcon,title:"RGB Spect",ref:rgbSpectRef}]].map((e:any) => (<div key={e[0]['title']} className={styles.ButtonWrapper}>
            {e.map((el:any) => (
              <div key={el.title} ref={el.ref} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}} >
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10}}>{el.title}</div>
                 </div>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
            ))}
            </div>))}
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit = {handleSubmit}/>
        <IButtonModal isOpen={isOpen ? true : false} pos={iModalPostion} title={isOpen} description={IButtonContent[isOpen.replace(" ","_")]} setModal={(value) => setModal(value)}/>
    </div>
}

export default FunctionSelection