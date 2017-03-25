const rectangle = (action) => {
    const { id, x, y, width, height } = action;
    return {
        id,
        type: "rectangle",
        x,
        y,
        width,
        height
    };
};

const ellipse = (action) => {
    const { id, x, y, width, height } = action;
    return {
        id,
        type: "ellipse",
        x,
        y,
        width,
        height
    };
};

const moveComponent = (state, action) => {
    switch (action.type) {
        case 'MOVE_COMPONENT':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                x: state.x + action.offsetX,
                y: state.y + action.offsetY
            };
        default:
            return state;
    }
};

const components = (state = [], action) => {
    switch (action.type) {
        case 'ADD_RECTANGLE':
            return [
                ...state,
                rectangle(action)
            ];
        case 'ADD_ELLIPSE':
            return [
                ...state,
                ellipse(action)
            ];
        case 'MOVE_COMPONENT':
            return state.map(c =>
                moveComponent(c, action)
            );
        default:
            return state;
    }
}

export default components;
