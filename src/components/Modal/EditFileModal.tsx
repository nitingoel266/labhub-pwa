import { useState } from "react";
import {CloseIcon} from "../../images/index"
import styles from "../../styles/EditFileModal.module.css";

type Props = {
    isOpen:any;
    setEditModal:(value:any) => void;
    EditFileName:(data:any,name:string) => void;
}

const EditFileModal = ({isOpen,setEditModal,EditFileName}:Props) => {
    const [fileName,setFileName] = useState<string>("")
    return <div style={{position:"absolute",zIndex:1}}>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        onClick={() => setEditModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        >
            <div className={styles.TextContainer}>
                <div className={styles.HeaderWrapper}>
                    <div>Change File Name</div>
                    <img src={CloseIcon} onClick={() => setEditModal("")} style={{width:15,cursor:"pointer"}} alt="close"/>
                </div>
                <div className={styles.FileText}>
                    <input className={styles.InputElement} value={isOpen?.name} disabled/>
                </div>
                <div className={styles.FileText}>
                    <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} className={styles.InputElement} placeholder="Enter new file name..." required />
                </div>
                <div className={styles.FooterWrapper}>
                    <div onClick={() => setEditModal("")} className={styles.CancelButton}>Cancel</div>
                    <div onClick={() => EditFileName(isOpen,fileName)} className={styles.UpdateButton}>Update</div>
                </div>
            </div>
        </div>
    </div>
}

export default EditFileModal