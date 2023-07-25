import { useEffect, useRef, useState } from "react";
import styles from "../../styles/AbsorbanceMeasuring.module.css";
import sound from "../../assets/sound/beep-sound.mp3";
import IButtonModal from "../Modal/IButtonModal";
import RightArrow from "../RightArrow";
import { IButtonIcon } from "../../images/index";
import { useNavigate } from "react-router-dom";
import {
  mobileWidth,
  getDescription,
  MEASURE,
  HIGHLIGHT_BACKGROUND,
  validateFileName,
  getTitle,
  getDate,
  // getTime,
  getStorageKeys,
  toastMessage,
  getDeviceClientName
} from "../Constants";
import IButtonComponent from "../IButtonComponent";
import { startRgbExperiment, simulateRgb, calibrateRgb } from "../../labhub/actions";
import { useDeviceDataFeed, useDeviceStatus } from "../../labhub/status";
import {getClientId} from "../../labhub/utils";
import { RGB_DATA } from "../../utils/const";
import Header from "../header";

const AbsorbanceMeasuring = () => {
  const navigate = useNavigate();
  const clientId = getClientId()
  const [audio] = useState(new Audio(sound));
  const [status] = useDeviceStatus();
  const [dataStream] = useDeviceDataFeed();
  const [title,setTitle] = useState<any>(getTitle("R",clientId,status));

  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [measure, setMeasure] = useState<any>(dataStream?.rgb?.measure || []);
  const [measuredValue, setMeasuredValue] = useState<any>([]); //{Measuement No,RED,GREEN,BLUE}
  const [isOpen, setModal] = useState("");
  const [screenName,setScreenName] = useState<string>("cuvette-insertion"); // measure-absorbance

  const measureRef:any = useRef(null);

  const clickHandler = (item: string) => {
    if (selectedItem && selectedItem === item) setSelectedItem("");
    else setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      navigate("/measure-absorbance");
      if(screenName === "cuvette-insertion"){
        setScreenName("measure-absorbance")
      }
      if (clientId === status?.leaderSelected) {
        startRgbExperiment();
        setMeasuredValue((prevState: any) => {
          if(measure && measure[2]){
            return prevState ? [
              ...prevState,
              {
                "Measuement No": prevState?.length || 0,
                RED: measure[0],
                GREEN: measure[1],
                BLUE: measure[2],
              }
            ] : [
              {
                "Measuement No": prevState?.length || 0,
                RED: measure[0],
                GREEN: measure[1],
                BLUE: measure[2],
              }
            ];
          }
          
        });
      }

      setMeasure([]) // remove values when getting new
      setSelectedItem("");
      setIsSaved(false);
    } else {
      if (clientId === status?.leaderSelected) simulateRgb(null);

      navigate("/rgb-spect");
    }
  };
  const handleSave = () => {
    let resultRGB:any = [];
    if(measuredValue){
      resultRGB = [...measuredValue]
    }
    if (measure.length > 0) {
      resultRGB.push({
        "Measuement No": measuredValue?.length || 0,
        RED: measure[0],
        GREEN: measure[1],
        BLUE: measure[2],
      });
    }
    // let fileName = "R" + getFileName();
    // if (clientId === status?.leaderSelected) {
    //   // for leader
    //   fileName += "L";
    // } else if (clientId) {
    //   fileName +=
    //     "M" + Number(Number(status?.membersJoined.indexOf(clientId)) + 1);
    // }
    let fileName = title;
    let verifiedFileName = validateFileName(getStorageKeys(RGB_DATA), fileName);

    let resultData = {
      name: verifiedFileName,
      date: getDate(),
      time: `${title.slice(8,10)}:${title.slice(10,12)}`,  //getTime(),
      deviceWithClientName:getDeviceClientName(clientId,status),
      isCalibratedAndTested: status?.rgbCalibratedAndTested,
      data: resultRGB,
    };
    let storageRGBData = JSON.stringify(resultData);
    localStorage.setItem(`${RGB_DATA}_${verifiedFileName}`, storageRGBData);
    setIsSaved(true);
    toastMessage.next("Saved successfully!")
  };
  const handleIModal = (title: string) => {
    if (isOpen === title) setModal("");
    else setModal(title);
  };
  useEffect(() => {
      if (
        dataStream?.rgb &&
        dataStream?.rgb?.measure &&
        dataStream?.rgb?.measure.some((e: any) => e) &&
        JSON.stringify(dataStream?.rgb?.measure) !== JSON.stringify(measure)
      ) {
        audio.play();
        setMeasure(dataStream?.rgb?.measure || []);
        if(dataStream?.rgb?.measure.some((e:any) => e > 0.5 || e < -0.5)){
          toastMessage.next("Values are out of range!")
        }
      }
  }, [dataStream?.rgb, measure, audio]);

  useEffect(() => {
    if(!status?.rgbConnected){
      calibrateRgb()
      simulateRgb('measure')
    }
  },[status?.rgbConnected])

  useEffect(() => { // verify filename is exist or not in storage
    if(title && localStorage.getItem(`${RGB_DATA}_${title}`)){
      toastMessage.next("File name already exists!")
    }
  },[title])

  useEffect(() => { // to set focus for acessibility
    measureRef?.current?.focus()
  },[])

  return (
    <>
      <Header
        checkForSave={measure?.length > 0 && !isSaved ? true : false}
        handleSave={handleSave}
        // shouldCloseModal = {isOpen === "Temperature Sensor disconnected" ? true : false}
      />
    <div /* role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" */>
      {screenName === "cuvette-insertion" && <div className={styles.HeaderText}><button aria-label="Please insert cuvette to measure absorbance of RGB light." style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={measureRef} >Please insert cuvette to measure absorbance of RGB light.</button></div>}
      <div className={styles.ButtonWrapper} style={screenName === "cuvette-insertion" ? {marginTop:0} : {marginTop:70}}>
        <div
          className={styles.Button}
          style={MEASURE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
        >
          <button
            aria-label={`${MEASURE} ${getDescription(MEASURE)}`}
            onClick={() => clickHandler(MEASURE)}
            className={styles.SubButton}
            style={MEASURE === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
          >
            <p style={{ marginLeft: 10 ,fontSize:15,fontWeight:500}}>{MEASURE}</p>
          </button>
          <div
            // aria-label={MEASURE + " i button"}
            onClick={() => handleIModal(MEASURE)}
            className={styles.IButtonWrapper}
          >
            <img src={IButtonIcon} style={{ width: 20 }} alt="i icon" />
          </div>
        </div>
      </div>
      {isOpen === MEASURE && isMobile && (
        <IButtonComponent
          title={MEASURE}
          description={getDescription(MEASURE)}
        />
      )}
      <div className={styles.BodyWrapper}>
        <div aria-label={"red light value is"+measure[0]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyRedBoll} style={screenName === "cuvette-insertion" ? {backgroundColor:"#D08080"} : {}}>{measure[0]}</div>
          <div className={styles.BodyText}>Red</div>
        </div>
        <div aria-label={"green light value is"+measure[1]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyGreenBoll} style={screenName === "cuvette-insertion" ? {backgroundColor:"#7BAA81"} : {}}>{measure[1]}</div>
          <div className={styles.BodyText}>Green</div>
        </div>
        <div aria-label={"blue light value is"+measure[2]} className={styles.BodyBollWrapper}>
          <div className={styles.BodyBlueBoll} style={screenName === "cuvette-insertion" ? {backgroundColor:"#8AA3BB"} : {}}>{measure[2]}</div>
          <div className={styles.BodyText}>Blue</div>
        </div>
      </div>
      <div aria-label="Values are in Absorbance units in AU text" className={styles.FooterPlainText}>
        Values are in Absorbance units (AU)
      </div>
      <div className={styles.FooterTextWrapper}>
        <div className={styles.FooterInnerTextWrapper}>
          <div aria-label="TITLE sub header" style={{fontWeight:600}}>File Name</div>
          <div className={styles.FooterText}>
            <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} style={{outline:"none",border:"none"}} />
            {/* <div aria-label="file format T0918564122-1123-7T09185">T0918564122-1123-7T09185...</div> */}
            <button
              aria-label="save button"
              className={styles.SaveButton}
              onClick={() => (measure.length > 0 ? handleSave() : {})}
              style={
                measure.length > 0 && !isSaved
                  ? {}
                  : { backgroundColor: "#989DA3", cursor: "not-allowed" }
              }
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <RightArrow
        isSelected={selectedItem ? true : false}
        handleSubmit={handleSubmit}
      />
      {!isMobile && isOpen && (
        <IButtonModal
          isOpen={isOpen ? true : false}
          title={isOpen}
          description={getDescription(isOpen)}
          setModal={(value) => setModal(value)}
        />
      )}
    </div>
    </>
  );
};

export default AbsorbanceMeasuring;
