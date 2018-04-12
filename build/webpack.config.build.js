const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const root = path.resolve(__dirname, '../');
const productionGzipExtensions = ['js', 'css', 'ts', 'pug', 'styl'];

module.exports = {
    devtool: 'source-map',

    entry: {
        app: `${root}/src/index.ts`,
    },
    output: {
        path: `${root}/dist`,
        publicPath: '/',
        filename: 'screenShots.js',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['json', '.js', '.ts'],
        alias: {
            LIB: path.resolve(__dirname, '../src/canvas/lib'),
            INSERT: path.resolve(__dirname, '../src/canvas/insert'),
            ASSETS: path.resolve(__dirname, '../asserts'),
        },
    },

    module: {
        loaders: [
            {
                test: /\.(jpg|gif|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.styl$/,
                // loader: 'stylus-loader',
                loader: 'style-loader!css-loader!stylus-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: root,
            },
            {
                test: /\.css$/,
                loader: 'style!css', //添加对样式表的处理
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                },
            },
            sourceMap: true,
            parallel: true,
        }),
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + productionGzipExtensions.join('|') + ')$',
            ),
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
};
