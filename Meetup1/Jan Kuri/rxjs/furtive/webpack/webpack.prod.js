const { root } = require('./helpers');
const compression = require('compression-webpack-plugin');

module.exports = {
  entry: root('src/main.aot.ts'),
  output: {
    filename: 'js/app.bundle.js'
  },
  plugins: [
    new compression({ asset: "[path].gz[query]", algorithm: "gzip", test: /\.js$|\.html$/, threshold: 10240, minRatio: 0.8 })
  ]
};
