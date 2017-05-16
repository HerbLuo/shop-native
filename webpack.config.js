const webpack = require('webpack');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');

const HASH_LENGTH = 8;

const bannerPlugin = new webpack.BannerPlugin(
    '// { "framework": "Vue" }\n',
    {raw: true}
);
/*
 * 生成当前App的版本信息
 */
const generateAssetPlugin = new GenerateAssetPlugin({
    filename: 'app.version.json',
    fn(compilation, cb) {
        let hash = compilation.hash.substring(0, HASH_LENGTH);
        cb(null, JSON.stringify({hash}));
    },
});

function getBaseConfig() {
    return {
        entry: {
            app: './src/app.js',
            sub_app_init_snippet: './src/a_sub_apps/init/init_snippet.js',
        },
        output: {
            path: 'dist',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/
                }, {
                    test: /\.vue(\?[^?]+)?$/,
                    loaders: []
                }
            ]
        },
        vue: {},
        plugins: [bannerPlugin]
    }
}

/*
 * shop
 * HTML 开发版本
 */
const webConfig = getBaseConfig();
webConfig.output.filename = '[name].web.js';
webConfig.module.loaders[1].loaders.push('vue');
webConfig.vue.compilerModules = [{
    postTransformNode: el => {
        el.staticStyle = `$processStyle(${el.staticStyle})`;
        el.styleBinding = `$processStyle(${el.styleBinding})`;
    }
}];

/*
 * shop
 * WEEX 开发版本（HASH NAMED）
 */
const weexConfig = getBaseConfig();
weexConfig.entry = {app: './src/app.js'};
weexConfig.output.filename = `[name].weex.[hash:${HASH_LENGTH}].js`;
weexConfig.module.loaders[1].loaders.push('weex');
weexConfig.plugins.push(generateAssetPlugin);

/*
 * WEEX 开发版本
 */
const weexConfig2 = getBaseConfig();
weexConfig2.output.filename = `[name].weex.js`;
weexConfig2.module.loaders[1].loaders.push('weex');

module.exports = [webConfig, weexConfig, weexConfig2];