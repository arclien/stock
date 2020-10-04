import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { MaskingInput } from 'remember-ui';

import { stockList } from 'constants/stock';
import { chartOption, chartStartDate } from 'constants/chart';
import { fetchStockDataFromCsv, getPercent, getRelative } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';

import { Container } from './Stock.styles';

const Stock = () => {
  const {
    params: { code: stockCode },
  } = useRouteMatch();

  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState({
    ...chartOption,
  });
  const [optionPercent, setOptionPercent] = useState({
    ...chartOption,
  });
  const [optionRelative, setOptionRelative] = useState({
    ...chartOption,
  });
  const [startDate, setStartDate] = useState('2020-01-02');
  const [percentTargetDate, setPercentTargetDate] = useState(startDate);

  useEffect(() => {
    const getData = async () => {
      const stockData = { ...chartOption };
      const stockDataPercent = { ...chartOption };
      const stockDataRelative = { ...chartOption };

      const { data: stockAll } = await fetchStockDataFromCsv(stockCode);
      const stockIndex = stockAll.findIndex((el) => el[0] === startDate);

      const stock = [stockAll[0], ...stockAll.slice(stockIndex)];
      const { length } = stock;

      const targetDateValue = stock.find((el) => el[0] === percentTargetDate)
        ? parseInt(stock.find((el) => el[0] === percentTargetDate)[4], 10)
        : stock[1][4];

      const minValue = parseInt(
        Math.min(
          ...stock.slice(1, length - 1).map((el) => parseInt(el[4], 10))
        ),
        10
      );
      const maxValue = parseInt(
        Math.max(
          ...stock.slice(1, length - 1).map((el) => parseInt(el[4], 10))
        ),
        10
      );

      // x축
      stockData.xAxis = {
        ...stockData.xAxis,
        data: stock.slice(1, length - 1).map((el) => el[0]),
      };
      stockDataPercent.xAxis = {
        ...stockData.xAxis,
      };
      stockDataRelative.xAxis = {
        ...stockData.xAxis,
      };

      // y축
      stockData.yAxis = {
        ...stockData.yAxis,
      };
      stockDataPercent.yAxis = {
        ...stockDataPercent.yAxis,
        axisLabel: {
          formatter: '{value} %',
        },
      };
      stockDataRelative.yAxis = {
        ...stockDataPercent.yAxis,
      };

      // series Data
      stockData.series = [
        ...stockData.series,
        {
          data: stock.slice(1, length - 1).map((el) => parseInt(el[4], 10)),
          type: 'line',
          name: `${
            stockList.find((el) => el.code === stockCode).name
          }/${stockCode}`,
        },
      ];
      stockDataPercent.series = [
        ...stockDataPercent.series,
        {
          data: stock
            .slice(1, length - 1)
            .map((el) => getPercent(targetDateValue, parseInt(el[4], 10))),
          type: 'line',
          name: `${
            stockList.find((el) => el.code === stockCode).name
          }/${stockCode}`,
        },
      ];
      stockDataRelative.series = [
        ...stockDataRelative.series,
        {
          data: stock
            .slice(1, length - 1)
            .map((el) => getRelative(maxValue, minValue, parseInt(el[4], 10))),
          type: 'line',
          name: `${
            stockList.find((el) => el.code === stockCode).name
          }/${stockCode}`,
        },
      ];

      setOption(stockData);
      setOptionPercent(stockDataPercent);
      setOptionRelative(stockDataRelative);
      setLoaded(true);
    };

    getData();
  }, [percentTargetDate, startDate, stockCode]);

  const onChartClick = (params) => {
    const { name } = params;
    setPercentTargetDate(name);
  };

  const handleChange = (e) => {
    const date = e.target.value;
    if (date.length === 10) {
      const newDate = new Date(date);
      const today = new Date();
      const _chartStartDate = new Date(chartStartDate);
      if (+newDate >= +_chartStartDate && +newDate <= +today) {
        setPercentTargetDate(date);
        setStartDate(date);
      }
    }
  };
  return (
    <Container>
      <MaskingInput
        mask={[
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
        ]}
        type="text"
        name="startDate"
        value={startDate}
        required
        onChange={handleChange}
        label="시작 날짜"
        placeholder="8자리 숫자 입력(2015-01-02)"
      />

      {isLoaded && (
        <>
          종가 그래프
          <StockChart
            chartData={option}
            style={{ height: '300px', width: '100%' }}
          />
        </>
      )}
      {isLoaded && (
        <>
          {percentTargetDate}일( 기준일 = 0% ) 대비 상승/하락 률 ( 그래프 클릭
          날짜 변경 )
          <StockChart
            chartData={optionPercent}
            onEvents={{
              click: onChartClick,
            }}
            style={{ height: '300px', width: '100%' }}
          />
        </>
      )}
      {isLoaded && (
        <>
          {percentTargetDate}일( 기준일 = 0% ) 대비 상승/하락 원 ( 그래프 클릭
          날짜 변경 )
          <StockChart
            chartData={optionRelative}
            style={{ height: '300px', width: '100%' }}
          />
        </>
      )}
    </Container>
  );
};

export default Stock;
