import React from 'react';
import { useLocation } from 'react-router-dom';

import Routes from 'routers//routes';

import { Container, StockList, StockItem, StockText } from './Navbar.styles';

const NavBar = ({ stockList }) => {
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
