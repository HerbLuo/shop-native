const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GenerateAssetPlugin = require('generate-asset-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const path = require('path')
const node_modules_dir = path.join(__dirname, './node_modules')
const modified_vendors_dir = path.join(__dirname, './src/utils/vendors')


const fs = require('fs-extra')
fs.copy(
  path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.js'),
  path.resolve(__dirname, './dist/web/js/vue.runtime.js')
)
fs.copy(
  path.resolve(__dirname, './node_modules/weex-vue-render/dist/index.js'),
  path.resolve(__dirname, './dist/web/js/weex-vue-render/index.js')
)
fs.copy(
  path.resolve(__dirname, './src/utils/vendors/consoleqrcode/console.qrcode.min.js'),
  path.resolve(__dirname, './dist/web/js/console.qrcode.min.js')
)

const port = 89

// noinspection ALL
const bannerPlugin = new webpack.BannerPlugin(
  '// { "framework": "Vue" }\n',
  {raw: true}
)
/*
 * 生成当前App的版本信息
 */
const generateAssetPlugin = new GenerateAssetPlugin({
  filename: 'app.version.json',
  fn(compilation, cb) {
    let hash = compilation.hash
    cb(null, JSON.stringify({hash}))
  },
})

/*
 * 提取重复代码
 * @author: w11p3333
 * @see: https://github.com/w11p3333/weex-start-kit/blob/master/Web/build/webpack.build.conf.js
 */
// noinspection JSFunctionExpressionToArrowFunction
const commonsChunkPlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    chunks: ['app'],
    filename: 'web/js/[name].[chunkhash].min.js',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        (
          module.resource.indexOf(node_modules_dir) === 0 ||
          module.resource.indexOf(modified_vendors_dir) === 0
        )
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['app', 'vendors'],
    filename: 'web/js/[name].[hash].min.js',
  }),
]

/*
 * 压缩js
 */
const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  output: {
    comments: false, //删除所有注释，包括版权信息
  },
  compress: {
    warnings: false, //关闭警告
  }
})

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.tmpl.html',
})

const eslintPreLoader = {
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  include: [path.resolve(__dirname, './src')],
  exclude: [/vendors/],
  options: {
    formatter: require('eslint-friendly-formatter')
  }
}

const buildLoader = function (vueLoader, loaders) {
  return [{
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }, {
    test: /\.vue(\?[^?]+)?$/,
    loader: vueLoader
  }
  ].concat(loaders ? loaders : [])
}

/*
 * shop
 * HTML 开发版本
 */
const webConfig = {
  devtool: 'source-map',
  entry: {
    app: [
      './src/app-web.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'web/js/[name].[hash].js',
  },
  module: {
    preLoaders: [eslintPreLoader],
    loaders: buildLoader('vue-loader')
  },
  vue: {
    // vue-loader 12.0.0以上
    compilerModules: [{
      postTransformNode: function (el) {
        el.staticStyle = `$processStyle(${el.staticStyle})`
        el.styleBinding = `$processStyle(${el.styleBinding})`
      }
    }],
  },
  plugins: [
    htmlWebpackPlugin,
    ...commonsChunkPlugins,
    bannerPlugin,
    new FriendlyErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ]
}


const subAppConfig = {
  entry: {
    sub_app_init_snippet: './src/a_sub_apps/init/init_snippet.js',
    console_qrcode: './src/utils/console.qrcode.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'web/js/[name].min.js',
  },
  module: {
    preLoaders: [eslintPreLoader],
    loaders: buildLoader('vue-loader', [{
      test: /\.json$/,
      loader: 'json-loader'
    }])
  },
  plugins: [uglifyJsPlugin, bannerPlugin]
}

/*
 * shop
 * WEEX 开发版本
 */
const buildEntry = require('./webpack.build-entry')

const weexConfig = {
  entry: buildEntry(),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `weex/js/[name].js`
  },
  module: {
    preLoaders: [eslintPreLoader],
    loaders: buildLoader('weex-loader', [{
      test: /\.json$/,
      loader: 'json-loader'
    }])
  },
  vue: {},
  plugins: [bannerPlugin]
}


// noinspection JSUnresolvedFunction
new DevServer(webpack([webConfig, subAppConfig, weexConfig]), {
  contentBase: './dist',
  host: '0.0.0.0', // 绑定所有主机
  port,
  hot: true,
  inline: true,
  historyApiFallback: false,
  stats: {colors: true},
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
}).listen(`${port}`, '0.0.0.0')

module.exports = [webConfig, subAppConfig, weexConfig]