import React, { useState, createContext, useEffect } from 'react';

import { fetchStockListFromCsv, fetchStockDataFromCsv } from 'services/stock';

const Context = createContext();

const { Provider, Consumer: StockConsumer } = Context;
let STOCK_DATA_LIST = {};

const StockProvider = ({ children }) => {
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await fetchStockListFromCsv();
      setStockList(data.slice(1).filter((el) => el.length > 1));
      STOCK_DATA_LIST = data
        .slice(1)
        .filter((el) => el.length > 1)
        .reduce(
          (acc, cur) => ({
            ...acc,
            [cur[0]]: {
              code: cur[0],
              name: cur[1],
              nation: cur[2],
              user_id: cur[3],
              created_at: cur[4],
              updated_at: cur[5],
              tag_list: cur[6],
              data: [],
            },
          }),
          {}
        );
    })();
  }, []);

  const getStockData = async (stockCode) => {
    if (!stockCode) return [];

    if (
      STOCK_DATA_LIST[stockCode]?.data &&
      STOCK_DATA_LIST[stockCode]?.data.length > 0
    ) {
      return STOCK_DATA_LIST[stockCode].data;
    }
    const { data } = await fetchStockDataFromCsv(stockCode);

    STOCK_DATA_LIST = {
      ...STOCK_DATA_LIST,
      [stockCode]: {
        ...STOCK_DATA_LIST[stockCode],
        data,
      },
    };

    return data;
  };

  return (
    <Provider
      value={{
        state: {
          stockList,
          STOCK_DATA_LIST,
        },
        actions: { getStockData },
      }}
    >
      {children}
    </Provider>
  );
};

const StockContext = Context;

export { StockProvider, StockConsumer, StockContext };
