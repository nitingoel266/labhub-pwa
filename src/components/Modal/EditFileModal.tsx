import { useEffect, useRef, useState } from "react";
import {WhiteCrossIcon} from "../../images/index"
import styles from "../../styles/EditFileModal.module.css";

type Props = {
    isOpen:any;
    setEditModal:(value:any) => void;
    EditFileName:(data:any,name:string) => void;
    selectedButton : string;
}

const EditFileModal = ({isOpen,setEditModal,EditFileName,selectedButton}:Props) => {
    const inputRef:any = useRef(null);
    const [fileName,setFileName] = useState<string>(isOpen?.name)
    const [checkForError,setCheckForError] = useState<boolean>(false)

    const editHandler = () => {
        if(localStorage.getItem(`${selectedButton}_data_${fileName}`)){
            setCheckForError(true)
        }else{
            EditFileName(isOpen,fileName)
        }
    }

    const changeHandler = (e:any) => {
        setFileName(e.target.value)
        setCheckForError(false)
    }

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
        // role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"
        >
            <div className={styles.TextContainer}>
                <div className={styles.HeaderWrapper}>
                    <div>Rename File</div>
                    <button
                        style={{border:"none",outline:"none",backgroundColor:"inherit"}}
                        onClick={() => setEditModal("")}
                    >
                        <img src={WhiteCrossIcon} style={{width:18,marginTop:5,cursor:"pointer"}} alt="close icon"/>
                    </button>
                </div>
                {/* <div className={styles.FileText}>
                    <input className={styles.InputElement} value={isOpen?.name} disabled/>
                </div> */}
                <div className={styles.FileText}>
                    <input ref={inputRef} type="text" value={fileName} onChange={e => changeHandler(e)} className={styles.InputElement} placeholder="Enter new file name..." required />
                    {checkForError ? <div style={{color:"red",fontSize:12,marginTop:2}}>File name already exists!</div> : <div style={{height:15}}>{" "}</div>}
                </div>
                <div className={styles.FooterWrapper}>
                    <button onClick={() => setEditModal("")} className={styles.CancelButton}>Cancel</button>
                    <button onClick={editHandler} className={styles.UpdateButton}>Rename</button>
                </div>
            </div>
        </div>
    </div>
}

export default EditFileModal