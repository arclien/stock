import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Routes from 'routers/routes';

import { Container, StockList, StockItem, StockText } from './Navbar.styles';

const NavBar = ({ stockList }) => {
  const { pathname } = useLocation();
  const { stock, tag, root } = Routes;
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    const tags = new Set([
      ...stockList
        .map((el) => el[6].split(','))
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter((el) => el !== '')
        .map((el) => el.trim()),
    ]);
    setTagList([...tags]);
  }, [stockList]);

  return (
    <Container>
      <StockList>
        <StockItem to={`${root.path}`}>
          <StockText active={pathname === `${root.path}`}>
            {`${root.description}`}
          </StockText>
        </StockItem>
        {stockList &&
          stockList.map((el) => (
            <StockItem key={el[0]} to={`${stock.url}${el[0]}`}>
              <StockText active={pathname === `${stock.url}${el[0]}`}>
                {`${el[1]} (${el[0]})`}
              </StockText>
            </StockItem>
          ))}
        {tagList &&
          tagList.map((el) => (
            <StockItem key={el} to={`${tag.url}${el}`}>
              <StockText active={pathname === `${tag.url}${el}`}>
                {`${el}`}
              </StockText>
            </StockItem>
          ))}
      </StockList>
    </Container>
  );
};

export default NavBar;
