import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

import { readString } from "react-papaparse";
import "./App.css";

const STOCK_LIST = [
  { name: "삼성전자", code: "005930" },
  { name: "SK하이닉스", code: "000660" },
  { name: "NAVER", code: "035420" },
  { name: "삼성바이오로직스", code: "207940" },
  { name: "LG화학", code: "051910" },
  { name: "셀트리온", code: "068270" },
  { name: "삼성전자우", code: "005935" },
  { name: "삼성SDI", code: "006400" },
  { name: "카카오", code: "035720" },
  { name: "현대차", code: "005380" },
  { name: "LG생활건강", code: "051900" },
  { name: "현대모비스", code: "012330" },
  { name: "삼성물산", code: "028260" },
  { name: "엔씨소프트", code: "036570" },
  { name: "SK", code: "034730" },
  { name: "삼성전기", code: "009150" },
  { name: "삼성에스디에스", code: "018260" },
  { name: "KB금융", code: "105560" },
  { name: "기아차", code: "000270" },
  { name: "SK이노베이션", code: "096770" },
  { name: "대상", code: "001680" },
  { name: "농심", code: "004370" },
  { name: "휴비스", code: "079980" },
  { name: "하이트진로", code: "000080" },
];

const getOptions = () => ({
  legend: {
    data: STOCK_LIST.map((el) => `${el.name}/${el.code}`),
  },
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
  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState(getOptions());
  const [optionHigh, setOptionHigh] = useState(getOptions());
  const [optionLow, setOptionLow] = useState(getOptions());

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

      const stockDataHigh = {
        ...optionHigh,
        xAxis: {
          ...optionHigh.xAxis,
        },
        yAxis: {
          ...optionHigh.yAxis,
        },
        series: [...optionHigh.series],
      };

      const stockDataLow = {
        ...optionLow,
        xAxis: {
          ...optionLow.xAxis,
        },
        yAxis: {
          ...optionLow.yAxis,
        },
        series: [...optionLow.series],
      };

      const fetchAllData = [];
      STOCK_LIST.map((el) => el.code).forEach(async (number) => {
        fetchAllData.push(fetchDataFromCsv(number));
      });

      Promise.all(fetchAllData).then((data) => {
        // let minValue;
        // let maxValue;
        // let interval;
        data.forEach(({ data: stock }, index) => {
          const length = stock.length;
          const priceList = stock
            .slice(1, length - 1)
            .map((el) => parseInt(el[4], 10));

          const mean = (Math.min(...priceList) + Math.max(...priceList)) / 2;
          let ref =
            mean > 200000
              ? stockDataHigh
              : mean < 100000
              ? stockDataLow
              : stockData;

          ref.xAxis = {
            ...ref.xAxis,
            data: stock.slice(1, length - 1).map((el) => el[0]),
          };

          // minValue = minValue
          //   ? Math.min(minValue, ...priceList)
          //   : Math.min(...priceList);
          // maxValue = maxValue
          //   ? Math.max(maxValue, ...priceList)
          //   : Math.max(...priceList);

          // interval = Math.floor((maxValue - minValue + 10000) / 10);

          ref.yAxis = {
            ...ref.yAxis,
            // min: minValue - interval < 0 ? 0 : minValue - interval,
            // max: maxValue + interval,
            // interval: interval,
          };

          ref.series.push({
            data: stock.slice(1, length - 1).map((el) => parseInt(el[4], 10)),
            type: "line",
            name: `${STOCK_LIST[index]["name"]}/${STOCK_LIST[index]["code"]}`,
          });
        });
        setLoaded(true);
        setOption(stockData);
        setOptionHigh(stockDataHigh);
        setOptionLow(stockDataLow);
      });
    }
    getData();
  }, []);
  return (
    <div className="App">
      {STOCK_LIST &&
        STOCK_LIST.map((el) => (
          <div>{`종목이름 :${el.name}/종목코드 : ${el.code}`}</div>
        ))}
      {isLoaded && (
        <ReactEcharts
          style={{ height: "700px", width: "100%" }}
          option={optionHigh}
        />
      )}
      {isLoaded && (
        <ReactEcharts
          style={{ height: "700px", width: "100%" }}
          option={option}
        />
      )}

      {isLoaded && (
        <ReactEcharts
          style={{ height: "700px", width: "100%" }}
          option={optionLow}
        />
      )}
    </div>
  );
}

export default App;
