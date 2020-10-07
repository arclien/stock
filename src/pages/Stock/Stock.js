import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { stockList } from 'constants/stock';
import { chartOption } from 'constants/chart';
import { fetchStockDataFromCsv, getPercent, getRelative } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';
import StockTable from 'components/StockTable/StockTable';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import dayjs from 'dayjs';
import { CalendarFormat } from 'constants/calendar';

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
  const [endDate, setEndDate] = useState(getTodayDate());
  const [percentTargetDate, setPercentTargetDate] = useState(startDate);

  useEffect(() => {
    const getData = async () => {
      const stockData = { ...chartOption };
      const stockDataPercent = { ...chartOption };
      const stockDataRelative = { ...chartOption };

      const { data: stockAll } = await fetchStockDataFromCsv(stockCode);

      let startDateIndex;
      let index = 0;
      while (
        !startDateIndex ||
        (startDateIndex < 0 && index++ <= stockAll.length)
      ) {
        startDateIndex = stockAll.findIndex(
          (el) =>
            el[0] ===
            dayjs(startDate).subtract(index, 'day').format(CalendarFormat)
        );
      }

      let endDateIndex;
      index = 0;
      while (
        !endDateIndex ||
        (endDateIndex < 0 && index++ <= stockAll.length)
      ) {
        endDateIndex = stockAll.findIndex(
          (el) =>
            el[0] ===
            dayjs(endDate).subtract(index, 'day').format(CalendarFormat)
        );
      }

      const stock = [
        stockAll[0],
        ...stockAll.slice(startDateIndex, endDateIndex + 1),
      ];
      // console.log(startDateIndex, endDateIndex);

      const targetDateValue = stock.find((el) => el[0] === percentTargetDate)
        ? parseInt(stock.find((el) => el[0] === percentTargetDate)[4], 10)
        : stock[1]
        ? stock[1][4]
        : null;

      const minValue = parseInt(
        Math.min(...stock.slice(1).map((el) => parseInt(el[4], 10))),
        10
      );
      const maxValue = parseInt(
        Math.max(...stock.slice(1).map((el) => parseInt(el[4], 10))),
        10
      );

      // x축
      stockData.xAxis = {
        ...stockData.xAxis,
        data: stock.slice(1).map((el) => el[0]),
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
        min: minValue,
        max: maxValue,
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
          data: stock.slice(1).map((el) => parseInt(el[4], 10)),
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
            .slice(1)
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
            .slice(1)
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
  }, [percentTargetDate, startDate, endDate, stockCode]);

  const onChartClick = (params) => {
    const { name } = params;
    console.log(name);
    setPercentTargetDate(name);
  };

  return (
    <Container>
      <StockCalendar
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      {isLoaded && (
        <>
          종가 그래프( Y축 : 기간 내 최저가 ~ 최고가)
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
          최저가(0%) / 최고가(100%) 대비 그래프
          <StockChart
            chartData={optionRelative}
            style={{ height: '300px', width: '100%' }}
          />
        </>
      )}
      {isLoaded && <StockTable stockCode={stockCode} startDate={startDate} />}
    </Container>
  );
};

export default Stock;
