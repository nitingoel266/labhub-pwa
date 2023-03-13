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
  data: { id: number; x: number; y: number }[];
  showPoint: boolean;
  capturePoint:any;
};

const TemperatureGraph = ({ data, showPoint ,capturePoint}: Props) => {
  const [enableZoom, setEnableZoom] = useState<boolean>(true);

  const chatData = {
    labels: data.map((el: any) => el.time),
    datasets: [
      {
        label: "Temperature",
        data: data.map((el: any) => el.temp),
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
    },
  };
  const ResetZoom = () => {
    setEnableZoom(!enableZoom);
  };
  return (
    <>
      <Line
        data={chatData}
        options={options}
      />
      <div className={styles.ZoomButton} onClick={ResetZoom}>{enableZoom ? "Reset " : "Enable "} Zoom</div>
    </>
  );
};

export default TemperatureGraph;
