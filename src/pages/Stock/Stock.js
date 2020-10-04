import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { stockList } from 'constants/stock';
import { chartOption } from 'constants/chart';
import { fetchStockDataFromCsv, getRelativePercent } from 'services/stock';
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
  const [percentTargetDate, setPercentTargetDate] = useState('2015-01-02');

  const onChartClick = (params) => {
    const { name } = params;
    setPercentTargetDate(name);
  };

  useEffect(() => {
    const getData = async () => {
      const stockData = { ...chartOption };
      const stockDataPercent = { ...chartOption };
      const { data: stock } = await fetchStockDataFromCsv(stockCode);

      const { length } = stock;

      const targetDateValue = parseInt(
        stock.find((el) => el[0] === percentTargetDate)[4],
        10
      );

      stockData.xAxis = {
        ...stockData.xAxis,
        data: stock.slice(1, length - 1).map((el) => el[0]),
      };
      stockDataPercent.xAxis = {
        ...stockDataPercent.xAxis,
        data: stock.slice(1, length - 1).map((el) => el[0]),
      };

      stockData.yAxis = {
        ...stockData.yAxis,
      };
      stockDataPercent.yAxis = {
        ...stockDataPercent.yAxis,
        axisLabel: {
          formatter: '{value} %',
        },
      };

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
            .map((el) =>
              getRelativePercent(targetDateValue, parseInt(el[4], 10))
            ),
          type: 'line',
          name: `${
            stockList.find((el) => el.code === stockCode).name
          }/${stockCode}`,
        },
      ];

      setOption(stockData);
      setOptionPercent(stockDataPercent);
      setLoaded(true);
    };

    getData();
  }, [percentTargetDate, stockCode]);

  return (
    <Container>
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
    </Container>
  );
};

export default Stock;
