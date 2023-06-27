import {EmailShareButton,EmailIcon,WhatsappIcon,WhatsappShareButton,FacebookIcon,FacebookShareButton,LinkedinShareButton,LinkedinIcon,TwitterShareButton,TwitterIcon} from "react-share"
import styles from '../../styles/ShareModal.module.css';
import { useEffect, useRef, useState } from "react";
import { getShareRawFileData } from "../Constants";

type Props = {
    setModal:(value:any) =>void;
    isOpen:any;
    handleSubmit:(value:string) =>void;
}

const ShareModal = ({setModal,isOpen,handleSubmit}:Props) => {
    const [file,setFile] = useState<any>()
    const [title,setTitle] = useState<any>()

  const shareEmailRef:any = useRef(null)

    useEffect(() => {
        if(isOpen && isOpen?.selectedButton && isOpen?.data){
            const fileData = getShareRawFileData(isOpen?.data,isOpen?.selectedButton);
            let titleData = (isOpen?.selectedButton.slice(0,1)).toLocaleUpperCase() + isOpen?.selectedButton.slice(1)
            setFile(fileData)
            setTitle(titleData)
        }
    },[isOpen])

    useEffect(() => { // to set focus for acessibility
        shareEmailRef?.current?.focus()
      },[])

    return <div style={{position:"absolute",zIndex:1}}>
    {isOpen &&
    <div
    className={styles.ModalTopWrapper}
    onClick={() => setModal(null)}
    />}
     <div
        className={styles.ModalSecondWrapper}
        >
            <div className={styles.ModalWrapper}>
                <div className={styles.HeaderText}>Share link to</div>
                <button 
                ref={shareEmailRef}
                aria-label={"Email"}
                className={styles.OneRow}
                >
                <EmailShareButton
                    url = {`${title} Experiment data of ${isOpen?.data?.name}`}
                    subject={`${title} Experiment Data`}
                    body={file}
                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <EmailIcon className={styles.IconStyle}/>
                        <div>Email</div>

                    </div>
                </EmailShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                aria-label={"Whats app"}
                >
                <WhatsappShareButton
                     url = {file}
                     title={`${title} Experiment data of ${isOpen?.data?.name} ${"\n"} ${"\n"}`}
                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <WhatsappIcon className={styles.IconStyle} round={true}/>
                        <div>WhatsApp</div>

                    </div>
                </WhatsappShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                aria-label={"Facebook"}
                >
                <FacebookShareButton
                     url = {file}
                     quote={`${title} Experiment data of ${isOpen?.data?.name} ${"\n"} ${"\n"}`}
                     hashtag={`#${title} Experiment data of ${isOpen?.data?.name}`}

                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <FacebookIcon className={styles.IconStyle} round={true}/>
                        <div>Facebook</div>

                    </div>
                </FacebookShareButton>
                </button>
                <button 
                aria-label={"Linked In"}
                className={styles.OneRow} 
                >
                <LinkedinShareButton
                     url = {file}
                     title={`${title} Experiment data of ${isOpen?.data?.name} ${"\n"} ${"\n"}`}
                    //  description={""}

                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <LinkedinIcon className={styles.IconStyle} round={true}/>
                        <div>LinkedIn</div>

                    </div>
                </LinkedinShareButton>
                </button>
                <button 
                aria-label={"Twitter"}
                className={styles.OneRow} 
                >
                <TwitterShareButton
                     url = {file}
                     title={`${title} Experiment data of ${isOpen?.data?.name} ${"\n"} ${"\n"}`}
                    //  via=""
                    // hashtags={[]}

                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <TwitterIcon className={styles.IconStyle} round={true}/>
                        <div>Twitter</div>

                    </div>
                </TwitterShareButton>
                </button>

            </div>
        </div>
    </div>   
}

export default ShareModal;