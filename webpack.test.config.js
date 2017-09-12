/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/30
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/30 herbluo created
 */
module.exports = {
    devtool: 'source-map',
    entry: {
        app: 'mocha!babel!./test/index.js',
    },
    output: {
        path: './dist/test/',
        filename: '[name].test.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
        ]
    }
}