import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import flow from 'rollup-plugin-flow';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const root = path.resolve(__dirname, './');
const port = 10002;

module.exports = {
    input: 'src/index.js',
    name: 'projectName',
    sourcemap: true,
    output: {
        file: 'dist/bundle.js',
        format: 'umd'
    },
    plugins: [
        // uglify(),
        serve({
            open: true,
            contentBase: '',
            port: port
        }),
        // livereload(),
        resolve(),
        flow(
            {
                all: true
            }
        ),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            presets: [ 
                [ 'es2015', { "modules": false } ]
            ],
        }),
        alias({
            ASSETS: path.resolve(__dirname, '../assets')
        })
    ]
// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
};
