import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";

const RGBRecord = () => {
  const { state } = useLocation() || {};
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.Wrapper}>
      {[
        { key: 1, value: "Measuement No" },
        { key: 2, value: "RED" },
        { key: 3, value: "GREEN" },
        { key: 4, value: "BLUE" },
      ].map((el:any) => (
        <div key={el.key} className={styles.ColumnWrapper}>
          <div className={styles.ColumnHeader}>{el.value}</div>
          <div className={styles.ColumnBodyWrapper}>
            {state &&
              state.data &&
              state.data.selectedData &&
              state.data.selectedData.data.map((item: any) => (
                <div key={item['Measuement No']} className={styles.ColumnBody}>
                  {el.value && item[el.value]}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RGBRecord;
