///<reference path="../typings/webpack.d.ts"/>
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
// import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as TerserWebpackPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config: any = merge(baseConfig, {
    mode: 'production',

    entry: './src/electron.main.ts',

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'main.js'
    },

    optimization: {
        minimizer: [
            /**
             * This plugin uses terser to minify your JavaScript.
             * ref: https://github.com/webpack-contrib/terser-webpack-plugin
             */
            new TerserWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ]
    },

    plugins: [
        /**
         * Add production environment.
         * Ref: https://webpack.js.org/plugins/define-plugin/
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.FLUENTFFMPEG_COV': false
        }),

        /**
         * Remove and clean your build folder before building.
         * Ref: https://github.com/johnagan/clean-webpack-plugin
         */
        // new CleanWebpackPlugin([
        //     path.resolve(__dirname, '..', 'dist'),
        //     path.resolve(__dirname, '..', 'release')
        // ], {
        //         root: process.cwd(),
        //         verbose: false
        //     }),
    ],

    /**
     * Configure whether to polyfill or mock certain Node.js globals and modules.
     * ref: https://webpack.js.org/configuration/node/
     */
    node: {
        __dirname: false,
        __filename: false
    },

    /**
     * Set target to Electron specific node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main'
});

export default config;
