import { cpus } from 'os';

const ora = require('ora');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.build.js');
require('shelljs/global');

const dist = path.resolve(__dirname, '../') + '/dist/';

console.log(
    '    Tip:\n' +
    '    Built files are meant to be served over an HTTP server.\n' +
    "    Opening index.html over file:// won't work.\n",
);

const spinner = ora('building for production...');
spinner.start();

// rm('-rf', dist);
// mkdir('-p', dist);
cp('-rf', 'dist/*', 'docs')

webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(
        stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
        }) + '\n',
    );
});
