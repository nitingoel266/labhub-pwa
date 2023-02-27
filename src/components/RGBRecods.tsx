import styles from '../styles/TemperatureRecords.module.css';

const RGBRecord = () => {
    return <div className={styles.Wrapper}>
    {[{key:1, value:"Measuement No."},{key:2,value:"RED"},{key:3,value:"GREEN"},{key:4,value:"BLUE"}].map(el => <div key={el.key} className={styles.ColumnWrapper}>
        <div className={styles.ColumnHeader}>{el.value}</div>
        <div className={styles.ColumnBodyWrapper}>
        {[{key:1},{key:2},{key:3},{key:4},{key:5},{key:6},{key:7},{key:8}].map(item => <div key={item.key} className={styles.ColumnBody} >{item.key}</div>)}
        </div>
    </div>)}
</div>
}

export default RGBRecord