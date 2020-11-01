import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Routes from 'routers/routes';
import { StockContext } from 'context/StockContext';

import {
  Container,
  StockList,
  StockItem,
  StockText,
  PageTitle,
} from './Navbar.styles';

const NavBar = () => {
  const { pathname } = useLocation();
  const { stock, tag, root } = Routes;
  const [tagList, setTagList] = useState([]);
  const [currentStock, setCurrentStock] = useState(null);

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

  const getRelatedStockList = useCallback(
    (_tag) => [
      ...stockList.reduce(
        (acc, cur) => (cur[6].includes(_tag) ? acc.concat([cur]) : acc),
        []
      ),
    ],
    [stockList]
  );

  useEffect(() => {
    const stockCode = pathname.replace(stock.url, '');
    const _stock = stockList.find((el) => el[0] === stockCode);
    setCurrentStock(_stock);
  }, [pathname, stock.url, stockList]);

  return (
    <Container>
      <StockList>
        <StockItem to={`${root.path}`}>
          <StockText active={pathname === `${root.path}`}>
            {`${root.description}`}
          </StockText>
        </StockItem>
        {tagList &&
          tagList.map((el) => (
            <StockItem key={el} to={`${tag.url}${el}`}>
              <StockText active={pathname === `${tag.url}${el}`}>
                {`${el}`}
              </StockText>
            </StockItem>
          ))}
      </StockList>

      {pathname.includes(tag.url) && (
        <StockList>
          <PageTitle>
            {pathname.replace(tag.url, '')} 태그 관련 종목
            <br />
            {getRelatedStockList(pathname.replace(tag.url, '')).map((el) => (
              <StockItem key={el} to={`${stock.url}${el[0]}`}>
                <StockText active={pathname === `${stock.url}${el[0]}`}>
                  {`${el[1]} (${el[0]})`}
                </StockText>
              </StockItem>
            ))}
          </PageTitle>
        </StockList>
      )}

      {currentStock && (
        <StockList>
          <PageTitle>
            {`${currentStock[1]} (${currentStock[0]})`} 종목 관련 태그
            <br />
            {currentStock[6].split('/').map((el) => (
              <StockItem key={el} to={`${tag.url}${el}`}>
                <StockText active={pathname === `${tag.url}${el}`}>
                  {`${el}`}
                </StockText>
              </StockItem>
            ))}
          </PageTitle>
        </StockList>
      )}
    </Container>
  );
};

export default NavBar;
