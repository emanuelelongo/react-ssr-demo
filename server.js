import express from 'express'
import path from 'path'
import { createStore, combineReducers, applyMiddleware }  from 'redux';
import thunk from 'redux-thunk'
import routes from './app/routes'
import * as reducers from './app/reducers'
import renderApp from './helpers/renderApp'

const server = express()
const rootReducer = combineReducers(reducers);
const store = createStore(rootReducer, applyMiddleware(thunk))

server.use(express.static(path.join(__dirname, 'dist')))

if (process.env.NODE_ENV === 'development') {
  require('./dev-middleware').default(server)
}

server.use((req, res) => {
  const HTML = renderApp(req.path, store, routes)
  res.end(HTML)
})

export default server