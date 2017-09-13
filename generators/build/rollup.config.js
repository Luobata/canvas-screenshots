const rollup = require('rollup');
//const flow = require('rollup-plugin-flow-no-whitespace')
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const alias = require('rollup-plugin-alias');
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import flow from 'rollup-plugin-flow';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const root = path.resolve(__dirname, './');

module.exports = {
    input: 'src/index.js',
    name: 'canvasInputMethod',
    sourcemap: true,
    output: {
        file: 'dist/bundle.js',
        format: 'umd'
    },
    plugins: [
        // uglify(),
        serve(),
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
            UI: path.resolve(__dirname, '../src/ui'),
            EVENT: path.resolve(__dirname, '../src/event')
        })
    ]
// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
};
