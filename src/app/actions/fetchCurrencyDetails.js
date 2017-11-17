import { FETCH_CURRENCY_DETAILS } from '../constants/actionTypes'

export default function fetchCurrencyDetails(id) {
  return dispatch => {
    return fetch(`https://api.gdax.com/products/${id}/ticker`)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: FETCH_CURRENCY_DETAILS,
          payload: data
        })
    })
  }
}