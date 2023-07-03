import {useWarnModal,warningMessage} from "../../labhub/status";
// import {WhiteWarningIcon} from "../../images/index";
import styles from '../../styles/Loader.module.css';


const WarningModal = () => {
    const [appMessage] = useWarnModal();

    const errorMessage = appMessage?.message ?? null; // it will be an html component
    const messageType = appMessage?.type;
    const getMessageType = {"warn":"Warning","info":"Information","error":"Error Message"}
    
    const setErrorMessage = (value:any) => {
        warningMessage.next(value)
    }
    const handleResetConnection = () => {
        setErrorMessage(null)
    }
    // const messageColor = {backgroundColor:messageType === 'warn' ? "#FFC000" : messageType === "info" ? "#424C58" : "#CC0000"}
    return errorMessage ? <div style={{position:"absolute",zIndex:1}}>
    {errorMessage &&
    <div
    className={styles.TopWrapper}
    />}
    <div
    className={styles.SecondWrapper}
    role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
    >
        <div className={styles.TextContainer}>
                <div className={styles.ErrorHeadertext} /* style={messageColor} */ style={{backgroundColor:"#424C58"}}>
                    {/* <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/> */}
                    <h4>{messageType && getMessageType[messageType]}</h4>
                </div>
                <div className={styles.ErrorBodyWrapper}>
                    <div className={styles.Bodytext}>
                        <p dangerouslySetInnerHTML={{__html:errorMessage}}/>
                        {/* <div>{errorMessage}</div> */}
                    </div>
                    <div className={styles.ErrorButtonWrapper}>
                        {/* <div onClick={() => setErrorMessage(null)} className={styles.CancelButton}>No</div> */}
                        <button onClick={handleResetConnection} className={styles.DismissButton} style={{backgroundColor:"#424C58",color:"#FFFFFF",fontWeight:600}}>OK</button>
                    </div>
                </div>
            </div>
    </div>
    </div> : null
}

export default WarningModal