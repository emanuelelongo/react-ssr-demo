import React from 'react';
import { Link } from 'react-router-dom'

export default class CurrencyItem extends React.Component {
  render() {
    return (
      <li>
          <Link to={`/currencies/${this.props.id}`}>{this.props.display_name}</Link>
      </li>
    );
  }
}