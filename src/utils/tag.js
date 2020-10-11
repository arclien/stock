export const getStockListByTag = (stockList, tag) => {
  return stockList.filter((el) => el[6] && el[6].includes(tag));
};
