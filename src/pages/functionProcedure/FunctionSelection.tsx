import { useEffect, useRef, useState } from "react";
import {
  DataIcon,
  IButtonIcon,
  SensorIcon,
  RGBSpectIcon,
  HeaterIcon,
} from "../../images/index";
import styles from "../../styles/functionSelection.module.css";
import RightArrow from "../../components/RightArrow";
import IButtonModal from "../../components/Modal/IButtonModal";
import { useNavigate } from "react-router-dom";
import IButtonComponent from "../../components/IButtonComponent";
import {
  mobileWidth,
  SENSORS,
  HEATER,
  DATA_SETUP,
  RGB_SPECT,
  getDescription,
  HIGHLIGHT_BACKGROUND,
} from "../../components/Constants";

const FunctionSelection = () => {
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const [selectedItem, setSelectedItem] = useState<any>("");
  const [isOpen, setModal] = useState("");
  const navigate = useNavigate();

  const selectFunctionRef:any = useRef(null)

  const clickHandler = (item: string) => {
    if (selectedItem && selectedItem === item) setSelectedItem("");
    else setSelectedItem(item);
  };
  const handleSubmit = () => {
    if (selectedItem) {
      navigate(`/${selectedItem.replace(" ", "-").toLowerCase()}`);
    }
  };
  const handleIModal = (title: string) => {
    if (isOpen === title) setModal("");
    else setModal(title);
  };

  useEffect(() => { // to set focus for acessibility
    selectFunctionRef?.current?.focus()
  },[])

  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" style={{ position: "relative" }}>
      <h4 className={styles.HeaderText}><button aria-label="Select Function" style={{outline:"none",border:"none",fontSize:16,fontWeight:550}} ref={selectFunctionRef} >Select Function</button></h4>
      {[
        [
          { icon: DataIcon, title: DATA_SETUP},
          { icon: SensorIcon, title: SENSORS },
        ],
        [
          { icon: HeaterIcon, title: HEATER },
          { icon: RGBSpectIcon, title: RGB_SPECT },
        ],
      ].map((e: any) => (
        <div key={e[0]["title"]} className={styles.ButtonWrapper}>
          {e.map((el: any) => (
            <div className={styles.ButtonSubWrapper} key={el.title}>
              <div
                className={styles.Button}
                style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
              >
                <button
                  aria-label={el?.title + getDescription(el?.title)}
                  onClick={() => clickHandler(el.title)}
                  className={styles.SubButton}
                  style={el.title === selectedItem ? HIGHLIGHT_BACKGROUND : {}}
                >
                  <img
                    src={el.icon}
                    style={{ height: 35 }}
                    alt={el.title + "icon"}
                  />
                  <p style={{ marginLeft: 10,fontSize:15,fontWeight:500 }}>{el.title}</p>
                </button>
                <div
                  // aria-label={el?.title + "i button"}
                  onClick={() => handleIModal(el.title)}
                  className={styles.IButtonWrapper}
                >
                  <img src={IButtonIcon} style={{ width: 20 }} alt={el.title + "i icon"} />
                </div>
              </div>
              {isOpen === el.title && isMobile && (
                <IButtonComponent
                  title={el.title}
                  description={getDescription(el?.title)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
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
  );
};

export default FunctionSelection;
