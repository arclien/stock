import React, { useEffect, useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router';

import Routes from 'routers/routes';
import { chartOption } from 'constants/chart';
import { LOCALE } from 'constants/locale';
import StockChart from 'components/StockChart/StockChart';
import StockCalendar from 'components/StockCalendar/StockCalendar';
import { getTodayDate } from 'utils/day';
import {
  getCurrency,
  getPercent,
  getIndexOfDayBetween,
  getTargetDateValue,
  getMinMaxValue,
} from 'utils/chart';
import { StockContext } from 'context/StockContext';

import { Container } from './Stock.styles';

const Stock = () => {
  const {
    params: { code: stockCode },
  } = useRouteMatch();
  const {
    state: { stockList },
    actions: { getStockData },
  } = useContext(StockContext);

  const history = useHistory();
  const { stockListPage } = Routes;

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
  const [basePriceValue, setBasePriceValue] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoaded(false);
      const currentStock = stockList.find((el) => el[0] === stockCode);
      if (stockList.length > 0 && !currentStock)
        history.replace(stockListPage.path);

      const stockData = { ...chartOption };
      const stockDataPercent = { ...chartOption };

      const stockAll = await getStockData(stockCode);
      const { startDateIndex, endDateIndex } = getIndexOfDayBetween(
        stockAll,
        startDate,
        endDate
      );

      const stock = stockAll.slice(startDateIndex, endDateIndex + 1);

      const targetDateValue = getTargetDateValue(stock, percentTargetDate);

      const _basePriceValue =
        currentStock &&
        currentStock.length > 0 &&
        parseInt(currentStock[7], 10);

      setBasePriceValue(_basePriceValue);

      const { minValue, maxValue } = getMinMaxValue(stock);

      // x축
      stockData.xAxis = {
        ...stockData.xAxis,
        data: stock.map((el) => el[0]),
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
          data: stock.map((el) => {
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
          lineStyle: {
            color: '#ff457e',
          },
          markLine: {
            slient: true,
            symbol: ['none', 'none'],
            lineStyle: {
              color: '#f58c23',
              width: 2,
              type: 'solid',
            },
            data: [
              {
                name: 'Base Price',
                yAxis: basePriceValue || 0,
                label: {
                  formatter: '{c}',
                  position: 'end',
                  distance: 10,
                },
              },
            ],
          },
        },
      ];

      stockDataPercent.series = [
        ...stockDataPercent.series,
        {
          data: stock.map((el) => {
            if (el[4] !== '0')
              return getPercent(targetDateValue, parseInt(el[4], 10));
            return null;
          }),
          type: 'line',
          connectNulls: true,
          name: `${currentStock ? currentStock[1] : ''}/${stockCode}`,
          lineStyle: {
            color: '#ff457e',
            width: 3,
          },
        },
        {
          data: stock.map((el) => {
            if (el[4] !== '0')
              return getPercent(_basePriceValue, parseInt(el[4], 10));
            return null;
          }),
          type: 'line',
          connectNulls: true,
          name: `${currentStock ? currentStock[1] : ''}/${stockCode}`,
          lineStyle: {
            color: 'rgba(87,159,251,.5)',
          },
        },
      ];

      setOption(stockData);
      setOptionPercent(stockDataPercent);
      setLoaded(true);
    };

    getData();
  }, [
    basePriceValue,
    endDate,
    getStockData,
    history,
    percentTargetDate,
    startDate,
    stockCode,
    stockList,
    stockListPage.path,
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
          <br />
          {basePriceValue > 0 && (
            <>기준 가격(0%): {basePriceValue} 원 대비 상승/하락 률</>
          )}
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

      <iframe
        id="alphaSquare"
        title="AlphaSquare Frame"
        width="85%"
        height="610"
        allowFullScreen
        src={`https://www.alphasquare.co.kr/home/market/market-summary?code=${stockCode}`}
      />
    </Container>
  );
};

export default Stock;
