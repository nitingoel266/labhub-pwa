import { EmailIcon, WhatsappIcon, FacebookIcon, LinkedInIcon, TwitterIcon} from "../../images/index";
import styles from '../../styles/ShareModal.module.css';

type Props = {
    setModal:(value:boolean) =>void;
    isOpen:boolean;
    handleSubmit:(value:string) =>void;
}

const ShareModal = ({setModal,isOpen,handleSubmit}:Props) => {
    return <div style={{position:"absolute",zIndex:1}}>
    {isOpen &&
    <div
    className={styles.ModalTopWrapper}
    onClick={() => setModal(false)}
    />}
     <div
        className={styles.ModalSecondWrapper}
        >
            <div className={styles.ModalWrapper}>
                <div className={styles.HeaderText}>Share link to</div>
                {[{title:"Email",icon:EmailIcon},{title:"WhatsApp",icon:WhatsappIcon},{title:"Facebook",icon:FacebookIcon},{title:"LinkedIn",icon:LinkedInIcon},{title:"Twitter",icon:TwitterIcon}].map(el => <div className={styles.OneRow} onClick={() => handleSubmit(el.title)} key={el?.title}>
                    <img src={el?.icon} style={{width:25,marginRight:20}} alt={el.title}/>
                    <div>{el?.title}</div>
                </div>)}
            </div>
        </div>
    </div>   
}

export default ShareModal;