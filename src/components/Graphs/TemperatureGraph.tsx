import * as React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "../../styles/TemperatureGraph.module.css"

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);
type Props = {
  data: { time: number; temp: number;}[];
  showPoint: boolean;
  capturePoint:any;
  title?:string;
  temperatureUnit ? :string;
  maxTempValue ? : number;
  labels ?: [];
};

const TemperatureGraph = React.memo(({ data, showPoint ,capturePoint,title,temperatureUnit='c',maxTempValue,labels}: Props) => {
  const [graphData ,setGraphData] = useState<any>(data);
  const [enableZoom, setEnableZoom] = useState<boolean>(true);
  const yAxisScale =  title === "Voltage"  ? {min: -12,max: 12,stepSize:1} : {min:0,max:maxTempValue ? (temperatureUnit === "c" ? maxTempValue : Number(Number((9 / 5) * Number(maxTempValue) + 32).toFixed(0) )) : 50};
  const chatData = {
    labels: labels ? labels : graphData.map((el: any) => el.time),
    datasets: [
      {
        label: title,
        data: graphData.map((el: any) => temperatureUnit === 'f' ? ((9 / 5) * el.temp + 32).toFixed(1) : el.temp),
        tension: 0.4,
        showLine: showPoint ? true : false,
        borderWidth: 2,
        borderColor: "#A8D8D1",
        fill: true,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(204, 225, 222,1)");
          gradient.addColorStop(1, "rgba(204, 225, 222,0.1)");
          return gradient;
        },
        pointRadius: showPoint ? 2 : capturePoint,
        pointStyle: "circle",
        pointBorderColor: "#424C58",
        pointBackgroundColor: "#424C58",
      },
    ],
  };
  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ...yAxisScale
      },
    },
    // maintainAspectRatio: false,
    // responsive: true,
    // elements: {
    //   point: {
    //     radius: 0,
    //   },
    //   line: {
    //     borderWidth: 1.5,
    //   },
    // },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: enableZoom, // SET SCROOL ZOOM TO TRUE
          },
          // pinch: {
          //   enabled: true
          // },
          // speed: 100,
        },
        pan: {
          enabled: true,
          // mode: 'xy',
          // speed: 100,
        },
      },
      legend:{
        display:false
      }
    },
  };
  const ResetZoom = () => {
    setEnableZoom(!enableZoom);
  };

  React.useEffect(() => {
    if(data && data.length){
      setGraphData([...data])
    }
  },[data])
  return (
    <>
      <Line
        data={chatData}
        options={options}
      />
      <div className={styles.ZoomButton} onClick={ResetZoom}>{enableZoom ? "Reset " : "Enable "} Zoom</div>
    </>
  );
});

export default TemperatureGraph;
