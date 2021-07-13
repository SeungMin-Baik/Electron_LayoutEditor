import * as path from 'path';
import * as fs from 'fs';
import * as webpack from 'webpack';
// import * as ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin';
import { filterDepWithoutEntryPoints } from './utils';
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** App dependencies to not include at webpack. */
const externals = require('../package.json').dependencies;

/** Babel presets, using instead of `.babelrc` */
const babelPresets = [
    ['@babel/preset-env', {
        'targets': {
            'node': 10
        },
        'modules': false
    }],
    '@babel/preset-react'
];

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(item => ['.bin'].indexOf(item) === -1 )  // exclude the .bin folder
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });

/** Webpack base configuration. */
const config: webpack.Configuration = {
    output: {
        path: path.resolve(__dirname, '..', 'src'),
        filename: 'bundle.js',

        /**
         * `commonjs2` will export by setting module.exports: module.exports = xxx.
         * ref: https://github.com/webpack/webpack/issues/1114
         */
        libraryTarget: 'commonjs2'
    },

    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            '@app': path.resolve(__dirname, '..', 'src'),
            '@assets': path.resolve(__dirname, '..', 'assets')
        }
    },

    module: {
        rules: [
            /**
             * Run babel at JS files to transfile ES6+ code to ES5.
             */
            {
                test: /\.jsx?$/,
                exclude: /node_modules\/(?![@polymer/lit\-element|lodash\-es])/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        compact: true,
                        presets: babelPresets
                    }
                }
            },

            /**
             * Transfile TS files or TSX files to JS files.
             * And run babel at JS files to transfile ES6+ code to ES5.
             */
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        silent: true,
                        useBabel: true,
                        useCache : true,
                        babelCore: '@babel/core',
                        babelOptions: {
                            babelrc: false,
                            presets: babelPresets
                        }
                    }
                }
            },

            /**
             * Stylesheet files with source maps.
             */
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 0,
                            sourceMap: process.env.NODE_ENV
                                === 'development'
                        }
                    }
                ]
            },

            /**
             * Sass stylesheet files with source maps.
             */
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: process.env.NODE_ENV
                                === 'development'
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV
                                === 'development'
                        }
                    }
                ]
            },

            /**
             * Make inline in bundle file if smaller than 10 KB,
             * otherwise load as a file.
             */
            {
                test: /\.(png|ico|gif|svg|webp|jpe?g|mp3|mp4|webm|jpg)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'public/media/[hash].[ext]'
                    }
                }]
            },

            /**
             * Make font resources load as files.
             */
            {
                test: /\.(eot|ttf|woff2?|otf)$/,
                use: 'file-loader'
            },

            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ],
    },

    plugins: [
        /**
         * Runs typescript type checker on a separate process.
         * Ref: https://github.com/Realytics/fork-ts-checker-webpack-plugin
         */
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: path.resolve(__dirname, '..', 'src'),
            tsconfig: path.resolve(__dirname, '..', 'tsconfig.json'),
            tslint: path.resolve(__dirname, '..', 'tslint.json'),
        }),

        /**
         * Prevent generation of modules.
         * In this app, prevent to load all moment locales.
         * Ref: https://webpack.js.org/plugins/ignore-plugin/
         */
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        /**
         * A progress bar plugin for Webpack.
         * Ref: https://github.com/clessg/progress-bar-webpack-plugin
         */
        // new ProgressBarWebpackPlugin()

        // new webpack.BannerPlugin('require("source-map-support").install();',
        //                    { raw: true, entryOnly: false })
    ],

    /**
     * Configure whether to polyfill or mock certain Node.js globals and modules.
     * ref: https://webpack.js.org/configuration/node/
     */
    node: {
        __dirname: true,
        __filename: true
    },

    /**
     * Excluding dependencies from the output bundles.
     * ref: https://webpack.js.org/configuration/externals/
     */
    externals: [
        ...Object.keys(externals || {}).filter(filterDepWithoutEntryPoints),
        nodeModules
    ],

    target: 'node',
    devtool: 'source-map'
};

export default config;
