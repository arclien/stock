import React from 'react';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { GlobalTheme } from 'remember-ui';

import Routes from 'routers//routes';
import CommonRoute from 'routers/CommonRoute';
import NavBar from 'components/NavBar/NavBar';
import Stock from 'pages/Stock/Stock';
import Dashboard from 'pages/Dashboard/Dashboard';

import { AppBody } from './App.styles';

function App() {
  const { root, stock } = Routes;

  return (
    <BrowserRouter>
      <AppBody>
        <GlobalTheme />
        <NavBar />
        <Switch>
          <CommonRoute path={stock.path}>
            <Stock />
          </CommonRoute>
          <CommonRoute path={root.path}>
            <Dashboard />
          </CommonRoute>
          <Redirect to={root.path} />
        </Switch>
      </AppBody>
    </BrowserRouter>
  );
}

export default App;
