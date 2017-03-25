import { combineReducers } from 'redux';
import components from './components';
import connections from './connections';
import selection from './selection'

export default combineReducers({
    components,
    connections,
    selection
})
