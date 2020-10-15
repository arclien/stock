import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

import { chartStyle } from 'constants/chart';
import { CURRENCY } from 'constants/locale';

const defaultOption = {
  legend: {
    // data: stockList.map((el) => `${el[1]}/${el[0]}`),
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      animation: false,
    },
    // formatter: function (params) {
    //   console.log(params);
    //   return `날짜 : ${params[0].name} <br> 가격 : ${params[0].value} <br> 종목 :  ${params[0].seriesName}`;
    // },
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: `{value} ${CURRENCY.KO}`,
    },
    // min: 0,
    // max: 0,
    // interval: 0,
  },
  series: [],
};

const StockChart = ({
  chartData,
  onEvents,
  stockList,
  style = { ...chartStyle },
}) => {
  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState({ ...defaultOption });
  const [EchartsReact, setEchartsReact] = useState(null);

  useEffect(() => {
    const _option = {
      legend: {
        ...defaultOption.legend,
        data: stockList.map((el) => `${el[1]}/${el[0]}`),
      },
      tooltip: {
        ...defaultOption.tooltip,
      },
      xAxis: {
        ...defaultOption.xAxis,
        ...chartData.xAxis,
      },
      yAxis: {
        ...defaultOption.yAxis,
        ...chartData.yAxis,
      },
      series: [...defaultOption.series, ...chartData.series],
    };
    setOption(_option);

    const instance = EchartsReact?.getEchartsInstance();
    if (instance) {
      instance.clear();
      instance.setOption(_option);
    }

    setLoaded(true);
  }, [EchartsReact, chartData, stockList]);

  return (
    <>
      {isLoaded && (
        <ReactEcharts
          ref={(e) => {
            setEchartsReact(e);
          }}
          style={style}
          option={option}
          onEvents={onEvents}
        />
      )}
    </>
  );
};

export default StockChart;
