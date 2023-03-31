import styles from "../../styles/EditFileModal.module.css";

type Props = {
    isOpen:boolean;
    setEditModal:(value:any) => void;
}

const EditFileModal = ({isOpen,setEditModal}:Props) => {
    return <div style={{position:"absolute",zIndex:1}}>
        {isOpen &&
        <div
        className={styles.TopWrapper}
        onClick={() => setEditModal("")}
        />}
        <div
        className={styles.TopSecondWrapper}
        >
            <div>dee</div>
        </div>
    </div>
}

export default EditFileModal