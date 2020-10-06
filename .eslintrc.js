const path = require('path');

module.exports = {
  extends: ['react-app', 'airbnb', 'airbnb/hooks', 'prettier'],
  rules: {
    // react
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'react/no-unused-state': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-wrap-multilines': 0,
    'react/require-default-props': 0,
    'react/no-unescaped-entities': 0,
    'react/forbid-prop-types': 0,
    // 웹 접근성
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    // Javascript
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-async-promise-executor': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-param-reassign': 0,
    // Module
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling'],
        ],
        pathGroups: [
          {
            pattern: 'global-style/**',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.constant',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.text',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.styles',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.scss',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.css',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: 'assets/**',
            group: 'sibling',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
  },
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')],
        extensions: ['.js'],
      },
    },
  },
};
