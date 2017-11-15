import React from 'react';
import { Route } from 'react-router-dom'
import CurrencyItem from '../components/CurrencyItem'
import CurrencyDetails from '../components/CurrencyDetails'

export default class Currencies extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    fetch('https://api.gdax.com/products/')
      .then(response => response.json())
      .then(data => {
        this.setState({data})
      })
  }

  render() {
    return (
      <div>
        <h2>~ Currency Page ~</h2>
          <div>
          <ul> 
            { this.state.data.map(i => <CurrencyItem key={i.id} {...i}/>) } 
          </ul>
        
          <Route path={`${this.props.match.url}/:id`} component={CurrencyDetails} />
          </div>
      </div>
    );
  }
}
