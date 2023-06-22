import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";

const VoltageRecord = () => {
  const { state } = useLocation() || {};
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.Wrapper}>
      {[
        {id:0, key: "time", value: "Time ( Sec )" },
        {id:1, key: "voltage", value: "Voltage (V)" },
      ].map((el: any) => (
        <div key={el.key} className={styles.ColumnWrapper}>
          <div className={styles.ColumnHeader} style={el?.id === 0 ? {borderTopLeftRadius: 5,borderRight:"1px solid #B6B5B5"} : {borderTopRightRadius:5}}>{el.value}</div>
          <div className={styles.ColumnBodyWrapper} style={el?.id === 0 ? {borderTopLeftRadius: 5} : {borderTopRightRadius:5}}>
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
