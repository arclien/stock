import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { GlobalTheme } from 'remember-ui';

import Routes from 'routers/routes';
import CommonRoute from 'routers/CommonRoute';
import NavBar from 'components/NavBar/NavBar';
import Stock from 'pages/Stock/Stock';
import Dashboard from 'pages/Dashboard/Dashboard';
import Tag from 'pages/Tag/Tag';
import { fetchStockListFromCsv } from 'services/stock';

import { AppBody } from './App.styles';

function App() {
  const { root, stock, tag } = Routes;
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await fetchStockListFromCsv();
      setStockList(data.slice(1).filter((el) => el.length > 1));
    })();
  }, []);

  return (
    <BrowserRouter>
      <AppBody>
        <GlobalTheme />
        <NavBar stockList={stockList} />
        <Switch>
          <CommonRoute path={stock.path}>
            <Stock stockList={stockList} />
          </CommonRoute>
          <CommonRoute path={tag.path}>
            <Tag stockList={stockList} />
          </CommonRoute>
          <CommonRoute path={root.path}>
            <Dashboard stockList={stockList} />
          </CommonRoute>
          <Redirect to={root.path} />
        </Switch>
      </AppBody>
    </BrowserRouter>
  );
}

export default App;
