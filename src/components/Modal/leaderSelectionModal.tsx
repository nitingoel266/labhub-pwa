import {WhiteWarningIcon} from "../../images/index";
import { joinAsLeader} from '../../labhub/actions';
import styles from "../../styles/leaderSelectionModal.module.css";
// import { useNavigate } from "react-router-dom";


type Props= {
    isOpen:boolean;
    setModal:(value:boolean) => void;
}

const LeadeSelectionModal = ({setModal,isOpen} : Props)=> {
//   const navigate = useNavigate();
    // useEffect(() => {
    //         if(connected && status && status?.leaderSelected){
    //             joinAsMember()
    //             setModal(false)
    //             navigate("/mode-selection")
    //         }
    // },[status?.leaderSelected])
    const submitHandler = () => {
        joinAsLeader()
        setModal(false)
        // navigate("/mode-selection")
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
        left:0,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        }}
        >
            <div className={styles.TextContainer}>
                <div className={styles.Headertext}>
                    <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/>
                    <div>Warning</div>
                </div>
                <div className={styles.BodyWrapper}>
                    <div className={styles.Bodytext}>
                        <div className={styles.BodyPrimaryText}>Selected Device does not have a leader.</div>
                        <div className={styles.BodySecondaryText}>Press <span style={{fontWeight:500}}>Yes</span> to become a Leader</div>
                    </div>
                    <div className={styles.ButtonWrapper}>
                        <div onClick={() => setModal(false)} className={styles.CancelButton}>Cancel</div>
                        <div onClick={submitHandler} className={styles.YesButton}>Yes</div>
                    </div>
                </div>
            </div>
        </div>
        </div>)
}

export default LeadeSelectionModal