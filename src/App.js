import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

import { readString } from "react-papaparse";
import "react-tabs/style/react-tabs.css";

import "./App.css";

const stock_list = ["005930", "066570", "005490", "000720", "068760"];
const getOptions = () => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      animation: false,
    },
    // formatter: function (params) {
    //   console.log(params);
    //   return `날짜 : ${params[0].name} <br> 가격 : ${params[0].value} <br> 종목 :  ${params[0].seriesName}`;
    // },
  },
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value} 원",
    },
    // min: 0,
    // max: 0,
    // interval: 0,
  },
  series: [],
});

function App() {
  const [stock, setStock] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState(getOptions());

  useEffect(() => {
    async function fetchDataFromCsv(stockNumber) {
      const response = await fetch(
        `${window.location.origin}/stock/data/${stockNumber}.csv`
      );
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      return readString(csv);
    }

    function getData() {
      // console.log(chartInstance);

      // if (chartInstance) {
      //   chartInstance.dispose();
      // }

      // if (chartInstance) chartInstance.getEchartsInstance().clear();

      const stockData = {
        ...option,
        xAxis: {
          ...option.xAxis,
        },
        yAxis: {
          ...option.yAxis,
        },
        series: [...option.series],
      };

      const fetchAllData = [];
      stock_list.forEach(async (number) => {
        fetchAllData.push(fetchDataFromCsv(number));
      });

      Promise.all(fetchAllData).then((data) => {
        let minValue;
        let maxValue;
        let interval;
        data.forEach(({ data: stock }, index) => {
          const length = stock.length;
          const priceList = stock
            .slice(1, length - 1)
            .map((el) => parseInt(el[4], 10));

          stockData.xAxis = {
            ...stockData.xAxis,
            data: stock.slice(1, length - 1).map((el) => el[0]),
          };

          minValue = minValue
            ? Math.min(minValue, ...priceList)
            : Math.min(...priceList);
          maxValue = maxValue
            ? Math.max(maxValue, ...priceList)
            : Math.max(...priceList);

          interval = Math.floor((maxValue - minValue + 10000) / 10);

          stockData.yAxis = {
            ...stockData.yAxis,
            min: minValue - interval < 0 ? 0 : minValue - interval,
            max: maxValue + interval,
            interval: interval,
          };

          stockData.series.push({
            data: stock.slice(1, length - 1).map((el) => parseInt(el[4], 10)),
            type: "line",
            name: stock_list[index],
          });
        });
        setLoaded(true);
        setOption(stockData);
        console.log(stockData);
      });
    }
    getData();
  }, []);
  return (
    <div className="App">
      {stock && <div>{stock.JongName}</div>}
      {isLoaded && (
        <ReactEcharts
          style={{ height: "700px", width: "100%" }}
          option={option}
        />
      )}
    </div>
  );
}

export default App;
