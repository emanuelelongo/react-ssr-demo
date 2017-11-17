import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import prodConfig from '../webpack.config.js'

export default function(server) {
  const config = {
    ...prodConfig,
    devtool: 'inline-source-map'
  }

  const compiler = webpack(config);
  server.use(webpackDevMiddleware(compiler, { noInfo: true }));
  server.use(webpackHotMiddleware(compiler));
}
