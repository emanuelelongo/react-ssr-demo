import React from 'react'
import { renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'


function renderApp(path, routes) {
  const context = {}
  const view =
    <Router location={path} context={context}>
      <div>{renderRoutes(routes)}</div>
    </Router>

  const appHTML = renderToString(view)
  
  const HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>React SSR Demo</title>
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script type="text/javascript" src="/bundle.js"></script>
      </body>
    </html>
  `
  return HTML
}

export default renderApp