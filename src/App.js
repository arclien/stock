import React from 'react';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { GlobalTheme } from 'remember-ui';

import { StockProvider } from 'context/StockContext';
import Routes from 'routers/routes';
import CommonRoute from 'routers/CommonRoute';
import NavBar from 'components/NavBar/NavBar';
import Stock from 'pages/Stock/Stock';
import Dashboard from 'pages/Dashboard/Dashboard';
import Tag from 'pages/Tag/Tag';

import { AppBody } from './App.styles';

function App() {
  const { root, stock, tag } = Routes;

  return (
    <StockProvider>
      <BrowserRouter>
        <AppBody>
          <GlobalTheme />
          <NavBar />
          <Switch>
            <CommonRoute path={stock.path}>
              <Stock />
            </CommonRoute>
            <CommonRoute path={tag.path}>
              <Tag />
            </CommonRoute>
            <CommonRoute path={root.path}>
              <Dashboard />
            </CommonRoute>
            <Redirect to={root.path} />
          </Switch>
        </AppBody>
      </BrowserRouter>
    </StockProvider>
  );
}

export default App;
