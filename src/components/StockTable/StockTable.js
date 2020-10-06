import React, { useEffect, useState } from 'react';

import axios from 'axios';
import XMLParser from 'react-xml-parser';
const StockTable = ({ stockCode, startDate }) => {
  const [stock, setStock] = useState('');

  let xml = new XMLParser();
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
          const { children } = xml.parseFromString(res.data);
          console.log(children);
          setStock(JSON.stringify(children));
        });
    };
    fetchData();
  }, [stockCode, xml]);

  return <>{stock && <div>{stock}</div>}</>;
};

export default StockTable;
