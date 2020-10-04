import { readString } from 'react-papaparse';

export async function fetchStockDataFromCsv(stockNumber) {
  const response = await fetch(
    `${window.location.origin}/stock/data/${stockNumber}.csv`
  );
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value); // the csv text
  return readString(csv);
}
