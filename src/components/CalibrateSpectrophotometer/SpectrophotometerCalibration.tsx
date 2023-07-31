import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,CALIBRATE,HIGHLIGHT_BACKGROUND,toastMessage} from "../Constants";
import {WhiteTickIcon,WhiteCrossIcon} from "../../images/index";
import IButtonComponent from '../IButtonComponent';
import { useDeviceDataFeed, useDeviceStatus } from '../../labhub/status';
import {  startRgbExperiment, simulateRgb } from "../../labhub/actions";

import {getClientId} from "../../labhub/utils";
import sound from "../../assets/sound/beep-sound.mp3";


const SpectrophotometerCalibration = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataFeed();

    const [audio] = useState(new Audio(sound));


    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    // const [calibrate,setCalibrate] = useState<any>(null)
    const [testCalibrate, setTestCalibrate] = useState<any>(
        dataStream?.rgb?.calibrateTest || []
      );
    const [isOpen,setModal] = useState("");

    const calibrateRef:any = useRef(null)

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            setSelectedItem("")
            if(clientId === status?.leaderSelected){
                // setCalibrate(null)
                // calibrateRgb()

                if (status?.rgbConnected !== "calibrate_test")
                    simulateRgb("calibrate_test");
                startRgbExperiment();
                setTestCalibrate([]);
            }
        }else navigate("/calibration-testing") 

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    // useEffect(() => {
    //     if(clientId === status?.leaderSelected)
    //     calibrateRgb()
    // },[clientId, status?.leaderSelected])
    // useEffect(() => {
    //     if(status){
    //         setCalibrate(status?.rgbCalibrated)
    //     }
    // },[status, status?.rgbCalibrated])

    useEffect(() => {
        if (
          dataStream?.rgb &&
          dataStream?.rgb?.calibrateTest &&
          dataStream?.rgb?.calibrateTest.some((e: any) => e) &&
          JSON.stringify(dataStream?.rgb?.calibrateTest) !==
          JSON.stringify(testCalibrate)
        ) {
          audio.play();
          setTestCalibrate(dataStream?.rgb?.calibrateTest || []);
        //   if(dataStream?.rgb?.calibrateTest.some((e:any) => e > 0.2 || e < -0.2)){
        //     toastMessage.next("Values are out of range!")
        //   }
        }
    }, [dataStream?.rgb, audio, testCalibrate]);
  

    useEffect(() => { // to set focus for acessibility
        calibrateRef?.current?.focus()
      },[])

    return <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <button ref={calibrateRef} aria-label={`${CALIBRATE} ${getDescription(CALIBRATE)}`} onClick={() => clickHandler(CALIBRATE)} className={styles.SubButton} style={CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                    <p style={{ marginLeft: 10,fontSize:15,fontWeight:500 }}>{CALIBRATE}</p>
                 </button>
                 <div onClick={() => handleIModal(CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === CALIBRATE && isMobile && <IButtonComponent title={CALIBRATE} description={getDescription(CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div aria-label='RED ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>
                    {testCalibrate[0] && <img src={testCalibrate[0] ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div aria-label='green ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>
                    {testCalibrate[1] &&  <img src={testCalibrate[1] ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div aria-label='blue ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>
                    {testCalibrate[2] && <img src={testCalibrate[2] ? WhiteTickIcon : WhiteCrossIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer calibrated successfully. You can test calibration now.</div>
        <RightArrow isSelected={testCalibrate[0] || selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && isOpen && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerCalibration