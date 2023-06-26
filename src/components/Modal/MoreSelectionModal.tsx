import { useEffect, useRef } from "react";
import styles from "../../styles/MyRecordsCard.module.css";

type Props = {
  setModal: (value: any) => void;
  isOpen: boolean;
  handleSubmit: (value: string) => void;
};

const MoreSelectionModal = ({ setModal, isOpen, handleSubmit }: Props) => {

  const renameFileRef:any = useRef(null)


  useEffect(() => { // to set focus for acessibility
    renameFileRef?.current?.focus()
  },[])

  return (
    <div style={{ position: "absolute", zIndex: 1 }}>
      {isOpen && (
        <div
          className={styles.MoreModalTopWrapper}
          onClick={() => setModal("")}
        />
      )}
      <div
        className={styles.MoreModalSecondWrapper}
        // style={{
        // opacity: isOpen ? 1 : 0,
        // // transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
        // }}
      role="alertdialog" aria-modal="true" aria-labelledby="dialog_label" aria-describedby="dialog_desc"

      >
        <div className={styles.MoreModalWrapper}>
          {[
            { title: "Rename File",ref:renameFileRef},
            { title: "Download" },
            { title: "Share" },
            { title: "Delete" },
          ].map((el:any) => (
            <div
              className={styles.moreOneRow}
              onClick={() => handleSubmit(el.title)}
              key={el?.title}
            >
                <button
                ref={el?.ref}
                aria-label={el?.title}
                style={{border:"none",outline:"none",backgroundColor:"inherit",width:'90%'}}
                >
                {el?.title}
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreSelectionModal;
