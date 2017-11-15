import { FETCH_CURRENCIES } from '../constants/actionTypes'

export default function(state = [], action) {
  switch(action.type) {
    case FETCH_CURRENCIES:
      return action.payload
    default:
      return state
  }
}
