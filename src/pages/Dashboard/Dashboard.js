import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { chartOption } from 'constants/chart';
import { CalendarFormat } from 'constants/calendar';
import { LOCALE } from 'constants/locale';
import { fetchStockDataFromCsv } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import { getCurrency } from 'utils/chart';

import { Container } from './Dashboard.styles';

const Dashboard = ({ stockList }) => {
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
  const [optionUs, setOptionUs] = useState({
    ...chartOption,
  });
  const [startDate, setStartDate] = useState('2020-01-02');
  const [endDate, setEndDate] = useState(getTodayDate());

  useEffect(() => {
    const stockData = { ...chartOption };
    const stockDataHigh = { ...chartOption };
    const stockDataExtraHigh = { ...chartOption };
    const stockDataLow = { ...chartOption };
    const stockDataUs = { ...chartOption };
    const fetchAllData = [];

    stockList
      .map((el) => el[0])
      .forEach(async (number) => {
        fetchAllData.push(fetchStockDataFromCsv(number));
      });

    Promise.all(fetchAllData).then((data) => {
      data.forEach(({ data: stockAll }, index) => {
        const currentStock = stockList[index];
        const currency = (currentStock && currentStock[2]) || LOCALE.KO;
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

        const priceList = stock
          .slice(1)
          .map((el) => {
            if (el[4] !== '0') return parseInt(el[4], 10);
            return null;
          })
          .filter((el) => el);

        const mean = (Math.min(...priceList) + Math.max(...priceList)) / 2;
        const ref =
          // eslint-disable-next-line no-nested-ternary
          currency === LOCALE.US
            ? stockDataUs
            : // eslint-disable-next-line no-nested-ternary
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
          axisLabel: {
            formatter: `{value} ${getCurrency(currentStock)}`,
          },
        };

        ref.series = [
          ...ref.series,
          {
            data: stock.slice(1).map((el) => {
              if (el[4] !== '0') {
                if (currentStock && currentStock[2] === LOCALE.KO) {
                  return parseInt(el[4], 10);
                }
                if (currentStock && currentStock[2] === LOCALE.US) {
                  return parseFloat(el[4]);
                }
                return parseInt(el[4], 10);
              }
              return null;
            }),
            type: 'line',
            connectNulls: true,
            name: `${currentStock[1]}/${currentStock[0]}`,
          },
        ];
      });
      setOption(stockData);
      setOptionHigh(stockDataHigh);
      setOptionExtraHigh(stockDataExtraHigh);
      setOptionLow(stockDataLow);
      setOptionUs(stockDataUs);
      setLoaded(true);
    });
  }, [startDate, endDate, stockList]);

  return (
    <Container>
      <StockCalendar
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      {isLoaded && (
        <StockChart stockList={stockList} chartData={optionExtraHigh} />
      )}
      {isLoaded && <StockChart stockList={stockList} chartData={optionHigh} />}
      {isLoaded && <StockChart stockList={stockList} chartData={option} />}
      {isLoaded && <StockChart stockList={stockList} chartData={optionLow} />}
      {isLoaded && <StockChart stockList={stockList} chartData={optionUs} />}
    </Container>
  );
};

export default Dashboard;
