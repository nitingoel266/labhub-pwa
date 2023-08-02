import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,CALIBRATE,HIGHLIGHT_BACKGROUND,toastMessage, showLoader} from "../Constants";
import {WhiteTickIcon,WhiteCrossIcon} from "../../images/index";
import IButtonComponent from '../IButtonComponent';
import { useDeviceDataFeed, useDeviceStatus } from '../../labhub/status';
import {  startRgbExperiment, simulateRgb } from "../../labhub/actions";

import {getClientId} from "../../labhub/utils";
import {delay} from "../../utils/utils";
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
    const [testCalibrate, setTestCalibrate] = useState<any>([]);

    const [testCalibrateInitial, setTestCalibrateInitial] = useState<any>([]);

    
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

                if (status?.rgbConnected !== "calibrate")
                    simulateRgb("calibrate");
                startRgbExperiment();
                setTestCalibrateInitial([])
                setTestCalibrate([]);
            }
        }else {
            if(clientId === status?.leaderSelected){
                simulateRgb('calibrate_test')
            }
            navigate("/calibration-testing") 
        }

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
        const setData = async() => {
            if(testCalibrateInitial?.length === 3){
                for(let i = 0;i<testCalibrateInitial?.length;i++){
                    audio.play();
                    setTestCalibrate((prevdata:[]) => {
                        if(prevdata?.length < 3){
                            if(testCalibrateInitial[i] !== null)
                            return [...prevdata,testCalibrateInitial[i]]
                            else return [...prevdata]
                        }
                    });
                    if(i<2)
                    await delay(1000)
                }
            }else {
                setTestCalibrate([])
            }
        }
        setData()
    },[testCalibrateInitial])

    useEffect(() => {

        const getData =  async() =>{
        if (
          ((dataStream?.rgb?.calibrate &&
          dataStream?.rgb?.calibrate.some((e: any) => e !== null) &&
          JSON.stringify(dataStream?.rgb?.calibrate) !==
          JSON.stringify(testCalibrateInitial)) || status?.rgbCalibratedFromDevice) &&
          testCalibrateInitial?.length === 0 
        ) {
            if(dataStream?.rgb?.calibrate)
            setTestCalibrateInitial([...dataStream?.rgb?.calibrate])
            else setTestCalibrateInitial([0,0,0])
            // console.log("??>> prevdata prevdata OUTER")
            // for(let i = 0;i<3;i++){
            //     audio.play();
            //     setTestCalibrate((prevdata:[]) => {
            //         console.log("??>> prevdata prevdata ",prevdata)
            //         if(prevdata?.length < 3){
            //             if(dataStream?.rgb?.calibrate && dataStream?.rgb?.calibrate[i] !== null)
            //             return [...prevdata,dataStream?.rgb?.calibrate[i]]
            //             else return [...prevdata]
            //         }
            //     });
            //     if(i<2)
            //     await delay(1000)
            // }
            // audio.play();
            // setTestCalibrate(dataStream?.rgb?.calibrate || []);
        //  getData(dataStream?.rgb?.calibrate)
        //   if(dataStream?.rgb?.calibrate.some((e:any) => e > 0.2 || e < -0.2)){
        //     toastMessage.next("Values are out of range!")
        //   }
        }
        }
        getData()
    }, [dataStream?.rgb?.calibrate,status?.rgbCalibratedFromDevice]);

    useEffect(() => { // to set focus for acessibility
        calibrateRef?.current?.focus()
      },[])

    useEffect(() => {
        if(testCalibrate?.length === 3 ){
            showLoader.next(false)
        }else{
            showLoader.next(true)
        }
    },[testCalibrate,status?.rgbCalibratedFromDevice])
   
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
                    { (testCalibrate?.length >=1) && <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div aria-label='green ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>
                    { (testCalibrate?.length >= 2 ) &&  <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div aria-label='blue ball' className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>
                    { (testCalibrate?.length >= 3 ) && <img src={WhiteTickIcon} style={{width:25}} alt="tick icon"/>}
                </div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer calibrated successfully. You can test calibration now.</div>
        <RightArrow isSelected={((status?.rgbCalibratedFromDevice) || testCalibrate?.length === 3) || selectedItem ? true : false} handleSubmit={handleSubmit}/>
        {!isMobile && isOpen && <IButtonModal isOpen={isOpen ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerCalibration