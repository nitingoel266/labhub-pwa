import {WarningIcon} from "../../images/index";
import styles from "../../styles/leaderSelectionModal.module.css";


type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    handleDisconnect:() => void;
    message?:string;
}

const MemberDisconnect = ({message="Are you sure to Disconnect!",setModal,isOpen,handleDisconnect} : Props)=> {
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
                <img src={WarningIcon} alt="warning"/>
                <div style={{textAlign:"center",fontSize:"16px",marginBottom:20}}>{message}</div>
            </div>
            <div className={styles.ButtonWrapper}>
                <div onClick={handleDisconnect} className={styles.Buttons}>Yes</div>
                <div onClick={() => setModal("")} className={styles.Buttons}>Cancel</div>
            </div>
        </div>
        </div>)
}

export default MemberDisconnect