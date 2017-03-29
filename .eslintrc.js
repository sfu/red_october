const OFF = 0;
const ERROR = 2;
const NEVER = 'never';
const ALWAYS = 'always';

module.exports = {
  parser: 'babel-eslint',

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],

  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true,
  },

  rules: {
    'comma-dangle': [ERROR, NEVER],
    'no-console': [OFF],
    'object-curly-spacing': [ERROR, ALWAYS],
    semi: [ERROR, NEVER],
    'space-before-function-paren': [ERROR, NEVER],
  },
};
