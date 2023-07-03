import styles from "../../styles/IButtonModal.module.css";
import {CloseIcon} from "../../images/index";
import { useEffect, useRef } from "react";

type Props= {
    isOpen:boolean;
    setModal:(value:any) => void;
    title:string;
    description:string;
}

const IButtonModal = ({setModal,isOpen,title,description} : Props)=> {

  const closeButtonRef:any = useRef(null)

  useEffect(() => { // to set focus for acessibility
    closeButtonRef?.current?.focus()
  },[])

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
        // role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"

        >
            <div className={styles.IButtonTextContainer}>
                <div className={styles.IButtonHeader}>
                    <div>Note:</div>
                    <button
                        aria-label = {description}
                        ref={closeButtonRef}
                        style={{border:"none",outline:"none",backgroundColor:"inherit"}}
                        onClick={() => setModal("")}
                    >
                        <img src={CloseIcon} style={{width:12,cursor:"pointer"}} alt="close icon"/>
                    </button>
                </div>
                <p style={{marginTop:5,fontSize:14}}><span style={{fontSize:15,marginRight:4}}>{title.toUpperCase()}:</span>{description}</p>
            </div>
        </div>
        </div>)
}

export default IButtonModal