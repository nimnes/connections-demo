import { combineReducers } from 'redux';
import canvas from './canvas';
import selection from './selection'

export default combineReducers({
    canvas,
    selection
})
