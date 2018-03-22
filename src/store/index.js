import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';

import {
  gyroscopeReducer
} from '../reducers/gyroscopeReducer';

const store = combineReducers({
  gyroscopeReducer
});

export default createStore(store, applyMiddleware(thunk))