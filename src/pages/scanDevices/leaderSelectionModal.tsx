import { useNavigate } from "react-router-dom";
import {WarningIcon} from "../../images/index";
import { joinAsLeader} from '../../labhub/actions';
import styles from "../../styles/leaderSelectionModal.module.css";


type Props= {
    isOpen:boolean;
    setModal:(value:boolean) => void;
}

const LeadeSelectionModal = ({setModal,isOpen} : Props)=> {
    const navigate = useNavigate();
    const submitHandler = () => {
        joinAsLeader()
        setModal(false)
        navigate("/mode-selection")
    }
    return (
        <div>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        // onClick={hideModal}
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
                <div style={{textAlign:"center",fontSize:"14px"}}>Selected Device does not have a leader.</div>
                <div style={{border:"1px solid #CCCCCC",width:"100%"}}>{" "}</div>
                <div style={{marginBottom:10}}>Press Yes to become a Leader</div>
            </div>
            <div className={styles.ButtonWrapper}>
                <div onClick={submitHandler} className={styles.Buttons}>Yes</div>
                <div onClick={() => setModal(false)} className={styles.Buttons}>Cancel</div>
            </div>
        </div>
        </div>)
}

export default LeadeSelectionModal