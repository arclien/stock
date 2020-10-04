import React from 'react';
import { useLocation } from 'react-router-dom';

import { stockList } from 'constants/stock';
import Routes from 'routers//routes';

import { Container, StockList, StockItem, StockText } from './Navbar.styles';

const NavBar = () => {
  const { pathname } = useLocation();
  const { stock, root } = Routes;

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
            <StockItem key={el.code} to={`${stock.url}${el.code}`}>
              <StockText active={pathname === `${stock.url}${el.code}`}>
                {`${el.name} (${el.code})`}
              </StockText>
            </StockItem>
          ))}
      </StockList>
    </Container>
  );
};

export default NavBar;
