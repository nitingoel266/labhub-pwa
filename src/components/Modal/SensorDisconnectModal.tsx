// import {WhiteWarningIcon} from "../../images/index";
import styles from '../../styles/SensorDisconnectModal.module.css';

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    message?:any;
}

const SensorDisconnectModal = ({message = "Sensor has been disconnected!",isOpen,setModal} : Props) => {
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
                    <div className={styles.ErrorButtonWrapper}>
                        {/* <div onClick={() => setErrorMessage(null)} className={styles.CancelButton}>No</div> */}
                        <button onClick={setModal} className={styles.DismissButton}>Ok</button>
                    </div>
                </div>
            </div>
    </div>
    </div>
}

export default SensorDisconnectModal