import { useEffect, useRef } from 'react';
import { joinAsLeader} from '../../labhub/actions';
import styles from "../../styles/leaderSelectionModal.module.css";


type Props= {
    isOpen:boolean;
    setModal:(value:boolean) => void;
}

const LeadeSelectionModal = ({setModal,isOpen} : Props)=> {
    
    const leaderSelectionRef:any = useRef(null);


    const submitHandler = () => {
        joinAsLeader()
        setModal(false)
        // navigate("/mode-selection")
    }

    useEffect(() => { // to set focus for acessibility
        leaderSelectionRef?.current?.focus()
      },[])

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
        zIndex:1,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        }}
        // role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
        >
            <div className={styles.TextContainer}>
                <div className={styles.Headertext}>
                    {/* <img src={WhiteWarningIcon} style={{width:20,marginRight:10}} alt="warning icon"/> */}
                    <h4>Warning</h4>
                </div>
                <div className={styles.BodyWrapper}>
                    <div className={styles.Bodytext}>
                        <p className={styles.BodyPrimaryText}><button ref={leaderSelectionRef} style={{outline:"none",border:"none",fontSize:16,lineHeight: 1.5,marginBottom:5}}>Selected Device does not have a leader. Press Yes to become a leader</button></p>
                        {/* <div className={styles.BodySecondaryText}>Press <span style={{fontWeight:500}}>Yes</span> to become a Leader</div> */}
                    </div>
                    <div className={styles.ButtonWrapper}>
                        <button onClick={() => setModal(false)} className={styles.CancelButton}>No</button>
                        <button onClick={submitHandler} className={styles.YesButton}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
        </div>)
}

export default LeadeSelectionModal