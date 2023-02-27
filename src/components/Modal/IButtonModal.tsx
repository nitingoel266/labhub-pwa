import styles from "../../styles/leaderSelectionModal.module.css";
import {CloseIcon} from "../../images/index";

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    title:string;
    description:string;
}

const IButtonModal = ({setModal,isOpen,title,description} : Props)=> {
    return (
        <div>
        {isOpen &&
        <div
        className={styles.IButtonTopWrapper}
        onClick={() => setModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        style={{
            top: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'fixed',
            transition: 'all 0.3s ease-out',
            left:0,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(100vh)"
        }}
        >
            <div className={styles.IButtonTextContainer}>
                <div className={styles.IButtonHeader}>
                    <div>Note:</div>
                    <img src={CloseIcon} onClick={() => setModal("")} style={{width:12,cursor:"pointer"}} alt="close"/>
                </div>
                <div style={{marginTop:5,fontSize:14}}><span style={{fontSize:15,marginRight:4}}>{title.toUpperCase()}:</span>{description}</div>
            </div>
        </div>
        </div>)
}

export default IButtonModal