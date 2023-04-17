import { useState } from "react";
import {DataSetupIcon,IButtonIcon,RGBSpectIcon} from "../../images/index";
import styles from '../../styles/functionSelection.module.css';
import RightArrow from "../../components/RightArrow";
import { useNavigate } from "react-router-dom";
import IButtonModal from "../../components/Modal/IButtonModal";
import {mobileWidth,CALIBRATE_SPECTROPHOTOMETER,getDescription,MEASURE_ABSORBANCE,HIGHLIGHT_BACKGROUND} from "../../components/Constants";
import IButtonComponent from "../../components/IButtonComponent";
import MemberDisconnect from "../../components/Modal/MemberDisconnectModal";
import {calibrateRgb,simulateRgb} from "../../labhub/actions";
import { useDeviceStatus } from "../../labhub/status";
import { LABHUB_CLIENT_ID } from "../../utils/const";

const SelectFunction = () => {
    const navigate = useNavigate();
    const clientId = localStorage.getItem(LABHUB_CLIENT_ID);
    const [status] = useDeviceStatus();
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
            if(selectedItem === MEASURE_ABSORBANCE){
                if(clientId === status?.leaderSelected){
                    calibrateRgb()
                    simulateRgb('measure')
                }
            }
            navigate(selectedItem === CALIBRATE_SPECTROPHOTOMETER ? "/calibrate-spectrophotometer" : "/cuvette-insertion")
        }

    }
    const handleFunctions = () => {
        if(selectedItem === MEASURE_ABSORBANCE && status?.operation !== "rgb_calibrate" && status?.operation !== "rgb_measure") setModal("measure before Calibrating")
        else handleSubmit()
    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }   
    return <div style={{position:"relative"}}>
        <div className={styles.HeaderText}>Select Function</div>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:CALIBRATE_SPECTROPHOTOMETER},{icon:RGBSpectIcon,title:MEASURE_ABSORBANCE}].map(el => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
              <div className={styles.Button} style={el.title === selectedItem ? {...HIGHLIGHT_BACKGROUND,maxWidth:235} : {maxWidth:235}}>
                 <div onClick={() => clickHandler(el.title)} className={styles.SubButton}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "icon"}/>
                     <div style={{marginLeft:10,marginRight:2}}>{el.title}</div>
                 </div>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
             {isOpen === el.title && isMobile && <IButtonComponent title={el.title} description={getDescription(el?.title)}/>}
             </div>
            ))}
            </div>
        <MemberDisconnect isOpen={isOpen === "measure before Calibrating" ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'measure before Calibrating' ? handleSubmit : handleSubmit} message={isOpen === "measure before Calibrating" ? "Are you sure you want to measure before Calibrating?" : `Do you want to ${isOpen} the experiment.`}/>
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleFunctions}/>
        {!isMobile && <IButtonModal isOpen={isOpen && isOpen !== 'measure before Calibrating' ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SelectFunction