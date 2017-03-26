const connection = ({ id, componentId, sx, sy }) => ({
    id,
    componentId,
    sx,
    sy
});

const connections = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CONNECTION':
            return [
                ...state,
                connection(action)
            ];
        case 'REMOVE_CONNECTION':
            return state.filter(connection => connection.id !== action.id);
        default:
            return state;
    }
}

export default connections;
