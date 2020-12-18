import React, { useState, createContext, useEffect } from 'react';

import { fetchStockDataFromCsv } from 'services/stock';
import { TRELLO_BOARD_STUDY_ID } from 'constants/trello';
import { getLabelsOnBoard, getCardsOnBoard } from 'services/trello';
import { authTrello } from 'services/trelloApi';

const Context = createContext();

const { Provider, Consumer: StockConsumer } = Context;
let STOCK_DATA_LIST = {};

const StockProvider = ({ children }) => {
  const [stockList, setStockList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [cardObjectList, setCardObjectList] = useState([]);
  const [labelObjectList, setLabelObjectList] = useState([]);

  useEffect(() => {
    (async () => {
      await authTrello().then(async () => {
        const _labels = await getLabelsOnBoard(TRELLO_BOARD_STUDY_ID);
        setLabelObjectList(_labels);
        const tags = _labels.reduce((acc, cur) => {
          return [...acc, cur.name];
        }, []);
        setTagList([...tags]);

        const _cards = await getCardsOnBoard(TRELLO_BOARD_STUDY_ID);
        setCardObjectList(_cards);
        const _stockList = _cards.map((card) => {
          const desc = JSON.parse(card.desc);
          const array = [
            desc.code,
            card.name,
            desc.nation,
            '1',
            desc.created_at,
            card.due ? card.due.split('T')[0] : '',
            card.labels.map((label) => label.name).join('/'),
          ];
          return array;
        });
        setStockList(_stockList);
        STOCK_DATA_LIST = _stockList.reduce(
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
      });
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
    const data = await fetchStockDataFromCsv(stockCode);

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
          tagList,
          labelObjectList,
          cardObjectList,
          STOCK_DATA_LIST,
        },
        actions: { getStockData, setTagList, setCardObjectList },
      }}
    >
      {children}
    </Provider>
  );
};

const StockContext = Context;

export { StockProvider, StockConsumer, StockContext };
