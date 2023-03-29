import {WhiteWarningIcon} from "../../images/index";
import styles from "../../styles/leaderSelectionModal.module.css";


type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    handleDisconnect:() => void;
    message?:string;
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
        >
            <div className={styles.TextContainer}>
                <div className={styles.Headertext}>
                    <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/>
                    <div>Title</div>
                </div>
                <div className={styles.BodyWrapper}>
                    <div className={styles.Bodytext}>
                        <div>{message}</div>
                    </div>
                    <div className={styles.ButtonWrapper}>
                        <div onClick={() => handleCancel ? handleCancel() : setModal("")} className={styles.CancelButton}>Cancel</div>
                        <div onClick={handleDisconnect} className={styles.YesButton}>Yes</div>
                    </div>
                </div>
            </div>
        </div>
        </div>)
}

export default MemberDisconnect