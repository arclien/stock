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

const tag = {
  path: '/stock/tag/:tag',
  url: '/stock/tag/',
  description: 'Tag Page',
};

export default {
  root,
  stock,
  tag,
};
