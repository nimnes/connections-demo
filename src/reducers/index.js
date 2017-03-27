import { combineReducers } from 'redux';
import canvas from './canvas';
import connections from './connections';
import selection from './selection'

export default combineReducers({
    canvas,
    connections,
    selection
})
