///<reference path="../typings/webpack.d.ts"/>
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import { LicenseWebpackPlugin } from 'license-webpack-plugin';
import * as TerserWebpackPlugin from 'terser-webpack-plugin';
import * as OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import baseConfig from './webpack.config.base';

const config: any = merge(baseConfig, {
    mode: 'production',

    entry: './src/index.tsx',

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '../dist/',
        filename: 'bundle.js'
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
            }),

            /**
             * A Webpack plugin to optimize and minimize CSS assets.
             * ref: https://github.com/NMFR/optimize-css-assets-webpack-plugin
             */
            new OptimizeCssAssetsWebpackPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true
                    }
                }
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
         * Outputs licenses from 3rd party libraries to a file.
         * Ref: https://github.com/xz64/license-webpack-plugin
         */
        new LicenseWebpackPlugin({
            stats: {
                errors: true,
                warnings: false
            },
            outputFilename: '../dist/licenses.txt',
            unacceptableLicenseTest: (licenseType) => (licenseType === 'GPL'),
            handleUnacceptableLicense: (packageName, licenseType) => {
                throw new Error(`[${packageName}] has unacceptable license type : ${licenseType}`);
            }
        }) as any,
    ],

    /**
     * Configure whether to polyfill or mock certain Node.js globals and modules.
     * ref: https://webpack.js.org/configuration/node/
     */
    node: {
        __dirname: false,
        __filename: false
    },

    target: 'electron-renderer'
});

export default config;
