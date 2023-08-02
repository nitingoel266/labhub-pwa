import { useLocation } from "react-router-dom";
import styles from "../styles/TemperatureRecords.module.css";
import {getDayName,getMonthName} from "./Constants"

const RGBRecord = () => {

  const { state } = useLocation() || {};

  const date:any = state?.data?.selectedData?.date ? (`${getDayName(new Date(state.data.selectedData.date).getDay())}, ${getMonthName(new Date(state.data.selectedData.date).getMonth())} ${new Date(state.data.selectedData.date).getDate()} ${new Date(state.data.selectedData.date).getFullYear()}`) : ""
  return (
    <div role="alert" aria-labelledby="dialog_label" aria-describedby="screen_desc" className={styles.Wrapper}>
       <div className={styles.HeaterTextWrapper} style={{marginBottom:8,width:790}}>
        <div>{date}</div>
        <div>{state?.data?.selectedData?.time}</div>
      </div>
      <div className={styles.HeaterTextWrapper} style={{marginBottom:8,width:790}}>
        <div>{state?.data?.selectedData?.deviceWithClientName}</div>
        <div>{" "}</div>
      </div>
      <div className={styles.HeaterTextWrapper} style={{marginBottom:25,width:790}}>
        <div>{state?.data?.selectedData?.isCalibratedAndTested ? "Calibrated and Tested" : ""}</div>
        <div>{" "}</div>
      </div>
      <div className={styles.HeaterAbsorbanceWrapper} >
        Absorbance
      </div>
      <div className={styles.SubWrapper}>
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
                  {/* {el.value && item[el.value]} */}
                  {el.key && el.key === 1 ? item[el.value] : (item[el.value] === 0 ? "+0.00" : `${item[el.value] >= 0 ? "+" : ""} ${Number(item[el.value]).toFixed(2)}`)}

                </div>
              ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default RGBRecord;
