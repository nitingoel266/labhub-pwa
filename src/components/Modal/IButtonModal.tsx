import styles from "../../styles/IButtonModal.module.css";
import {CloseIcon} from "../../images/index";

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    title:string;
    description:string;
}

const IButtonModal = ({setModal,isOpen,title,description} : Props)=> {
    return (
        <div className={styles.IButtonWrapper}>
        {isOpen &&
        <div
        className={styles.IButtonTopWrapper}
        onClick={() => setModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        style={{
            // transition: 'all 0.3s ease-out',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(100vh)",
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