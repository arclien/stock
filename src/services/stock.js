export const fetchStockListFromCsv = async () => {
  const response = await fetch(
    `${window.location.origin}/stock/data/stock_list.csv`
  );
  const returnValue = [];
  const data = await response.text();
  const table = data.split(/\n/);
  table.forEach((row) => {
    const columns = row.split(',');
    returnValue.push(columns);
  });
  return returnValue;
};

export const fetchStockDataFromCsv = async (stockNumber) => {
  const response = await fetch(
    `${window.location.origin}/stock/data/${stockNumber}.csv`
  );
  const returnValue = [];
  const data = await response.text();
  const table = data.split(/\n/).slice(1);
  table.forEach((row) => {
    const columns = row.split(',');
    returnValue.push(columns);
  });
  return returnValue;
};
