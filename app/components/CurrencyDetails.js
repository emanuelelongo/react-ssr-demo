import React from 'react';

export default class CurrencyDetails extends React.Component {
  constructor() {
    super()
    this.state = { details: {} }
  }

  fetchDetails(id) {
    fetch(`https://api.gdax.com/products/${id}/ticker`)
      .then(response => response.json())
      .then(data => {
        this.setState({details: data})
      })
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.fetchDetails(id)
  }

  componentWillUpdate(nextProps, nextState) {
    const currentId = this.props.match.params.id
    const nextId = nextProps.match.params.id

    if(currentId !== nextId) {
      this.fetchDetails(nextId)
    }
  }

  render() {
    const { price, ask, bid } = this.state.details
    return (
      <div>
        <div>Currency pair: { this.props.match.params.id }</div>
        <div>Price: { price }</div>
        <div>Ask: { ask }</div>
        <div>Bid: { bid }</div>
      </div>
    )
  }
}