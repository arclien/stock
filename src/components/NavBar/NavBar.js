import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Routes from 'routers/routes';
import { StockContext } from 'context/StockContext';

import { Container, StockList, StockItem, StockText } from './Navbar.styles';

const NavBar = () => {
  const { pathname } = useLocation();
  const { stock, tag, root } = Routes;
  const [tagList, setTagList] = useState([]);

  const {
    state: { stockList },
  } = useContext(StockContext);

  useEffect(() => {
    const tags = new Set([
      ...stockList
        .map((el) => el[6].split('/'))
        .reduce((acc, cur) => acc.concat(cur), [])
        .map((el) => el.trim().replace(/"/gi, ''))
        .filter((el) => el !== ''),
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
