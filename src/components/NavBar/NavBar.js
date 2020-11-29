import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import useDebounce from 'hooks/useDebounce';
import Routes from 'routers/routes';
import { StockContext } from 'context/StockContext';

import {
  Container,
  StockList,
  StockItem,
  StockText,
  PageTitle,
  SearchInput,
} from './Navbar.styles';

const NavBar = () => {
  const { pathname } = useLocation();
  const { stock, tag, root, stockListPage } = Routes;
  const [currentStock, setCurrentStock] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debounceSearchKeyword = useDebounce(searchKeyword, 500);

  const {
    state: { stockList, tagList },
  } = useContext(StockContext);

  useEffect(() => {
    const stockCode = pathname.replace(stock.url, '');
    const _stock = stockList.find((el) => el[0] === stockCode);
    setCurrentStock(_stock);
  }, [pathname, stock.url, stockList]);

  useEffect(() => {
    (async function searchStockList() {
      if (debounceSearchKeyword) {
        const result = stockList.filter(
          (el) =>
            el[0].includes(debounceSearchKeyword) ||
            el[1].includes(debounceSearchKeyword) ||
            el[6].includes(debounceSearchKeyword)
        );
        setSearchResults([...result]);
      } else {
        setSearchResults([]);
      }
    })();
  }, [debounceSearchKeyword, stockList]);

  const getRelatedStockList = useCallback(
    (_tag) => [
      ...stockList.reduce(
        (acc, cur) => (cur[6].includes(_tag) ? acc.concat([cur]) : acc),
        []
      ),
    ],
    [stockList]
  );

  const handleChange = ({ target: { value } }) => {
    setSearchKeyword(value.trim());
  };

  return (
    <Container>
      <StockList>
        <StockItem to={`${root.path}`}>
          <StockText active={pathname === `${root.path}`}>
            {`${root.description}`}
          </StockText>
        </StockItem>
        <StockItem to={`${stockListPage.path}`}>
          <StockText active={pathname === `${stockListPage.path}`}>
            {`${stockListPage.description}`}
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
      <StockList>
        <SearchInput
          type="text"
          name="searchKeyword"
          placeholder="종목, 코드, 태그를 검색"
          maxLength={20}
          value={searchKeyword}
          onChange={handleChange}
        />
        {searchResults &&
          searchResults.map((el) => (
            <StockItem key={el[0]} to={`${stock.url}${el[0]}`}>
              <StockText active={pathname === `${stock.url}${el[0]}`}>
                {`${el[1]} (${el[0]})`}
              </StockText>
            </StockItem>
          ))}
      </StockList>
    </Container>
  );
};

export default NavBar;
