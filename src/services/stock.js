import { readString } from 'react-papaparse';

export const fetchStockListFromCsv = async () => {
  const response = await fetch(
    `${window.location.origin}/stock/data/stock_list.csv`
  );
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value); // the csv text
  return readString(csv);
};

export const fetchStockDataFromCsv = async (stockNumber) => {
  const response = await fetch(
    `${window.location.origin}/stock/data/${stockNumber}.csv`
  );
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value); // the csv text
  return readString(csv);
};
