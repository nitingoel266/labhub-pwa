

import { useState } from "react";
import {DataSetupIcon,IButtonIcon,SensorIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import {setSelectedMode} from "../../labhub/actions-client"
import { useNavigate } from "react-router-dom";
// import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonContent from "../../components/IButtonContent";
import IButtonComponent from "../../components/IButtonComponent";
// import {useDeviceStatus} from "../../labhub/status";

const ModeSelection = () => {
    const navigate = useNavigate();
    // const manualModeRef = useRef()
    // const projectModeRef = useRef()
    // const [status] = useDeviceStatus();
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState<string>("");
    // const [iModalPostion,setIModalPosition] = useState<any>({})
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem){
            let mode = selectedItem.slice(0,selectedItem.indexOf(" ")).toLowerCase()
            setSelectedMode(mode)
            navigate(selectedItem === "Manual Mode" ? "/function-selection" : "/preset-mode")
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    // set the initial value from modes
    // useEffect(() => {
    //     if(status?.modeSelected){
    //         let result = status.modeSelected[0].toUpperCase()+status.modeSelected.slice(1) + " Mode"
    //         setSelectedItem(result)
    //     }
    // },[navigate,status?.modeSelected])

    const extraStyle = {backgroundColor:"#9CD5CD"} 
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Mode</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:"Manual Mode"},{icon:SensorIcon,title:"Preset Mode"}].map((el:any) => (
                <>
                <div key={el.title} className={styles.Button} style={el.title === selectedItem ? extraStyle : {}}>
                    <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                        <img src={el.icon} style={{height:35}} alt={el.title + "icon"}/>
                        <div style={{marginLeft:10}}>{el.title}</div>
                    </div>
                    <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                        <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                    </div>
                </div>
                {isOpen === el.title && <IButtonComponent title={el.title} pos="center" description={IButtonContent[el.title.replace(" ","_")]}/>}
                </>
            ))}
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {/* <IButtonModal isOpen={isOpen ? true : false} pos={iModalPostion} title={isOpen} description={IButtonContent[isOpen.replace(" ","_")]} setModal={(value) => setModal(value)}/> */}
    </div>
}

export default ModeSelection