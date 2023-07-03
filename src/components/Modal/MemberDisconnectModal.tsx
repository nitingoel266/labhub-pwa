// import {WhiteWarningIcon} from "../../images/index";
import styles from "../../styles/leaderSelectionModal.module.css";


type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    handleDisconnect:() => void;
    message?:any;
    handleCancel?:() => void;
}

const MemberDisconnect = ({message="Are you sure to Disconnect!",setModal,isOpen,handleDisconnect,handleCancel} : Props)=> {
 
    return (
        <div style={{position:"absolute",zIndex:1}}>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        onClick={() => setModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        }}
         role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
        >
            <div className={styles.TextContainer}>
                <div className={styles.Headertext}>
                    {/* <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/> */}
                    <h4>Warning</h4>
                </div>
                <div className={styles.BodyWrapper}>
                    <div className={styles.Bodytext}>
                        {/* <div>{message}</div> */}
                        <p dangerouslySetInnerHTML={{__html:message}}></p>
                    </div>
                    <div className={styles.ButtonWrapper}>
                        <button onClick={() => handleCancel ? handleCancel() : setModal("")} className={styles.CancelButton}>No</button>
                        <button onClick={handleDisconnect} className={styles.YesButton}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
        </div>)
}

export default MemberDisconnect