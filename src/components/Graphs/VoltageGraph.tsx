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
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);
type Props = {
  data: { id: number; x: number; y: number }[];
};

const VoltageGraph = ({ data }: Props) => {
  const chatData = {
    labels: data.map((el: any) => el.x),
    datasets: [
      {
        label: "Voltage",
        data: data.map((el: any) => el.y),
        tension: 0.4,
        showLine: true,
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
        pointRadius: 2,
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
  };
  return (
    <>
      <Line data={chatData} options={options} />
    </>
  );
};

export default VoltageGraph;