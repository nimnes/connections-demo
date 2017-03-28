import R from 'ramda';

const CONNECTION_RADIUS = 150;

const componentsLens = R.lensProp('components');
const connectableLens = R.lensProp('connectable');

const addComponent = (state, component) => {
    return R.over(componentsLens, R.append(component), state);
}

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

    const { anchor, x, y } = action;

    const startIndex = anchor === 'start' ? 0 : state.points.length - 1;
    const endIndex = anchor === 'start' ? 1 : startIndex - 1;

    const startLens = R.lensPath(['points', startIndex]);
    const endLens = R.lensPath(['points', endIndex]);

    const p1 = R.view(startLens, state);
    const p2 = R.view(endLens, state);

    const isVertical = p1.x === p2.x;
    const endX = isVertical ? x : p2.x;
    const endY = isVertical ? p2.y : y;

    const updateSegment = R.compose(
        R.set(startLens, { x, y }),
        R.set(endLens, { x: endX, y: endY }));

    return updateSegment(state);
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

const updateConnectable = (state, action) => {
    const isClose = (component, action) =>
        Math.abs(component.x + component.width / 2 - action.x) <= CONNECTION_RADIUS &&
        Math.abs(component.y + component.height / 2 - action.y) <= CONNECTION_RADIUS;

    const connectable = R.compose(
        R.pluck('id'),
        R.filter(c => c.id !== action.id && isClose(c, action)),
        R.view(componentsLens)
    )(state);

    return R.set(connectableLens, connectable, state);
}

const canvas = (state = { components: [], connectable: [] }, action) => {
    switch (action.type) {
        case 'ADD_RECTANGLE':
            return addComponent(state, rectangle(action));
        case 'ADD_ELLIPSE':
            return addComponent(state, ellipse(action));
        case 'ADD_PIPE':
            return addComponent(state, pipe(action));
        case 'MOVE_COMPONENT':
            return R.over(componentsLens, R.map(c => moveComponent(c, action)), state);
        case 'MOVE_PIPE_END':
            const newState = R.over(componentsLens, R.map(c => movePipeEnd(c, action)), state);
            return updateConnectable(newState, action);
        case 'RESIZE_COMPONENT':
            return R.over(componentsLens, R.map(c => resizeComponent(c, action)), state);
        case 'START_CONNECTING':
            return updateConnectable(state, action);
        case 'STOP_CONNECTING':
            return R.set(connectableLens, [], state);
        default:
            return state;
    }
}

export default canvas;
