import React from 'react';

export default class CurrencyDetails extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id
    this.props.fetchDetails(id)
  }

  componentWillUpdate(nextProps, nextState) {
    const currentId = this.props.match.params.id
    const nextId = nextProps.match.params.id

    if(currentId !== nextId) {
      this.props.fetchDetails(nextId)
    }
  }

  render() {
    const { price, ask, bid } = this.props.details
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