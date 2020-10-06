import React, { useEffect, useState } from 'react';

import { stockList } from 'constants/stock';
import { chartOption } from 'constants/chart';
import { fetchStockDataFromCsv } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';
import StockCalendar from 'components/StockCalendar/StockCalendar';

import { Container } from './Dashboard.styles';

const Dashboard = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState({
    ...chartOption,
  });
  const [optionHigh, setOptionHigh] = useState({
    ...chartOption,
  });
  const [optionExtraHigh, setOptionExtraHigh] = useState({
    ...chartOption,
  });
  const [optionLow, setOptionLow] = useState({
    ...chartOption,
  });
  const [startDate, setStartDate] = useState('2020-01-02');

  useEffect(() => {
    const stockData = { ...chartOption };
    const stockDataHigh = { ...chartOption };
    const stockDataExtraHigh = { ...chartOption };
    const stockDataLow = { ...chartOption };
    const fetchAllData = [];

    stockList
      .map((el) => el.code)
      .forEach(async (number) => {
        fetchAllData.push(fetchStockDataFromCsv(number));
      });

    Promise.all(fetchAllData).then((data) => {
      data.forEach(({ data: stockAll }, index) => {
        const stockIndex = stockAll.findIndex((el) => el[0] === startDate);
        const stock = [stockAll[0], ...stockAll.slice(stockIndex)];

        const { length } = stock;
        const priceList = stock
          .slice(1, length - 1)
          .map((el) => parseInt(el[4], 10));

        const mean = (Math.min(...priceList) + Math.max(...priceList)) / 2;
        const ref =
          // eslint-disable-next-line no-nested-ternary
          mean > 400000
            ? stockDataExtraHigh
            : // eslint-disable-next-line no-nested-ternary
            mean > 200000
            ? stockDataHigh
            : mean < 50000
            ? stockDataLow
            : stockData;

        ref.xAxis = {
          ...ref.xAxis,
          data: stock.slice(1, length - 1).map((el) => el[0]),
        };

        ref.yAxis = {
          ...ref.yAxis,
        };

        ref.series = [
          ...ref.series,
          {
            data: stock.slice(1, length - 1).map((el) => parseInt(el[4], 10)),
            type: 'line',
            name: `${stockList[index].name}/${stockList[index].code}`,
          },
        ];
      });
      setOption(stockData);
      setOptionHigh(stockDataHigh);
      setOptionExtraHigh(stockDataExtraHigh);
      setOptionLow(stockDataLow);
      setLoaded(true);
    });
  }, [startDate]);

  return (
    <Container>
      <StockCalendar startDate={startDate} setStartDate={setStartDate} />
      {isLoaded && <StockChart chartData={optionExtraHigh} />}
      {isLoaded && <StockChart chartData={optionHigh} />}
      {isLoaded && <StockChart chartData={option} />}
      {isLoaded && <StockChart chartData={optionLow} />}
    </Container>
  );
};

export default Dashboard;
