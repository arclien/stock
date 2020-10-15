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
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import { getCurrency, getPercent } from 'utils/chart';
import { getStockListByTag } from 'utils/tag';

import { Container } from './Tag.styles';

const Tag = ({ stockList }) => {
  const {
    params: { tag: tagName },
  } = useRouteMatch();

  const history = useHistory();
  const { root } = Routes;

  const [tagStockList, setTagStockList] = useState([]);
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
    const _tagStockList = getStockListByTag(stockList, tagName);
    if (stockList.length > 0 && _tagStockList.length === 0)
      history.replace(root.path);

    setTagStockList(_tagStockList);
    const stockData = { ...chartOption };
    const stockDataPercent = { ...chartOption };
    const fetchAllData = [];

    _tagStockList
      .map((el) => el[0])
      .forEach(async (number) => {
        fetchAllData.push(fetchStockDataFromCsv(number));
      });

    Promise.all(fetchAllData).then((data) => {
      data.forEach(({ data: stockAll }, index) => {
        const currentStock = _tagStockList[index];

        const startDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(startDate).format(CalendarFormat)
        );

        let endDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(endDate).format(CalendarFormat)
        );
        endDateIndex = endDateIndex <= 0 ? stockAll.length - 1 : endDateIndex;

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

        stockData.xAxis = {
          ...stockData.xAxis,
          data: stock.slice(1).map((el) => el[0]),
        };
        stockDataPercent.xAxis = {
          ...stockData.xAxis,
        };

        stockData.yAxis = {
          ...stockData.yAxis,
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
            name: `${currentStock[1]}/${currentStock[0]}`,
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
            name: `${currentStock[1]}/${currentStock[0]}`,
          },
        ];
      });
      setOption(stockData);
      setOptionPercent(stockDataPercent);
      setLoaded(true);
    });
  }, [
    startDate,
    endDate,
    stockList,
    tagName,
    history,
    root.path,
    percentTargetDate,
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
      {isLoaded && <StockChart stockList={tagStockList} chartData={option} />}
      {isLoaded && (
        <>
          {percentTargetDate}일( 기준일 = 0% ) 대비 상승/하락 률 ( 그래프 클릭
          날짜 변경 )
          <StockChart
            stockList={tagStockList}
            chartData={optionPercent}
            onEvents={{
              click: onChartClick,
            }}
          />
        </>
      )}
    </Container>
  );
};

export default Tag;
