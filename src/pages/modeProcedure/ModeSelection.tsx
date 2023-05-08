import { useState } from "react";
import {DataSetupIcon,IButtonIcon,SensorIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import IButtonComponent from "../../components/IButtonComponent";
import {mobileWidth,MANUAL_MODE,PRESET_MODE,getDescription,HIGHLIGHT_BACKGROUND} from "../../components/Constants";
import {applicationMessage} from "../../labhub/status"

const ModeSelection = () => {
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState<string>("");
    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }
    const handleSubmit = () => {
        if(selectedItem === MANUAL_MODE){
            // navigate(selectedItem === MANUAL_MODE ? "/function-selection" : "/preset-mode")
            navigate("/function-selection")
        }else if(selectedItem === PRESET_MODE){
            applicationMessage.next({message:"Preset Mode is not available right now!",type:"info"})
        }

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }

    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Mode</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:MANUAL_MODE},{icon:SensorIcon,title:PRESET_MODE}].map((el:any) => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
                <div className={styles.Button} style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
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
            </div>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default ModeSelection