const { root } = require('./helpers');
const extract = require('extract-text-webpack-plugin');

function getDevStylesConfig() {
  return {
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'], exclude: [root('src/components')] },
        { test: /\.css$/, use: ['to-string-loader', 'css-loader'], exclude: [root('src/styles')] },
        { test: /\.scss$|\.sass$/, use: ['style-loader', 'css-loader', 'sass-loader'], include: [root('src/styles') ] },
        { test: /\.scss$|\.sass$/, use: ['to-string-loader', 'css-loader', 'sass-loader'], exclude: [root('src/styles')] },
      ]
    }
  };
}

function getProdStylesConfig() {
  return {
    plugins: [
      new extract('css/[name].css')
    ],
    module: {
      rules: [
        { test: /\.css$/, use: extract.extract({ fallback: 'style-loader', use: 'css-loader' }), include: [root('src/styles')] },
        { test: /\.css$/, use: ['to-string-loader', 'css-loader'], exclude: [root('src/styles')] },
        { test: /\.scss$|\.sass$/, loader: extract.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] }), exclude: [root('src/components')] },
        { test: /\.scss$|\.sass$/, use: ['to-string-loader', 'css-loader', 'sass-loader'], exclude: [root('src/styles')] },
      ]
    }
  };
}

module.exports = {
  getDevStylesConfig: getDevStylesConfig,
  getProdStylesConfig: getProdStylesConfig
};
