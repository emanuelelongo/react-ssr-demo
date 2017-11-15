import React from 'react'
import { renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';

function renderApp(path, store, routes) {
  const context = {}
  const view =
    <Provider store={store}>
      <Router location={path} context={context}>
        <div>{renderRoutes(routes)}</div>
      </Router>
    </Provider>

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