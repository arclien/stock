import React, { useEffect, useState } from 'react';
import axios from 'axios';
import XMLParser from 'react-xml-parser';

const StockTable = ({ stockCode, startDate }) => {
  const [stock, setStock] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://asp1.krx.co.kr/servlet/krx.asp.XMLSiseEng?code=${stockCode}`,
          {
            'Content-Type': 'application/xml; charset=utf-8',
          }
        )
        .then((res) => {
          const xml = new XMLParser();
          const { children } = xml.parseFromString(res.data);
          setStock(JSON.stringify(children));
        });
    };
    fetchData();
  }, [stockCode]);

  return <>{stock && <div>{stock}</div>}</>;
};

export default StockTable;
