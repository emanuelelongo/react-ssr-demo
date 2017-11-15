import express from 'express'
import path from 'path'
import routes from './app/routes'
import renderApp from './helpers/renderApp'

const server = express()
server.use(express.static(path.join(__dirname, 'dist')))

if (process.env.NODE_ENV === 'development') {
  require('./dev-middleware').default(server)
}

server.use((req, res) => {
  const HTML = renderApp(req.path, routes)
  res.end(HTML)
})

export default server