import styles from '../styles/TemperatureRecords.module.css';

const TemperatureRecord = () => {
    return <div className={styles.Wrapper}>
            {[{key:1, value:"Time ( Sec )"},{key:2,value:"Temperature ( C )"}].map(el => <div key={el.key} className={styles.ColumnWrapper}>
                <div className={styles.ColumnHeader}>{el.value}</div>
                <div className={styles.ColumnBodyWrapper}>
                {[{key:1},{key:2},{key:3},{key:4},{key:5},{key:6},{key:7},{key:8}].map(item => <div key={item.key} className={styles.ColumnBody} >{item.key}</div>)}
                </div>
            </div>)}
    </div>
}

export default TemperatureRecord