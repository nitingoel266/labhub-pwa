import {useAppMessage,applicationMessage} from "../../labhub/status";
import {WhiteWarningIcon} from "../../images/index";
import styles from '../../styles/Loader.module.css';


const ShowErrorModal = () => {
    const [errorMessage] = useAppMessage();

    const setErrorMessage = (value:any) => {
        applicationMessage.next(value)
    }
    const handleResetConnection = () => {
        setErrorMessage(null)
    }
    return errorMessage ? <div style={{position:"absolute",zIndex:1}}>
    {errorMessage &&
    <div
    className={styles.TopWrapper}
    />}
    <div
    className={styles.SecondWrapper}
    >
        <div className={styles.TextContainer}>
                <div className={styles.ErrorHeadertext}>
                    <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/>
                    <div>Error Message</div>
                </div>
                <div className={styles.ErrorBodyWrapper}>
                    <div className={styles.Bodytext}>
                        <div>{errorMessage}</div>
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