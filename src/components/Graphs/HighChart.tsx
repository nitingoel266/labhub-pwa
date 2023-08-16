import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type Props = {
    data:{time:number,temp:number}[];
    capturePoint:[];
    showPoint:boolean;
    maxTempValue:number;
    dataRate:number | undefined;
    title?:string;
    temperatureUnit?:string;

}
const HighChart = React.memo(({data,dataRate=1,capturePoint,showPoint,title,temperatureUnit="c",maxTempValue}:Props) => {
  const options /* : Highcharts.Options */ = {
    chart: {
        type: 'area',
        lineColor:"#A8D8D1",
        showLines:false,
        backgroundColor:"#EFEFEF",
    },
    plotOptions:{
        area:{
            color:"#A8D8D1",
            fillColor:"#E4F3F1",
            lineWidth:2,
            fillOpacity:0.001,
            label:{enabled:true},
            point:{visible:true},
            dataLabels:{enabled:showPoint ? true :  false},
            marker:{enabled: showPoint ? true : false,fillColor:"#424C58",width:20,radius:4}

        },
        line:{
            color:"#A8D8D1"
        },
    },
        xAxis:{
            labels: {
                formatter: function(e:any,d:any) {
                    return e.value;
                },
            },

            title:{
                text:title,
                align:"left",
            },
    },
    yAxis:{
        max: title === "Voltage" ? 12 : maxTempValue
        ? temperatureUnit === "c"
          ? maxTempValue + 12
          : Number(Number((9 / 5) * Number(maxTempValue) + 32).toFixed(0))
        : 50,
        min:title === "Voltage" ? -12 : 0,
        opposite:false,
        lineWidth:1,
        margin:10,
        minPadding:10,
        gridLineWidth: 0,
    },

    time: {
      useUTC: false
    },
    rangeSelector: {
    buttons:[],
      inputEnabled: false,
    selected:0,
    },
    navigator:{enabled:true,height:20},// bottom scrollbar

    scrollbar:{enabled:true,height:5},  // bottom scroll area
    exporting: {
      enabled: false
    },

    series: [
      {
        name: title,
        data: (function () {
          const graphData:any = [];
            for(let i = 0;i < data?.length;i++){
                let yData =  temperatureUnit === "f"
                ? Number(Number((9 / 5) * data[i].temp + 32).toFixed(1))
                : data[i].temp
                graphData.push({x:data[i].time,y:yData,dataLabels:{enabled:capturePoint[i] ? true : false}, marker:{enabled:capturePoint[i] ? true : false}})
            }
            if(data?.length <= 5){
                for(let i = data?.length ; i<=5;i++){
                    graphData.push({x:i * Number(dataRate)})
    
                }
            }
          return graphData;
        })(),
      },
    ]
  };
  return (
    <HighchartsReact
      constructorType={"stockChart"}
      highcharts={Highcharts}
      options={options}
    />
  );
});

export default HighChart;
