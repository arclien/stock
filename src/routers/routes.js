const root = {
  path: '/stock',
  url: '/stock',
  description: 'Main Page',
};

const stock = {
  path: '/stock/code/:code',
  url: '/stock/code/',
  description: 'Stock Page',
};

export default {
  root,
  stock,
};
