import { useEffect, useState } from 'react';
import styles from '../../styles/SpectrophotometerCalibration.module.css';
import sound from "../../assets/sound/beep-sound.mp3";
import IButtonModal from '../Modal/IButtonModal';
import RightArrow from '../RightArrow';
import {IButtonIcon} from "../../images/index";
import { useNavigate } from 'react-router-dom';
import {mobileWidth,getDescription,TEST_CALIBRATE,HIGHLIGHT_BACKGROUND} from "../Constants";
import IButtonComponent from '../IButtonComponent';
import MemberDisconnect from '../Modal/MemberDisconnectModal';
import {startRgbExperiment,simulateRgb} from "../../labhub/actions";
import { useDeviceDataFeed, useDeviceStatus } from '../../labhub/status';
import {getClientId} from "../../labhub/utils";

const SpectrophotometerTesting = () => {
    const navigate = useNavigate();
    const clientId = getClientId()
    const [audio] = useState(new Audio(sound));
    const [status] = useDeviceStatus();
    const [dataStream] = useDeviceDataFeed();
    const isMobile = window.innerWidth <= mobileWidth ? true : false;
    const [selectedItem,setSelectedItem] = useState<any>("")
    const [testCalibrate, setTestCalibrate]= useState<any>(dataStream?.rgb?.calibrateTest || [])
    const [isOpen,setModal] = useState("");

    const clickHandler = (item:string) => {
        if(selectedItem && selectedItem === item)
        setSelectedItem("")
        else setSelectedItem(item)
    }

    const handleSubmit = () => {
        if(selectedItem){
            setSelectedItem("")
            if(clientId === status?.leaderSelected){
                startRgbExperiment()
                setTestCalibrate([])
            }

        }else setModal("measure now")

    }
    const handleIModal = (title:string) => {
        if(isOpen === title) setModal("")
        else setModal(title)
    }
    const handleMeasure = () => {
        setModal("")
        if(clientId === status?.leaderSelected)
        simulateRgb('measure')

        navigate("/cuvette-insertion")
    }

    useEffect(() => {
        if(dataStream?.rgb?.calibrateTest){
            if(JSON.stringify(dataStream?.rgb?.calibrateTest) !== JSON.stringify(testCalibrate)){
                audio.play()
                setTestCalibrate(dataStream?.rgb?.calibrateTest || [])
            }
        }
    },[dataStream?.rgb?.calibrateTest,audio,testCalibrate])
    return <div>
        <div className={styles.ButtonWrapper}>
              <div className={styles.Button} style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}>
                 <div onClick={() => clickHandler(TEST_CALIBRATE)} className={styles.SubButton}>
                     <div style={{marginLeft:10}}>{TEST_CALIBRATE}</div>
                 </div>
                 <div onClick={() => handleIModal(TEST_CALIBRATE)} className={styles.IButtonWrapper}>
                     <img src={IButtonIcon} style={{width:20}} alt="i button"/>
                 </div>
             </div>
        </div>
        {isOpen === TEST_CALIBRATE && isMobile && <IButtonComponent title={TEST_CALIBRATE} description={getDescription(TEST_CALIBRATE)}/>}
        <div className={styles.BodyWrapper}>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyRedBoll}>{testCalibrate[0]}</div>
                <div className={styles.BodyText}>Red</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyGreenBoll}>{testCalibrate[1]}</div>
                <div className={styles.BodyText}>Green</div>
            </div>
            <div className={styles.BodyBollWrapper}>
                <div className={styles.BodyBlueBoll}>{testCalibrate[2]}</div>
                <div className={styles.BodyText}>Blue</div>
            </div>
        </div>
        <div className={styles.FooterText}>Spectrophotometer tested for calibration successfully.</div>
        <div className={styles.FooterText}>These values should be within the range of -0.2 to 0.2. If these values are outside of the range, please check with your teacher.</div>
        <MemberDisconnect isOpen={isOpen === 'measure now' ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={handleMeasure} message={`Do you want to ${isOpen}?`}/>
        <RightArrow isSelected={true} handleSubmit={handleSubmit}/>
        {!isMobile && <IButtonModal isOpen={isOpen === TEST_CALIBRATE ? true : false} title={isOpen} description={getDescription(isOpen)} setModal={(value) => setModal(value)}/>}
    </div>
}

export default SpectrophotometerTesting