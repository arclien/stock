import React, { useEffect, useState } from "react";
import krx from "krx-stock-api";
import axios from "axios";
import XMLParser from "react-xml-parser";
import ReactEcharts from "echarts-for-react";
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

  let xml = new XMLParser();
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          "https://cors-anywhere.herokuapp.com/http://asp1.krx.co.kr/servlet/krx.asp.XMLSiseEng?code=005930",
          {
            "Content-Type": "application/xml; charset=utf-8",
          }
        )
        .then((res) => {
          const { children } = xml.parseFromString(res.data);
          console.log(children);
          console.log(children[0].children);
          setStock(children[2].attributes);
          setDailyPrices(children[0].children);
          const data = children[0].children.map((el) =>
            parseInt(el.attributes.day_EndPrice.replace(",", ""), 10)
          );
          const interval = Math.floor(
            (Math.max(...data) - Math.min(...data) + 10000) / 5
          );

          setOption({
            ...option,
            xAxis: {
              ...option.xAxis,
              data: children[0].children
                .map((el) => el.attributes.day_Date)
                .reverse(),
            },
            yAxis: {
              ...option.yAxis,
              min: Math.min(...data) - interval,
              max: Math.max(...data) + interval,
              interval: interval,
            },
            series: {
              ...option.series,
              data: children[0].children
                .map((el) =>
                  parseInt(el.attributes.day_EndPrice.replace(",", ""), 10)
                )
                .reverse(),
            },
          });
        });
    };
    fetchData();
  }, []);
  return (
    <div className="App">
      {stock && <div>{stock.JongName}</div>}
      {dailyPrices &&
        dailyPrices.map((el) => (
          <div key={el.attributes.day_Volume}>
            <span> {el.attributes.day_Date}</span>
            <span> {el.attributes.day_EndPrice}</span>
          </div>
        ))}
      {dailyPrices && <ReactEcharts option={option} />}
      {option && JSON.stringify(option)}
    </div>
  );
}

export default App;
