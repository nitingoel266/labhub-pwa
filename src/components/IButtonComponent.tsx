import styles from "../styles/leaderSelectionModal.module.css";

type Props= {
    title:string;
    description:string;
    marginTop?:number;
}

const IButtonComponent = ({title,description,marginTop=-10} : Props)=> {
    return (
        <div
        // className={styles.IButtonComponentWrapper}
        style={{
            marginTop:marginTop,
            marginBottom:10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            width: '100%',
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