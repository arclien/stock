import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

import { readString, CSVReader } from "react-papaparse";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "./App.css";

const getOptions = () => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      animation: false,
    },
    formatter: function (params) {
      return `날짜 : ${params[0].name} <br> 가격 : ${params[0].value}`;
    },
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
    min: 0,
    max: 0,
    interval: 0,
  },
  series: [
    {
      data: [],
      type: "line",
    },
  ],
});

function App() {
  const [stock, setStock] = useState(null);
  const [dailyPrices, setDailyPrices] = useState([]);
  const [option, setOption] = useState(getOptions());
  const [tabIndex, setTabIndex] = useState(0);
  const [chartInstance, setChartInstance] = useState(null);

  const aa = (index) => {
    setTabIndex(index);
  };
  useEffect(() => {
    async function getData() {
      console.log(chartInstance);

      // if (chartInstance) {
      //   chartInstance.dispose();
      // }

      // if (chartInstance) chartInstance.getEchartsInstance().clear();
      const response = await fetch(
        `${window.location.origin}/stock/data/000720.csv`
      );
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = readString(csv);
      console.log("---------------------------");
      console.log(results);
      console.log("---------------------------");
      setDailyPrices(results.data);

      const length = results.data.length;
      const data = results.data
        .slice(1, length - 1)
        .map((el, i) => parseInt(el[4], 10));
      const interval = Math.floor(
        (Math.max(...data) - Math.min(...data) + 10000) / 5
      );
      console.log(option);
      setOption({
        ...option,
        xAxis: {
          ...option.xAxis,
          data: results.data.slice(1, length - 1).map((el) => el[0]),
        },
        yAxis: {
          ...option.yAxis,
          min: Math.min(...data) - interval,
          max: Math.max(...data) + interval,
          interval: interval,
        },
        series: {
          ...option.series,
          data: results.data
            .slice(1, length - 1)
            .map((el) => parseInt(el[4], 10)),
        },
      });
    }
    getData();
  }, [tabIndex]);
  return (
    <div className="App">
      {stock && <div>{stock.JongName}</div>}

      {/*<Tabs onSelect={aa}>
        <TabList>
          <Tab>Title 1</Tab>
          <Tab>Title 2</Tab>
        </TabList>

        <TabPanel>
          {dailyPrices && (
            <ReactEcharts ref={(e) => setChartInstance(e)} option={option} />
          )}
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>

      */}

      {dailyPrices && (
        <ReactEcharts ref={(e) => setChartInstance(e)} option={option} />
      )}
    </div>
  );
}

export default App;
