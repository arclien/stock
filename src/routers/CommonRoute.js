import React from 'react';
import { Route } from 'react-router-dom';

const CommonRoute = ({ children, path, ...rest }) => {
  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
};

export default CommonRoute;
