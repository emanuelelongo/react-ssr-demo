import React from 'react';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import matchPath from 'react-router/matchPath'
import CurrencyItem from '../components/CurrencyItem'
import CurrencyDetails from '../components/CurrencyDetails'
import { fetchCurrencies, fetchCurrencyDetails } from '../actions'

class Currencies extends React.Component {
  componentDidMount() {
    if(this.props.currencies.length === 0) {
      this.props.fetchCurrencies()
    }
  }

  render() {
    const { currencies, details, fetchCurrencyDetails } = this.props
    return (
      <div>
        <h2>~ Currency Page ~</h2>
          <div>
            <ul> 
              { currencies.map(i => <CurrencyItem key={i.id} {...i}/>) } 
            </ul>
          
            <Route path={`${this.props.match.url}/:id`} render={ (props) => 
                <CurrencyDetails {...props} fetchDetails={fetchCurrencyDetails} details={details}/>
            } />
          </div>
      </div>
    )
  }
}

Currencies.requirements = [
  fetchCurrencies,
  ['/currencies/:id', (params) => fetchCurrencyDetails(params.id) ]
]

function mapStateToProps(state) {
  return {
    currencies: state.currencies,
    details: state.details
  }
}

export default connect(mapStateToProps, {fetchCurrencies, fetchCurrencyDetails})(Currencies)