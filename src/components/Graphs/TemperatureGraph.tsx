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
  } from 'chart.js';
  import {Line} from "react-chartjs-2";

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
    data:{id:number,x:number,y:number}[];
    showPoint:boolean;
}

const TemperatureGraph = ({data,showPoint}:Props) => {
    const chatData = {
    labels:data.map((el:any) => el.time),
    datasets: [{
      label: 'Temperature',
      data: data.map((el:any) => el.temp),
      tension: 0.4,
      showLine: showPoint ? true : false,
      borderWidth: 2, 
      borderColor: '#A8D8D1', 
      fill: true,
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(204, 225, 222,1)');
        gradient.addColorStop(1, 'rgba(204, 225, 222,0.1)');
        return gradient;
      },
      pointRadius: showPoint ? 2 : 0, 
      pointStyle: 'circle', 
      pointBorderColor: '#424C58', 
      pointBackgroundColor: '#424C58', 
    }],
  };
    const options = {
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      };
    return <>
        <Line data={chatData} options={options}/>
    </>
}

export default TemperatureGraph;