const { root } = require('./helpers');
const { AotPlugin } = require('@ngtools/webpack');

function getAotPlugin(aot) {
  return new AotPlugin({
    tsConfigPath: root('tsconfig.json'),
    skipCodeGeneration: !aot
  });
}

module.exports = {
  getAotPlugin: getAotPlugin
};
