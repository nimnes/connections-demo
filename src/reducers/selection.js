const selection = (state = {}, action) => {
    switch (action.type) {
        case 'SELECT_COMPONENT':
            return action.id;
        default:
            return state;
    }
};

export default selection;
