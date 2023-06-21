import {EmailShareButton,EmailIcon,WhatsappIcon,WhatsappShareButton,FacebookIcon,FacebookShareButton,LinkedinShareButton,LinkedinIcon,TwitterShareButton,TwitterIcon} from "react-share"
// import {ShareSocial} from "react-share-social"

// import { EmailIcon, WhatsappIcon, FacebookIcon, LinkedInIcon, TwitterIcon} from "../../images/index";
import styles from '../../styles/ShareModal.module.css';
import { useEffect, useState } from "react";
import { getShareFile } from "../Constants";

type Props = {
    setModal:(value:any) =>void;
    isOpen:any;
    handleSubmit:(value:string) =>void;
}

const ShareModal = ({setModal,isOpen,handleSubmit}:Props) => {
    const [file,setFile] = useState<any>()
    const [title,setTitle] = useState<any>()

    useEffect(() => {
        if(isOpen && isOpen?.selectedButton && isOpen?.data){
            const fileData = getShareFile(isOpen?.data,isOpen?.selectedButton);
            let titleData = (isOpen?.selectedButton.slice(0,1)).toLocaleUpperCase() + isOpen?.selectedButton.slice(1)
            setFile(fileData)
            setTitle(titleData)
        }
    },[isOpen])

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
                {/* {[{title:"Email",icon:EmailIcon},{title:"WhatsApp",icon:WhatsappIcon},{title:"Facebook",icon:FacebookIcon},{title:"LinkedIn",icon:LinkedInIcon},{title:"Twitter",icon:TwitterIcon}].map(el => <div className={styles.OneRow} onClick={() => handleSubmit(el.title)} key={el?.title}>
                    <img src={el?.icon} style={{width:25,marginRight:20}} alt={el.title}/>
                    <div>{el?.title}</div>
                </div>)} */}
                <button 
                className={styles.OneRow}
                >
                <EmailShareButton
                    url = {`${title} Experiment data of ${isOpen?.data?.name}`}
                    subject={`${title} Experiment Data`}
                    body="adsfghfsaf"
                    // onClick={handleEmailOnClick}
                    // onAbort={() => console.log("ABORT")}
                    // onShareWindowClose={() => console.log("??? CLOSE")}
                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <EmailIcon className={styles.IconStyle}/>
                        <div>Email</div>

                    </div>
                </EmailShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                >
                <WhatsappShareButton
                     url = {file}//{`${title} Experiment data of ${isOpen?.data?.name}`}
                     title={`${title} Experiment Data`}
                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <WhatsappIcon className={styles.IconStyle} round={true}/>
                        <div>WhatsApp</div>

                    </div>
                </WhatsappShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                >
                <FacebookShareButton
                     url = {file}//{`${title} Experiment data of ${isOpen?.data?.name}`}
                     quote={`${title} Experiment Data`}
                     hashtag={`#${title} Experiment data of ${isOpen?.data?.name}`}

                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <FacebookIcon className={styles.IconStyle} round={true}/>
                        <div>Facebook</div>

                    </div>
                </FacebookShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                >
                <LinkedinShareButton
                     url = {file}//{`${title} Experiment data of ${isOpen?.data?.name}`}
                     title={`${title} Experiment Data`}
                    //  description={""}

                >
                    <div className={styles.OneRowData} onClick={() => setModal(null)}>
                        <LinkedinIcon className={styles.IconStyle} round={true}/>
                        <div>LinkedIn</div>

                    </div>
                </LinkedinShareButton>
                </button>
                <button 
                className={styles.OneRow} 
                >
                <TwitterShareButton
                     url = {file}//{`${title} Experiment data of ${isOpen?.data?.name}`}
                     title={`${title} Experiment Data`}
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