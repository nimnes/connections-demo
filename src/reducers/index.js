import { combineReducers } from 'redux';
import components from './components';
import connectable from './connectable';
import connections from './connections';
import selection from './selection'

export default combineReducers({
    components,
    connectable,
    connections,
    selection
})
