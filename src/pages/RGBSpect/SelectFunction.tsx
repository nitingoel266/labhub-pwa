import { useEffect, useRef, useState } from "react";
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
import {getClientId} from "../../labhub/utils";

const SelectFunction = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [isOpen,setModal] = useState("");

    const selectFuncRef:any = useRef(null);

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
            navigate(selectedItem === CALIBRATE_SPECTROPHOTOMETER ? "/calibrate-spectrophotometer" : "/measure-absorbance")
        }

    }
    const handleFunctions = () => {
        if(selectedItem === MEASURE_ABSORBANCE &&  !status?.rgbCalTestedFromDevice) setModal("measure before Calibrating")
        else handleSubmit()
    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }   

    useEffect(() => { // to set focus for acessibility
        selectFuncRef?.current?.focus()
      },[])
    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ style={{position:"relative"}}>
        <h4 className={styles.HeaderText}><button aria-label="Select Function" style={{outline:"none",border:"none",fontSize:16,fontWeight:550,marginBottom:10}} ref={selectFuncRef} >Select Function</button></h4>
        <div className={styles.ButtonWrapper}>
            {[{icon:DataSetupIcon,title:CALIBRATE_SPECTROPHOTOMETER},{icon:RGBSpectIcon,title:MEASURE_ABSORBANCE}].map((el:any) => (
                <div className={styles.ButtonSubWrapper} key={el.title}>
              <div className={styles.Button} style={el.title === selectedItem ? {...HIGHLIGHT_BACKGROUND,maxWidth:240} : {maxWidth:240}}>
                 <button aria-label={`${el?.title} ${getDescription(el?.title)}`} onClick={() => clickHandler(el.title)} className={styles.SubButton} style={el.title === selectedItem ? {...HIGHLIGHT_BACKGROUND,maxWidth:235} : {maxWidth:235}}>
                     <img src={el.icon} style={{height:35,marginLeft:10}} alt={el.title + "i icon"}/>
                     <p style={{marginLeft:8,marginRight:2,fontSize:14,fontWeight:500}}>{el.title}</p>
                 </button>
                 <div onClick={() => handleIModal(el.title)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt={el.title + "i icon"}/>
                 </div>
             </div>
             {isOpen === el.title && isMobile && <IButtonComponent title={el.title} description={getDescription(el?.title)}/>}
             </div>
            ))}
            </div>
        {isOpen && <MemberDisconnect isOpen={isOpen === "measure before Calibrating" ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'measure before Calibrating' ? handleSubmit : handleSubmit} message={isOpen === "measure before Calibrating" ? "Are you sure you want to proceed without calibrating?" : `Do you want to ${isOpen} the experiment.`}/>}
        <RightArrow isSelected={selectedItem ? true : false} handleSubmit={handleFunctions}/>
        {!isMobile && isOpen && <IButtonModal isOpen={isOpen && isOpen !== 'measure before Calibrating' ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SelectFunction