import styles from "../styles/leaderSelectionModal.module.css";

type Props= {
    title:string;
    description:string;
    pos?:string;
}

const IButtonComponent = ({title,description,pos='flex-start'} : Props)=> {
    return (
        <div
        // className={styles.IButtonComponentWrapper}
        style={{
            marginTop:10,
            marginBottom:10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: pos,
            width: '100%',
            maxWidth:'70%',
        }}
        >
            <div className={styles.IButtonTextContainer}>
                <div className={styles.IButtonHeader}>
                    <div>Note:</div>
                </div>
                <div style={{marginTop:5,fontSize:14}}><span style={{fontSize:15,marginRight:4}}>{title.toUpperCase()}:</span>{description}</div>
            </div>
        </div>
        )
}

export default IButtonComponent