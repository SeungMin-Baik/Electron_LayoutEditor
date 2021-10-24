///<reference path="../typings/webpack.d.ts"/>
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as WebpackDashboardPlugin from 'webpack-dashboard/plugin';
import baseConfig from './webpack.config.base';

const port = process.env.PORT || 9000;
const config: any = merge(baseConfig, {
    entry: [
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr&reload=true`,
        './src/index.tsx'
    ],

    mode: 'development',

    devtool: 'inline-source-map',

    output: {
        publicPath: `http://localhost:${port}/dist/`,

        /**
         * Point sourcemap entries to original disk location (format as URL on Windows)
         */
        devtoolModuleFilenameTemplate: (info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },

    plugins: [
        /**
         * Add development environment.
         * Ref: https://webpack.js.org/plugins/define-plugin/
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),

        /**
         * Enables Hot Module Replacement, otherwise known as HMR.
         * Ref: https://webpack.js.org/plugins/hot-module-replacement-plugin/
         */
        new webpack.HotModuleReplacementPlugin(),

        /**
         * Cause the relative path of the module to be displayed when HMR is enabled.
         * Ref: https://webpack.js.org/plugins/named-modules-plugin/
         */
        new webpack.NamedModulesPlugin(),

        /**
         * Remove and clean your build folder before building.
         * Ref: https://github.com/johnagan/clean-webpack-plugin
         */
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: [
        //         path.resolve(__dirname, '..', 'dist'),
        //         path.resolve(__dirname, '..', 'release')
        //     ],
        //     verbose: false
        // }),

        /**
         * Enforces the entire path of all required modules.
         * Ref: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
         */
        new CaseSensitivePathsWebpackPlugin(),

        /**
         * Dashboard for your webpack dev server.
         */
        // new WebpackDashboardPlugin()

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.FLUENTFFMPEG_COV': false
        }),
    ],

    /**
     * During development, dont interest of speed.
     */
    performance: {
        hints: false
    },

    node: {
        __dirname: false,
        __filename: false
    },

    target: 'electron-renderer'
});

export default config;
