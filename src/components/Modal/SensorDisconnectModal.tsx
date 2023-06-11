// import {WhiteWarningIcon} from "../../images/index";
import styles from '../../styles/SensorDisconnectModal.module.css';

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    message?:any;
    checkForSave?:any;
    submitModal ? : () => void;
}

const SensorDisconnectModal = ({message = "Sensor has been disconnected!",isOpen,setModal,submitModal,checkForSave} : Props) => {
    return <div style={{position:"absolute",zIndex:1}}>
    {isOpen &&
    <div
    className={styles.TopWrapper}
    />}
    <div
    className={styles.SecondWrapper}
    role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"

    >
        <div className={styles.TextContainer}>
                <div className={styles.ErrorHeadertext} style={{backgroundColor:"#424C58"}}>
                    {/* <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/> */}
                    <h4>Warning</h4>
                </div>
                <div className={styles.ErrorBodyWrapper}>
                    <div className={styles.Bodytext}>
                        <div dangerouslySetInnerHTML={{__html:message}}/>
                        {/* <div>{errorMessage}</div> */}
                    </div>
                    <div className={styles.ErrorButtonWrapper} style={checkForSave ? {justifyContent:"flex-end"} : {}}>
                        {/* <div onClick={() => setErrorMessage(null)} className={styles.CancelButton}>No</div> */}
                        <button onClick={setModal} className={styles.DismissButton}>{checkForSave ? "No" : "Ok"}</button>
                        {checkForSave ? <button onClick={submitModal} className={styles.YesSaveButton} style={{marginLeft:10,marginRight:10}} >Yes</button> : null}
                    </div>
                </div>
            </div>
    </div>
    </div>
}

export default SensorDisconnectModal