import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';

import Routes from 'routers/routes';
import { chartOption } from 'constants/chart';
import { CalendarFormat } from 'constants/calendar';
import { LOCALE } from 'constants/locale';
import { fetchStockDataFromCsv } from 'services/stock';
import StockChart from 'components/StockChart/StockChart';
// import StockTable from 'components/StockTable/StockTable';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import { getCurrency, getPercent } from 'utils/chart';

import { Container } from './Stock.styles';

const Stock = ({ stockList }) => {
  const {
    params: { code: stockCode },
  } = useRouteMatch();

  const history = useHistory();
  const { root } = Routes;

  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState({
    ...chartOption,
  });
  const [optionPercent, setOptionPercent] = useState({
    ...chartOption,
  });

  const [startDate, setStartDate] = useState('2020-01-02');
  const [endDate, setEndDate] = useState(getTodayDate());
  const [percentTargetDate, setPercentTargetDate] = useState(startDate);

  useEffect(() => {
    const getData = async () => {
      const currentStock = stockList.find((el) => el[0] === stockCode);
      if (!currentStock) history.replace(root.path);

      const stockData = { ...chartOption };
      const stockDataPercent = { ...chartOption };

      const { data: stockAll } = await fetchStockDataFromCsv(stockCode);

      const startDateIndex = stockAll.findIndex(
        (el) => el[0] === dayjs(startDate).format(CalendarFormat)
      );

      let endDateIndex;
      let index = 0;
      while (
        !endDateIndex ||
        // eslint-disable-next-line no-plusplus
        (endDateIndex < 0 && index++ <= stockAll.length)
      ) {
        endDateIndex = stockAll.findIndex(
          // eslint-disable-next-line no-loop-func
          (el) =>
            el[0] ===
            dayjs(endDate).subtract(index, 'day').format(CalendarFormat)
        );
      }

      const stock = [
        stockAll[0],
        ...stockAll.slice(startDateIndex, endDateIndex + 1),
      ];

      // eslint-disable-next-line no-nested-ternary
      const targetDateValue = stock.find((el) => el[0] === percentTargetDate)
        ? parseInt(stock.find((el) => el[0] === percentTargetDate)[4], 10)
        : stock[1]
        ? stock[1][4]
        : null;

      const minValue = parseInt(
        Math.min(
          ...stock
            .slice(1)
            .map((el) => {
              if (el[4] !== '0') return parseInt(el[4], 10);
              return null;
            })
            .filter((el) => el)
        ),
        10
      );

      const maxValue = parseInt(
        Math.max(
          ...stock
            .slice(1)
            .map((el) => {
              if (el[4] !== '0') return parseInt(el[4], 10);
              return null;
            })
            .filter((el) => el)
        ),
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

      // y축
      stockData.yAxis = {
        ...stockData.yAxis,
        min: minValue,
        max: maxValue,
        axisLabel: {
          formatter: `{value} ${getCurrency(currentStock)}`,
        },
      };
      stockDataPercent.yAxis = {
        ...stockDataPercent.yAxis,
        axisLabel: {
          formatter: '{value} %',
        },
      };

      // series Data
      stockData.series = [
        ...stockData.series,
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
          name: `${currentStock ? currentStock[1] : ''}/${stockCode}`,
        },
      ];

      stockDataPercent.series = [
        ...stockDataPercent.series,
        {
          data: stock.slice(1).map((el) => {
            if (el[4] !== '0')
              return getPercent(targetDateValue, parseInt(el[4], 10));
            return null;
          }),
          type: 'line',
          connectNulls: true,
          name: `${currentStock ? currentStock[1] : ''}/${stockCode}`,
        },
      ];

      setOption(stockData);
      setOptionPercent(stockDataPercent);
      setLoaded(true);
    };

    getData();
  }, [
    endDate,
    history,
    percentTargetDate,
    root.path,
    startDate,
    stockCode,
    stockList,
  ]);

  const onChartClick = (params) => {
    const { name } = params;
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
            stockList={stockList}
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
            stockList={stockList}
            chartData={optionPercent}
            onEvents={{
              click: onChartClick,
            }}
            style={{ height: '300px', width: '100%' }}
          />
        </>
      )}

      {/* {isLoaded && <StockTable stockCode={stockCode} startDate={startDate} />} */}
    </Container>
  );
};

export default Stock;
