// TODO 未实现
const webpack = require('webpack')
const GenerateAssetPlugin = require('generate-asset-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const node_modules_dir = path.join(__dirname, './node_modules')

const fs = require('fs-extra')

fs.copy(
  path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.js'),
  path.resolve(__dirname, './dist/web/js/vue.runtime.js')
)

fs.copy(
  path.resolve(__dirname, './node_modules/weex-vue-render/dist/index.js'),
  path.resolve(__dirname, './dist/web/js/weex-vue-render.js')
)

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
const commonsChunkPlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    chunks: ['app'],
    filename: 'js/[name].[chunkhash].min.js',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(node_modules_dir) === 0
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['app', 'vendors'],
    filename: 'js/[name].[chunkhash].min.js',
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

const buildLoader = function (vueLoader, loaders) {
  return [
    {
      test: /\.js$/,
      loader: 'babel',
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
    app: ['./src/app.js'],
  },
  output: {
    path: './dist/web',
    filename: 'js/[name].[chunkhash].js',
  },
  module: {
    loaders: buildLoader('vue')
  },
  vue: {
    // vue-loader 12.0.0以上
    compilerModules: [{
      postTransformNode: el => {
        el.staticStyle = `$processStyle(${el.staticStyle})`
        el.styleBinding = `$processStyle(${el.styleBinding})`
      }
    }],
    postcss: [require('autoprefixer')()]
  },
  plugins: [htmlWebpackPlugin, ...commonsChunkPlugins, uglifyJsPlugin, bannerPlugin]
}

const subAppConfig = {
  devtool: 'source-map',
  entry: {
    sub_app_init_snippet: './src/a_sub_apps/init/init_snippet.js',
  },
  output: {
    path: './dist',
    filename: '[name].js',
  },
  module: {
    loaders: buildLoader('vue')
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
    path: './dist/weex',
    filename: `js/[name].js`
  },
  module: {
    loaders: buildLoader('weex')
  },
  vue: {},
  plugins: [uglifyJsPlugin, bannerPlugin, generateAssetPlugin]

}

module.exports = [webConfig, subAppConfig, weexConfig];