import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { stockList } from 'constants/stock';
import { chartOption } from 'constants/chart';
import { fetchStockDataFromCsv } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import { CalendarFormat } from 'constants/calendar';

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
  const [endDate, setEndDate] = useState(getTodayDate());

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
        const startDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(startDate).format(CalendarFormat)
        );
        const endDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(endDate).format(CalendarFormat)
        );

        const stock = [
          stockAll[0],
          ...stockAll.slice(startDateIndex, endDateIndex + 1),
        ];

        const priceList = stock.slice(1).map((el) => parseInt(el[4], 10));

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
          data: stock.slice(1).map((el) => el[0]),
        };

        ref.yAxis = {
          ...ref.yAxis,
        };

        ref.series = [
          ...ref.series,
          {
            data: stock.slice(1).map((el) => parseInt(el[4], 10)),
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
  }, [startDate, endDate]);

  return (
    <Container>
      <StockCalendar
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      {isLoaded && <StockChart chartData={optionExtraHigh} />}
      {isLoaded && <StockChart chartData={optionHigh} />}
      {isLoaded && <StockChart chartData={option} />}
      {isLoaded && <StockChart chartData={optionLow} />}
    </Container>
  );
};

export default Dashboard;
