import express from 'express'
import path from 'path'
import { createStore, combineReducers, applyMiddleware }  from 'redux';
import thunk from 'redux-thunk'
import routes from './app/routes'
import * as reducers from './app/reducers'
import { renderApp, fetchComponentData, matchRouteComponents } from './helpers'

const server = express()
const rootReducer = combineReducers(reducers);

server.use(express.static(path.join(__dirname, 'dist')))

if (process.env.NODE_ENV === 'development') {
  require('./dev-middleware').default(server)
}

server.use((req, res) => {
  const store = createStore(rootReducer, applyMiddleware(thunk))
  const components = matchRouteComponents(req.path, routes)
  
  fetchComponentData(store.dispatch, components)
  .then(() => {
    const HTML = renderApp(req.path, store, routes)
    res.type("text/html; charset=UTF-8")
    res.end(HTML)
  })
})

export default server