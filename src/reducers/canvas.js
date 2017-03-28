import R from 'ramda';

let nextConnectionId = 1;

const CONNECTABLE_AREA_RADIUS_SQ = 1000;
const CP_RADIUS_SQ = 100;

const componentsLens = R.lensProp('components');
const connectableLens = R.lensProp('connectable');
const connectionsLens = R.lensProp('connections');

// Helpers
const rectangle = ({ id, x, y, width, height }) => ({
    id,
    type: "rectangle",
    x,
    y,
    width,
    height
});

const ellipse = ({ id, x, y, width, height }) => ({
    id,
    type: "ellipse",
    x,
    y,
    width,
    height
});

const pipe = ({ id, points }) => ({
    id,
    type: 'pipe',
    points
});

const distanceSq = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return dx * dx + dy * dy;
};

const arePointsClose = (p1, p2, maxDistanceSq) => distanceSq(p1, p2) <= maxDistanceSq;

const nearestEllipsePoint = (point, component) => {
    const a = component.width / 2;
    const b = component.height / 2;
    const cx = component.x + a;
    const cy = component.y + b;
    const alpha = Math.atan2(point.y - cy, point.x - cx);

    const cos = Math.cos(alpha);
    const sin = Math.sin(alpha);

    const k = 1 / (Math.sqrt(b * b * Math.pow(cos, 2) + a * a * Math.pow(sin, 2)));
    return {
        x: cx + k * a * b * cos,
        y: cy + k * a * b * sin
    };
};

const nearestRectanglePoint = (point, component) => ({
    x: Math.max(component.x, Math.min(point.x, component.x + component.width)),
    y: Math.max(component.y, Math.min(point.y, component.y + component.height))
});

const nearestComponentPoint = (point, component) => {
    switch (component.type) {
        case 'ellipse':
            return nearestEllipsePoint(point, component);
        default:
            return nearestRectanglePoint(point, component);
    }
}

const createConnection = (connectionPoint, action) => {
    const { position, component } = connectionPoint;
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

const getConnectionPoint = (action, state) => {
    return R.compose(
        R.head,
        R.filter(s => arePointsClose(s.position, action, CP_RADIUS_SQ)),
        R.map(component => ({
            component,
            position: nearestComponentPoint(action, component)
        })),
        R.filter(c => R.contains(c.id, R.view(connectableLens, state))),
        R.view(componentsLens)
    )(state);
};

// Reducers
const addComponent = (state, component) =>
    R.over(componentsLens, R.append(component), state);

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
        const movedPipe = {
            ...component,
            points: component.points.map(p => ({
                x: p.x + action.offsetX,
                y: p.y + action.offsetY
            }))
        };

        return R.set(componentLens, movedPipe, state);
    }

    const adjustPipeEnd = (memo, connection) => {
        const pipe = state.components.find(c => c.id === connection.pipeId);
        const pipeEnd = connection.anchor === 'start' ? pipe.points[0] : pipe.points[pipe.points.length - 1];
        return movePipeEnd({
            id: pipe.id,
            anchor: connection.anchor,
            x: pipeEnd.x + action.offsetX,
            y: pipeEnd.y + action.offsetY
        }, memo);
    };

    const stateWithAdjustedPipes = R.compose(
        R.reduce(adjustPipeEnd, state),
        R.filter(c => c.componentId === component.id),
        R.view(connectionsLens)
    )(state);

    // move components and pipes connected to them
    return R.set(
        componentLens,
        {
            ...component,
            x: component.x + action.offsetX,
            y: component.y + action.offsetY
        },
        stateWithAdjustedPipes);
};

const resizeComponent = (action, state) => {
    const componentLens = R.lensPath(['components', state.components.findIndex(c => c.id === action.id)]);
    const component = R.view(componentLens)(state);

    const { minX, minY, maxX, maxY } = action.bounds;
    const width = maxX - minX;
    const height = maxY - minY;

    if (width < 10 || height < 10) {
        return state;
    }

    const adjustPipeEnd = (memo, connection) =>
        movePipeEnd({
            id: connection.pipeId,
            anchor: connection.anchor,
            x: minX + width * connection.sx,
            y: minY + height * connection.sy
        }, memo);

    const stateWithAdjustedPipes = R.compose(
        R.reduce(adjustPipeEnd, state),
        R.filter(c => c.componentId === component.id),
        R.view(connectionsLens)
    )(state)

    return R.set(
        componentLens,
        {
            ...component,
            x: minX,
            y: minY,
            width,
            height
        },
        stateWithAdjustedPipes);
}

const updateConnectable = R.curry((action, state) => {
    const connectable = R.compose(
        R.pluck('id'),
        R.filter(c => arePointsClose(nearestComponentPoint(action, c), action, CONNECTABLE_AREA_RADIUS_SQ)),
        R.filter(c => c.id !== action.id),
        R.view(componentsLens)
    )(state);

    return R.set(connectableLens, connectable, state);
});

const updateConnectionPoints = R.curry((action, state) => {
    const connectionPoint = getConnectionPoint(action, state);
    const filteredConnections = R.compose(
        R.filter(c => c.pipeId !== action.id || c.anchor !== action.anchor),
        R.view(connectionsLens)
    )(state);

    if (!connectionPoint) {
        return R.set(connectionsLens, filteredConnections, state);
    }

    const newConnection = createConnection(connectionPoint, action);
    return R.compose(
        R.set(connectionsLens, R.append(newConnection, filteredConnections)),
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
            return resizeComponent(action, state);
        case 'START_CONNECTING':
            return updateConnectable(action, state);
        case 'STOP_CONNECTING':
            return R.set(connectableLens, [], state);
        default:
            return state;
    }
}

export default canvas;
