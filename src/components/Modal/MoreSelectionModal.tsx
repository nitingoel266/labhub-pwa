import styles from '../../styles/MyRecordsCard.module.css';

type Props = {
    setModal:(value:boolean) =>void;
    isOpen:boolean;
    handleSubmit:(value:string) =>void;
}

const MoreSelectionModal = ({setModal,isOpen,handleSubmit}:Props) => {
    return <div style={{position:"absolute",zIndex:1}}>
    {isOpen &&
    <div
    className={styles.MoreModalTopWrapper}
    onClick={() => setModal(false)}
    />}
     <div
        className={styles.MoreModalSecondWrapper}
        // style={{
        // opacity: isOpen ? 1 : 0,
        // // transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        // }}
        >
              <div className={styles.MoreModalWrapper}>
                {[{title:"Rename File"},{title:"Download"},{title:"Share"},{title:"Delete"}].map(el => <div className={styles.moreOneRow} onClick={() => handleSubmit(el.title)} key={el?.title}>{el?.title}</div>)}
            </div>
        </div>
    </div>   
}

export default MoreSelectionModal;