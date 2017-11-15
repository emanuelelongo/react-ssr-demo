import { FETCH_CURRENCIES } from '../constants/actionTypes'

export default function fetchCurrencies() {
  return dispatch => {
    return fetch('https://api.gdax.com/products/')
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: FETCH_CURRENCIES,
          payload: data
        })
      })
  }
}