const root = {
  path: '/stock',
  url: '/stock',
  description: 'Dashboard Page',
};

const stock = {
  path: '/stock/code/:code',
  url: '/stock/code/',
  description: 'Stock Page',
};

const stockListPage = {
  path: '/stock/list',
  url: '/stock/list/',
  description: 'Stock List Page',
};

const tag = {
  path: '/stock/tag/:tag',
  url: '/stock/tag/',
  description: 'Tag Page',
};

export default {
  root,
  stock,
  stockListPage,
  tag,
};
