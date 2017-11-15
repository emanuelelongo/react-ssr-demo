import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware }  from 'redux';
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import * as reducers from './reducers'
import routes from './routes'

const rootReducer = combineReducers(reducers)
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

ReactDOM.hydrate(
  <Provider store={store}>
    <Router>
      <div>{renderRoutes(routes)}</div>
    </Router>
  </Provider>
  , document.getElementById('root'))