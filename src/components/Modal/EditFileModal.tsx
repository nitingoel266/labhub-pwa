import { useEffect, useRef, useState } from "react";
import {CloseIcon} from "../../images/index"
import styles from "../../styles/EditFileModal.module.css";

type Props = {
    isOpen:any;
    setEditModal:(value:any) => void;
    EditFileName:(data:any,name:string) => void;
}

const EditFileModal = ({isOpen,setEditModal,EditFileName}:Props) => {
    const inputRef:any = useRef(null);
    const [fileName,setFileName] = useState<string>("")

    useEffect(() => { // to set focus for acessibility
        inputRef?.current?.focus()
      },[])
      
    return <div style={{position:"absolute",zIndex:1}}>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        onClick={() => setEditModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
        >
            <div className={styles.TextContainer}>
                <div className={styles.HeaderWrapper}>
                    <div>Change File Name</div>
                    <button
                        style={{border:"none",outline:"none",backgroundColor:"inherit"}}
                        onClick={() => setEditModal("")}
                    >
                        <img src={CloseIcon} style={{width:15,cursor:"pointer"}} alt="close icon"/>
                    </button>
                </div>
                <div className={styles.FileText}>
                    <input className={styles.InputElement} value={isOpen?.name} disabled/>
                </div>
                <div className={styles.FileText}>
                    <input ref={inputRef} type="text" value={fileName} onChange={e => setFileName(e.target.value)} className={styles.InputElement} placeholder="Enter new file name..." required />
                </div>
                <div className={styles.FooterWrapper}>
                    <button onClick={() => setEditModal("")} className={styles.CancelButton}>Cancel</button>
                    <button onClick={() => EditFileName(isOpen,fileName)} className={styles.UpdateButton}>Update</button>
                </div>
            </div>
        </div>
    </div>
}

export default EditFileModal