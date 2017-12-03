var path = require('path');
var webpack = require('webpack');
var root = path.resolve(__dirname, '../');
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry:  root + "/test/index.js",
    entry : {
        app : [
            "./build/dev-client",
            root + "/test/index.js"
        ]
    },
    output: {
        stats: {
            colors: true
        },
        noInfo: true,
        path: root + "/",
        filename: "bundle.js"
    },

    module: {
        loaders: [
        {
            test: /\.json$/,
            loader: "json"
        },
        {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: root
        },
        {
            test: /\.css$/,
            loader: 'style!css'//添加对样式表的处理
        }
        ]
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new htmlWebpackPlugin({
            filename: 'test.html',
            template: 'test.html',
            inject: true
        }),
    ],

    // devServer: {
    //     contentBase: "./",
    //     port: 8888,
    //     colors: true,
    //     historyApiFallback: true,
    //     inline: true
    // }
};
