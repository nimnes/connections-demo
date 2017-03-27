const connectable = (state = {}, action) => {
    switch (action.type) {
        case 'START_CONNECTING':
            return true;
        case 'STOP_CONNECTING':
            return false;
        default:
            return state;
    }
};

export default connectable;
