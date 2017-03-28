import R from 'ramda';

let nextConnectionId = 1;

const CONNECTABLE_AREA_RADIUS = 150;
const CP_RADIUS_SQ = 100;

const componentsLens = R.lensProp('components');
const connectableLens = R.lensProp('connectable');
const connectionsLens = R.lensProp('connections');

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

const movePipeEnd = R.curry((action, state) => {
    const index = state.components.findIndex(c => c.id === action.id);
    const pipe = state.components[index];

    const { anchor, x, y } = action;

    const startIndex = anchor === 'start' ? 0 : pipe.points.length - 1;
    const endIndex = anchor === 'start' ? 1 : startIndex - 1;

    const startLens = R.lensPath(['points', startIndex]);
    const endLens = R.lensPath(['points', endIndex]);

    const p1 = R.view(startLens, pipe);
    const p2 = R.view(endLens, pipe);

    const isVertical = p1.x === p2.x;
    const endX = isVertical ? x : p2.x;
    const endY = isVertical ? p2.y : y;

    const updateSegment = R.compose(
        R.set(startLens, { x, y }),
        R.set(endLens, { x: endX, y: endY }));

    const pipeLens = R.lensPath(['components', index]);
    return R.over(pipeLens, updateSegment, state);
});

const moveComponent = (action, state) => {
    const componentLens = R.lensPath(['components', state.components.findIndex(c => c.id === action.id)]);
    const component = R.view(componentLens)(state);

    if (component.type === 'pipe') {
        return R.set(
            componentLens,
            {
                ...component,
                points: component.points.map(p => ({
                    x: p.x + action.offsetX,
                    y: p.y + action.offsetY
                }))
            },
            state);
    }

    const componentConnections = R.view(connectionsLens, state)
        .filter(connection => connection.componentId === component.id);

    const movedPipes = R.reduce((memo, connection) => {
        const pipe = state.components.find(c => c.id === connection.pipeId);
        const pipeEnd = connection.anchor === 'start' ? pipe.points[0] : pipe.points[pipe.points.length - 1];

        return movePipeEnd({
            id: pipe.id,
            x: pipeEnd.x + action.offsetX,
            y: pipeEnd.y + action.offsetY
        }, memo);
    }, state)(componentConnections);

    // move components and pipes connected to them
    return R.set(
        componentLens,
        {
            ...component,
            x: component.x + action.offsetX,
            y: component.y + action.offsetY
        },
        movedPipes);
};

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

const updateConnectable = R.curry((action, state) => {
    const isClose = (component, action) =>
        Math.abs(component.x + component.width / 2 - action.x) <= CONNECTABLE_AREA_RADIUS &&
        Math.abs(component.y + component.height / 2 - action.y) <= CONNECTABLE_AREA_RADIUS;

    const connectable = R.compose(
        R.pluck('id'),
        R.filter(c => c.id !== action.id && isClose(c, action)),
        R.view(componentsLens)
    )(state);

    return R.set(connectableLens, connectable, state);
});

const distanceSq = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return dx * dx + dy * dy;
};

const nearestRectanglePoint = (point, component) => ({
    x: Math.max(component.x, Math.min(point.x, component.x + component.width)),
    y: Math.max(component.y, Math.min(point.y, component.y + component.height))
});

const nearestComponentPoint = (point, component) => {
    switch (component.type) {
        case 'rectangle':
        case 'ellipse':
            return nearestRectanglePoint(point, component);
        default:
            return nearestRectanglePoint(point, component);
    }
}

const updateConnectionPoints = R.curry((action, state) => {
    const getNearestPoint = R.curry((point, component) => {
        const nearestPoint = nearestComponentPoint(point, component);
        return {
            component,
            position: nearestPoint,
            distance: distanceSq(nearestPoint, point)
        };
    })(action);

    const createConnection = ({ component, position }) => {
        const sx = (position.x - component.x) / component.width;
        const sy = (position.y - component.y) / component.height;
        return {
            id: nextConnectionId++,
            pipeId: action.id,
            anchor: action.anchor,
            componentId: component.id,
            sx,
            sy
        };
    };

    const connectionPoint = R.compose(
        R.head,
        R.filter(s => s.distance < CP_RADIUS_SQ),
        R.map(getNearestPoint),
        R.filter(c => R.contains(c.id, R.view(connectableLens, state))),
        R.view(componentsLens)
    )(state);

    if (!connectionPoint) {
        return state;
    }

    const newConnection = createConnection(connectionPoint);
    const updatedConnections = R.compose(
        R.append(newConnection),
        R.filter(c => c.pipeId !== action.id || c.componentId !== connectionPoint.component.id),
        R.view(connectionsLens)
    )(state);

    return R.compose(
        R.set(connectionsLens, updatedConnections),
        movePipeEnd({
            id: action.id,
            anchor: action.anchor,
            x: connectionPoint.position.x,
            y: connectionPoint.position.y
        })
    )(state);
});

const canvas = (state = { components: [], connectable: [], connections: [] }, action) => {
    switch (action.type) {
        case 'ADD_RECTANGLE':
            return addComponent(state, rectangle(action));
        case 'ADD_ELLIPSE':
            return addComponent(state, ellipse(action));
        case 'ADD_PIPE':
            return addComponent(state, pipe(action));
        case 'MOVE_COMPONENT':
            return moveComponent(action, state);
        case 'MOVE_PIPE_END':
            return R.compose(
                updateConnectionPoints(action),
                updateConnectable(action),
                movePipeEnd(action)
            )(state);
        case 'REMOVE_CONNECTION':
            return R.over(connectionsLens, R.filter(c => c.id !== action.id), state);
        case 'RESIZE_COMPONENT':
            return R.over(componentsLens, R.map(c => resizeComponent(c, action)), state);
        case 'START_CONNECTING':
            return updateConnectable(action, state);
        case 'STOP_CONNECTING':
            return R.set(connectableLens, [], state);
        default:
            return state;
    }
}

export default canvas;
