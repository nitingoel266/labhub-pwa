import {useAppMessage,applicationMessage} from "../../labhub/status";
import {WhiteWarningIcon} from "../../images/index";
import styles from '../../styles/Loader.module.css';


const ShowErrorModal = () => {
    const [appMessage] = useAppMessage();

    const errorMessage = appMessage?.message ?? null; // it will be an html component
    const messageType = appMessage?.type;
    const getMessageType = {"warn":"Warning","info":"Information","error":"Error Message"}
    
    const setErrorMessage = (value:any) => {
        applicationMessage.next(value)
    }
    const handleResetConnection = () => {
        setErrorMessage(null)
    }
    const messageColor = {backgroundColor:messageType === 'warn' ? "#FFC000" : messageType === "info" ? "#424C58" : "#CC0000"}
    return errorMessage ? <div style={{position:"absolute",zIndex:1}}>
    {errorMessage &&
    <div
    className={styles.TopWrapper}
    />}
    <div
    className={styles.SecondWrapper}
    >
        <div className={styles.TextContainer}>
                <div className={styles.ErrorHeadertext} style={messageColor}>
                    <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/>
                    <div>{messageType && getMessageType[messageType]}</div>
                </div>
                <div className={styles.ErrorBodyWrapper}>
                    <div className={styles.Bodytext}>
                        <div dangerouslySetInnerHTML={{__html:errorMessage}}/>
                        {/* <div>{errorMessage}</div> */}
                    </div>
                    <div className={styles.ErrorButtonWrapper}>
                        {/* <div onClick={() => setErrorMessage(null)} className={styles.CancelButton}>No</div> */}
                        <div onClick={handleResetConnection} className={styles.DismissButton}>Ok</div>
                    </div>
                </div>
            </div>
    </div>
    </div> : null
}

export default ShowErrorModal