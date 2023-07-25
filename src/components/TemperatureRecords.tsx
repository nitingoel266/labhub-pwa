import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";
import {getDayName,getMonthName} from "./Constants"

const TemperatureRecord = () => {

  const { state } = useLocation() || {};

  const date:any = state?.data?.selectedData?.date ? (`${getDayName(new Date(state.data.selectedData.date).getDay())}, ${getMonthName(new Date(state.data.selectedData.date).getMonth())} ${new Date(state.data.selectedData.date).getDate()} ${new Date(state.data.selectedData.date).getFullYear()}`) : ""
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.Wrapper}>
      <div className={styles.HeaterTextWrapper} style={{marginBottom:8}}>
        <div>{date}</div>
        <div>{state?.data?.selectedData?.time}</div>
      </div>
      <div className={styles.HeaterTextWrapper} style={{marginBottom:25}}>
        <div>{state?.data?.selectedData?.deviceWithClientName}</div>
        <div>{" "}</div>
      </div>
      <div className={styles.SubWrapper}>
      {[
        {id:0, key: "time", value: "Time ( Sec )" },
        {id:1, key: "temp", value: "Temperature (C)" },
      ].map((el: any) => (
        <div key={el.key} className={styles.ColumnWrapper}>
          <div className={styles.ColumnHeader} style={el?.id === 0 ? {borderTopLeftRadius: 5,borderRight:"1px solid #B6B5B5"} : {borderTopRightRadius:5}}>{el.value === "Temperature (C)" ? "Temperature (" : el?.value} {el.value === "Temperature (C)" && <span className={styles.TempratureDegreeIcon}>{" "}</span>} {el.value === "Temperature (C)" && "C )"}</div>
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
    </div>
  );
};

export default TemperatureRecord;
