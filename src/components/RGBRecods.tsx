import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";

const RGBRecord = () => {
  const { state } = useLocation() || {};
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.Wrapper}>
      {[
        {id:0, key: 1, value: "Measuement No" },
        {id:1, key: 2, value: "RED" },
        {id:2, key: 3, value: "GREEN" },
        {id:3, key: 4, value: "BLUE" },
      ].map((el:any) => (
        <div key={el.key} className={styles.ColumnWrapper}>
          <div className={styles.ColumnHeader} style={el?.id === 0 ? {borderTopLeftRadius: 5,borderTopRightRadius:5,borderRight:"1px solid #B6B5B5"} : el?.id === 3 ? {borderTopRightRadius:5,borderTopLeftRadius:5} : {borderRight:"1px solid #B6B5B5",borderTopRightRadius:5,borderTopLeftRadius:5}}>{el.value}</div>
          <div className={styles.ColumnBodyWrapper} style={el?.id === 0 ? {borderTopLeftRadius: 5} : el?.id === 3 ? {borderTopRightRadius:5} : {}}>
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
