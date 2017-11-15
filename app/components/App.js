import React from 'react'
import { Link } from 'react-router-dom'
import { renderRoutes } from 'react-router-config';

export default  ({ route }) => {
  return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/currencies">Currencies</Link></li>
        </ul>
        <hr/>
        {renderRoutes(route.routes)}
      </div>
  )
}
