import R from 'ramda';

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

const pipe = ({ id, points }) => ({
    id,
    type: 'pipe',
    points
});

const moveComponent = (state, action) => {
    if (action.type === 'MOVE_COMPONENT' && state.id === action.id) {
        if (state.type === 'pipe') {
            return {
                ...state,
                points: state.points.map(p => ({
                    x: p.x + action.offsetX,
                    y: p.y + action.offsetY
                }))
            }
        } else {
            return {
                ...state,
                x: state.x + action.offsetX,
                y: state.y + action.offsetY
            };
        }
    }

    return state;
};

const movePipeEnd = (state, action) => {
    if (state.id !== action.id) {
        return state;
    }

    const updatePoint = (point) => ({
        x: point.x + action.offsetX,
        y: point.y + action.offsetY
    });

    let index = action.anchor === 'start' ? 0 : state.points.length - 1;
    return R.over(R.lensPath(['points', index]), updatePoint, state);
}

const resizeComponent = (state, action) => {
    if (action.type === 'RESIZE_COMPONENT' && state.id === action.id) {
        const { minX, minY, maxX, maxY } = action.bounds;
        const width = maxX - minX;
        const height = maxY - minY;

        if (width < 10 || height < 10) {
            return state;
        }

        return {
            ...state,
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    return state;
}

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
        case 'ADD_PIPE':
            return [
                ...state,
                pipe(action)
            ];
        case 'MOVE_COMPONENT':
            return state.map(c =>
                moveComponent(c, action));
        case 'MOVE_PIPE_END':
            return state.map(c =>
                movePipeEnd(c, action));
        case 'RESIZE_COMPONENT':
            return state.map(c =>
                resizeComponent(c, action));
        default:
            return state;
    }
}

export default components;
