import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

type Props = {
  data: { time: number; temp: number }[];
  showPoint: boolean;
  capturePoint: any;
  title?: string;
  temperatureUnit?: string;
  maxTempValue?: number;
  labels: [];
  isRunning: boolean;
};

const AppexCharts = React.memo(
  ({
    data,
    showPoint,
    capturePoint,
    title,
    temperatureUnit = "c",
    maxTempValue,
    labels,
    isRunning = false,
  }: Props) => {
    const [graphData, setGraphData] = useState<any>(data);
    const [graphCapturedPoints, setGraphCapturedPonts] =
      useState<any>(capturePoint);
    const yAxisScale =
      title === "Voltage"
        ? { min: -12, max: 12 }
        : {
            min: 0,
            max: maxTempValue
              ? temperatureUnit === "c"
                ? maxTempValue
                : Number(Number((9 / 5) * Number(maxTempValue) + 32).toFixed(0))
              : 50,
          };

    console.log("??>> capturePoint ", graphCapturedPoints);
    const state: any = {
      seriesSmall: [
        {
          name: title,
          data: graphData.map((el: any) =>
            temperatureUnit === "f"
              ? ((9 / 5) * el.temp + 32).toFixed(1)
              : el.temp
          ),
        },
      ],
      optionsSmall: {
        fill: {
          colors: ["#A8D8D1"], // tochange the color of filled area
        },
        colors: ["#A8D8D1", graphCapturedPoints], // to change the color of line
        chart: {
          id: "ig",
          group: "social",
          type: "area",
        //   height: 200,
        //   width: 150,
          // tension: 0.4,
          stacked: false,
        //   zoom: {
        //       enabled: true,
        //       type: "x",
        //       autoScaleYaxis: true, // now working fory axis :- https://github.com/apexcharts/apexcharts.js/issues/1260
        //       // zoomedArea: {
        //       //   fill: {
        //       //     color: "#90CAF9",
        //       //     opacity: 0.4,
        //       //   },
        //       //   stroke: {
        //       //     color: "#0D47A1",
        //       //     opacity: 0.4,
        //       //     width: 1,
        //       //   },
        //       // },
        //     },
            events: {

              beforeZoom: function(chartContext:any, axis:any) {
                  console.log("in the before zoom :- ",chartContext, axis)
                  return {
                    xaxis: {
                      min: axis?.xaxis?.min > 0 ? axis?.xaxis?.max - axis?.xaxis?.min > 4 ? axis?.xaxis?.min : chartContext?.minX : 0,
                      max: axis?.xaxis?.max > labels[labels?.length-1] ? labels[labels?.length-1] : axis?.xaxis?.max - axis?.xaxis?.min > 4 ? axis?.xaxis?.max : chartContext?.maxX
                    }
                  }
              }
            },

          //     zoomed: function (chartContext: any, b:any) {
          //     //   console.log("xAxis", xaxis, yaxis);
          //     console.log("zoome d ;- ",chartContext,b)
          //     },
          //     selection: function (chartContext: any, b:any) {
          //     //   console.log("Selecton", xaxis, yaxis);
          //     console.log("selection d ;- ",chartContext,b)

          //     },
          //     dataPointSelection: (
          //       event: any,
          //       chartContext: any,
          //       config: any
          //     ) => {
          //       console.log("datapoint", chartContext, config);
          //     },

          //   },
          toolbar: {
            autoSelected:"pan",// "zoom",
            tools: {
              download: false, // hide download options
            },
          },
        },
        dataLabels: {
          // enabledOnSeries:[1,2,0,4],
          formatter: function (val: any, opts: any) {
            // to show only few labels
            console.log("??>>>>>>>>>>> ", val, opts);
            console.log(
              "??>>>>>>>>>> points :- ",
              showPoint,
              capturePoint,
              graphCapturedPoints
            );
            if (!showPoint) {
              return opts?.w?.globals?.colors[1][opts?.dataPointIndex] > 0
                ? val
                : undefined;
            } else return "0" // val;
          },
          style: {
            fontSize: "5px", // "9px"
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            colors: ["#424C58"], // background color for labels
            backgroundColor: "grey",
          },
          background: {
            enabled: true,
            foreColor:"#424C58", // "#FFFFFF", // color for labels
            backColor: "#424C58",
            padding: 2, // 1
            borderRadius: 4, // 50
            borderWidth: 1,
            borderColor: "none",
            opacity: 0.9,
            color: "green",
            backgroundColor: "grey",
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: "#000",
              opacity: 0.45,
            },
          },
        },
        stroke: {
          show: true,
          curve: "straight", // change the style of line in graph
          // curve: ['smooth', 'straight', 'stepline'],
          lineCap: "round",
          colors: undefined,
          width: 3, // wind of line in graph
          dashArray: 0,
        },
        xaxis: {
          type: "numeric",
        //   categories:
        //     graphData?.length > 10
        //       ? isRunning
        //         ? []
        //         : labels
        //         ? labels
        //         : graphData.map((el: any) => Number(el.time.toFixed(0)))
        //       : isRunning
        //       ? labels.slice(0, 10)
        //       : labels
        //       ? labels
        //       : graphData.map((el: any) => Number(el.time.toFixed(0))),
          categories:
            graphData?.length > 10
            ? labels.slice(0,graphData?.length)
            : labels.slice(0, 10),
        //   categories: // if you want to show extra points on x-axis
        //       graphData?.length > 10
        //         ? labels.slice(0,isRunning ? graphData?.length : undefined)
        //         : labels.slice(0, 10),
          tickPlacement: "between",
          floating: false,
          tickAmount: 9, //"dataPoints", // how many points show
          min: graphData?.length > 10 ? graphData?.length - 10 : 0,
          decimalsInFloat:0,// to show how many values will show in decimal
          // max: graphData?.length > 8 ? labels?.length - graphData?.length : 9
          offsetX:0
        },
        yaxis: {
          ...yAxisScale,
          decimalsInFloat:0, // to show how many values will show in decimal
          // max:24,
          // min:-26
        },
        grid: {
          show: false, // to hilde background horizontial lines
          padding:{
            left:15, // add padding from left(y-axis) 
          }
        },
        //   colors: ["#008FFB"],
      },
    };
    console.log("??>> labels", labels);
    React.useEffect(() => {
      if (data && data.length) {
        setGraphData([...data]);
      } else {
        setGraphData([]);
      }
    }, [data]);

    useEffect(() => {
      if (capturePoint && capturePoint.length) {
        setGraphCapturedPonts([...capturePoint]);
      } else {
        setGraphCapturedPonts([]);
      }
    }, [capturePoint]);

    return (
      <div>
        <ReactApexChart
          options={state.optionsSmall}
          series={state.seriesSmall}
          type="area"
          height={window.innerWidth > 580 ? (title === "Temperature " ? 210 : 250) : 200}
          width={window.innerWidth > 580 ? 500 : 250}
        />
      </div>
    );
  }
);

export default AppexCharts;
