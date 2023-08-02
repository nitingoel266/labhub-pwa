import { useEffect, useRef, useState } from "react";
import styles from "../../styles/SpectrophotometerCalibration.module.css";
import sound from "../../assets/sound/beep-sound.mp3";
import IButtonModal from "../Modal/IButtonModal";
import RightArrow from "../RightArrow";
import { IButtonIcon } from "../../images/index";
import { useNavigate } from "react-router-dom";
import {
  mobileWidth,
  getDescription,
  TEST_CALIBRATE,
  HIGHLIGHT_BACKGROUND,
  toastMessage,
  showLoader
} from "../Constants";
import IButtonComponent from "../IButtonComponent";
import MemberDisconnect from "../Modal/MemberDisconnectModal";
import { startRgbExperiment, simulateRgb, stopRgbExperiment } from "../../labhub/actions";
import { useDeviceDataFeed, useDeviceStatus } from "../../labhub/status";
import { getClientId } from "../../labhub/utils";
import {delay} from "../../utils/utils";


const SpectrophotometerTesting = () => {
  const navigate = useNavigate();
  const clientId = getClientId();
  const [audio] = useState(new Audio(sound));
  const [status] = useDeviceStatus();
  const [dataStream] = useDeviceDataFeed();
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [testCalibrate, setTestCalibrate] = useState<any>([]);
  const [testCalibrateInitial, setTestCalibrateInitial] = useState<any>([]);

  const [isOpen, setModal] = useState("");


  const calibrateRef:any = useRef(null);

  const clickHandler = (item: string) => {
    if (selectedItem && selectedItem === item) setSelectedItem("");
    else setSelectedItem(item);
  };

  const handleSubmit = async() => {
    if (selectedItem) {
      setSelectedItem("");
      if (clientId === status?.leaderSelected) {
        stopRgbExperiment()
        await delay(1000)
        if (status?.rgbConnected !== "calibrate_test")
          simulateRgb("calibrate_test");
        startRgbExperiment();
        showLoader.next(true)
        setTestCalibrate([]);
        setTestCalibrateInitial([]);
      }
    } else {
      if(clientId === status?.leaderSelected)
      setModal("measure now");
      else navigate("/measure-absorbance");
    }
  };
  const handleIModal = (title: string) => {
    if (isOpen === title) setModal("");
    else setModal(title);
  };
  const handleMeasure = () => {
    setModal("");
    if (clientId === status?.leaderSelected) simulateRgb("measure");
    navigate("/measure-absorbance");
  };

  useEffect(() => {
    const setData = async() => {
      // showLoader.next(true)
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
            if(testCalibrateInitial.some((e:any) => e > 0.2 || e < -0.2)){
              toastMessage.next("Values are out of range!")
            }
            showLoader.next(false)
        }else {
            setTestCalibrate([])
        }
    }
    setData()
},[testCalibrateInitial])

  useEffect(() => {

    const getData =  async() =>{
      if (
        dataStream?.rgb?.calibrateTest &&
        dataStream?.rgb?.calibrateTest.some((e: any) => e !== null) &&
        testCalibrateInitial?.length === 0 &&
        JSON.stringify(dataStream?.rgb?.calibrateTest) !==
        JSON.stringify(testCalibrateInitial)
      ) {
        showLoader.next(true)
        setTestCalibrateInitial([...dataStream?.rgb?.calibrateTest])

      //   for(let i = 0;i<3;i++){
      //     audio.play();
      //     setTestCalibrate((prevdata:[]) => {
      //         if(dataStream?.rgb?.calibrateTest && dataStream?.rgb?.calibrateTest[i] !== null)
      //         return [...prevdata,dataStream?.rgb?.calibrateTest[i]]
      //         else return [...prevdata]
      //     });
      //     if(i<2)
      //     await delay(1000)
      // }
      
      //  showLoader.next(false)
      //   // audio.play();
      //   // setTestCalibrate(dataStream?.rgb?.calibrateTest || []);
      //   if(dataStream?.rgb?.calibrateTest.some((e:any) => e > 0.2 || e < -0.2)){
      //     toastMessage.next("Values are out of range!")
      //   }
      }
    }
    getData()
  }, [dataStream?.rgb?.calibrateTest]);

  useEffect(() => {
    if(status?.operation !== "rgb_calibrate_test"){
      setTestCalibrateInitial([])
    }
  },[status?.operation])

  useEffect(() => { // to set focus for acessibility
    calibrateRef?.current?.focus()
  },[])

  return (
    <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */ >
      <div className={styles.ButtonWrapper}>
        <div
          className={styles.Button}
          style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
        >
          <button
            ref={calibrateRef}
            aria-label={`${TEST_CALIBRATE} ${getDescription(TEST_CALIBRATE)}`}
            onClick={() => clickHandler(TEST_CALIBRATE)}
            className={styles.SubButton}
            style={TEST_CALIBRATE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
          >
            <p style={{ marginLeft: 10 ,fontSize:15,fontWeight:500}}>{TEST_CALIBRATE}</p>
          </button>
          <div
            onClick={() => handleIModal(TEST_CALIBRATE)}
            className={styles.IButtonWrapper}
          >
            <img src={IButtonIcon} style={{ width: 20 }} alt="i icon" />
          </div>
        </div>
      </div>
      {isOpen === TEST_CALIBRATE && isMobile && (
        <IButtonComponent
          title={TEST_CALIBRATE}
          description={getDescription(TEST_CALIBRATE)}
        />
      )}
      <div className={styles.BodyWrapper}>
        <div aria-label={"red light value is "+testCalibrate[0]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyRedBoll}>{testCalibrate?.length >=1 && testCalibrate[0] >= 0 ? "+" : ""}{`${(testCalibrate?.length >=1) ? (testCalibrate[0] ? Number(testCalibrate[0]).toFixed(2) : "0.00" ) : ""}`}</div>
          <div className={styles.BodyText}>Red</div>
        </div>
        <div aria-label={"green light value is"+testCalibrate[1]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyGreenBoll}>{testCalibrate?.length >=2 && testCalibrate[1] >= 0 ? "+" : ""}{`${(testCalibrate?.length >=2) ? (testCalibrate[1] ? Number(testCalibrate[1]).toFixed(2) : "0.00") : ""}`}</div>
          <div className={styles.BodyText}>Green</div>
        </div>
        <div aria-label={"blue light value is"+testCalibrate[2]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyBlueBoll}>{testCalibrate?.length >=3 && testCalibrate[2] >= 0 ? "+" : ""}{`${(testCalibrate?.length >=3) ? (testCalibrate[2] ? Number(testCalibrate[2]).toFixed(2) : "0.00") : ""}`}</div>
          <div className={styles.BodyText}>Blue</div>
        </div>
      </div>
      <div aria-label="Spectrophotometer tested for calibration successfully." className={styles.FooterText}>
        Spectrophotometer tested for calibration successfully.
      </div>
      <div aria-label="These values should be within the range of -0.2 to 0.2. If these values
        are outside of the range, please check with your teacher." className={styles.FooterText}>
        These values should be within the range of -0.2 to 0.2. If these values
        are outside of the range, please check with your teacher.
      </div>
      {isOpen && <MemberDisconnect
        isOpen={isOpen === "measure now" ? true : false}
        setModal={(value) => setModal(value)}
        handleDisconnect={handleMeasure}
        message={`Do you want to ${isOpen}?`}
      />}
      <RightArrow isSelected={testCalibrate?.length === 3 || selectedItem ? true : false} handleSubmit={handleSubmit} />
      {!isMobile && isOpen && (
        <IButtonModal
          isOpen={isOpen === TEST_CALIBRATE ? true : false}
          title={isOpen}
          description={getDescription(isOpen)}
          setModal={(value) => setModal(value)}
        />
      )}
    </div>
  );
};

export default SpectrophotometerTesting;
