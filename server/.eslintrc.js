module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2017,
    ecmaFeatures: {
        experimentalObjectRestSpread: true
    }
  },

  env: {
    browser: false
  },

  globals: {
    console: 'on',
    process: 'on',
    __dirname: 'on',
    require: 'on'
  },

  extends: "eslint:recommended",

  plugins: [],

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    'no-useless-escape': 'off',

    'no-console': 'off',
    'no-debugger': 'off'
  }
}
