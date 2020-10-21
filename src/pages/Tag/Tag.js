import React, { useEffect, useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';

import Routes from 'routers/routes';
import { chartOption } from 'constants/chart';
import { CalendarFormat } from 'constants/calendar';
import { LOCALE } from 'constants/locale';
import StockChart from 'components/StockChart/StockChart';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import { getCurrency, getPercent } from 'utils/chart';
import { getStockListByTag } from 'utils/tag';
import { StockContext } from 'context/StockContext';

import { Container } from './Tag.styles';

const Tag = () => {
  const {
    params: { tag: tagName },
  } = useRouteMatch();
  const {
    state: { stockList },
    actions: { getStockData },
  } = useContext(StockContext);

  const history = useHistory();
  const { root } = Routes;

  const [tagStockList, setTagStockList] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [option, setOption] = useState({
    ...chartOption,
  });
  const [optionUs, setOptionUs] = useState({
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
    const stockDataUs = { ...chartOption };
    const stockDataPercent = { ...chartOption };
    const fetchAllData = [];

    _tagStockList
      .map((el) => el[0])
      .forEach(async (number) => {
        fetchAllData.push(getStockData(number));
      });

    Promise.all(fetchAllData).then((data) => {
      data.forEach((stockAll, index) => {
        const currentStock = _tagStockList[index];

        const currency = (currentStock && currentStock[2]) || LOCALE.KO;
        let startDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(startDate).format(CalendarFormat)
        );
        startDateIndex = startDateIndex <= 0 ? 0 : startDateIndex;

        let endDateIndex = stockAll.findIndex(
          (el) => el[0] === dayjs(endDate).format(CalendarFormat)
        );
        endDateIndex = endDateIndex <= 0 ? stockAll.length - 1 : endDateIndex;

        const stock = [
          stockAll[0],
          ...stockAll.slice(startDateIndex, endDateIndex + 1),
        ];

        let targetDateValue = null;

        if (stock.find((el) => el[0] === percentTargetDate)) {
          targetDateValue = parseInt(
            stock.find((el) => el[0] === percentTargetDate)[4],
            10
          );
          if (targetDateValue === 0) {
            const _valueDate = stock.find((el) => el[4] !== '0');
            targetDateValue = _valueDate ? _valueDate[4] : null;
          }
        } else if (stock[1]) {
          targetDateValue = stock[1][4];
        }

        const ref = currency === LOCALE.US ? stockDataUs : stockData;

        ref.xAxis = {
          ...ref.xAxis,
          data: stock.slice(1).map((el) => el[0]),
        };
        stockDataPercent.xAxis = {
          ...ref.xAxis,
        };

        ref.yAxis = {
          ...ref.yAxis,
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
      setOptionUs(stockDataUs);
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
    getStockData,
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

      {isLoaded && tagStockList.find((el) => el[2] === LOCALE.US) && (
        <StockChart stockList={tagStockList} chartData={optionUs} />
      )}
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
