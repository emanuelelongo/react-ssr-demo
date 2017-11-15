import express from 'express'
import path from 'path'

const server = express()
server.use(express.static(path.join(__dirname, 'dist')))

if (process.env.NODE_ENV === 'development') {
  require('./dev-middleware').default(server)
}

server.use((req, res) => {
  const HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>React SSR Demo</title>
      </head>
      <body>
        <div id="root">
          There will be a React application right here!
        </div>
        <script type="text/javascript" src="/bundle.js"></script>
      </body>
    </html>
  `
  res.end(HTML)
})

export default server