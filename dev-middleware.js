import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import prodConfig from './webpack.config.js'

export default function(server) {
  // DEV configuration is an extension of PROD configuration
  const config = {
    ...prodConfig,
    devtool: 'inline-source-map'
  }

  const compiler = webpack(config);

  // bundle is produced in-memory
  server.use(webpackDevMiddleware(compiler, { noInfo: true }));
  
  // bundle is hot-reloaded when something change
  server.use(webpackHotMiddleware(compiler));
}
