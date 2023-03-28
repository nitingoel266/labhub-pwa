import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";

const VoltageRecord = () => {
  const { state } = useLocation() || {};
  return (
    <div className={styles.Wrapper}>
      {[
        { key: "time", value: "Time ( Sec )" },
        { key: "voltage", value: "Voltage ( V )" },
      ].map((el: any) => (
        <div key={el.key} className={styles.ColumnWrapper}>
          <div className={styles.ColumnHeader}>{el.value}</div>
          <div className={styles.ColumnBodyWrapper}>
            {state &&
              state.data &&
              state.data.selectedData &&
              state.data.selectedData.data.map((item: any) => (
                <div key={item.time} className={styles.ColumnBody}>
                  {el.key && item[el.key]}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoltageRecord;
