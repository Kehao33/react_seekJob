const {
  override,
  addLessLoader,
  fixBabelImports,
  addBabelPlugin,
} = require('customize-cra')

module.exports = override(
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA570' }
  }),
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  }),
  addBabelPlugin(["@babel/plugin-proposal-decorators", {"legacy": true}]),
)
