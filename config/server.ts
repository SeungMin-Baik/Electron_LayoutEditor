import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.dev';

const APP_PORT = process.env.PORT || 9000;
const app = express();
const compiler = webpack(config);

/**
 * Development middleware for use with webpack bundles.
 * ref: https://github.com/webpack/webpack-dev-middleware
 */
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
}));

/**
 * Webpack hot reloading.
 * ref: https://github.com/webpack-contrib/webpack-hot-middleware
 */
app.use(webpackHotMiddleware(compiler));

// Serving electron app.
app
    .listen(APP_PORT, () => {
        console.log(`App served at http://localhost:${APP_PORT}`);
    })
    .on('error', err => {
        console.error('Error occurred :', err);
    });

