import R from 'ramda';

let nextComponentId = 1;
let nextConnectionId = 1;

const defaultSize = 100;
const randomPoint = (maxValue) => Math.random() * (maxValue - defaultSize);

const randomPoint2 = (canvasSize) => ({
    x: randomPoint(canvasSize.width),
    y: randomPoint(canvasSize.height)
});

const uniqueComponentId = () => "component-" + nextComponentId++;
const uniqueConnectionId = () => "connection-" + nextConnectionId++;

const generatePipePoints = (canvasSize) => {
    const generatePoint = (prev, index) => {
        if (index % 2 === 0) {
            return Object.assign({}, prev, { x: randomPoint(canvasSize.width) });
        } else {
            return Object.assign({}, prev, { y: randomPoint(canvasSize.height )});
        }
    };

    const nPoints = Math.random() * 4 + 2;
    return R.compose(R.scan(generatePoint, randomPoint2(canvasSize)), R.range(0))(nPoints);
};

export const addEllipse = (canvasSize) => ({
    type: 'ADD_ELLIPSE',
    id: uniqueComponentId(),
    x: randomPoint(canvasSize.width),
    y: randomPoint(canvasSize.height),
    width: defaultSize,
    height: defaultSize
});

export const addConnection = (componentId, sx, sy) => ({
    type: 'ADD_CONNECTION',
    id: uniqueConnectionId(),
    componentId,
    sx,
    sy
});

export const addPipe = (canvasSize) => ({
    type: 'ADD_PIPE',
    id: uniqueComponentId(),
    points: generatePipePoints(canvasSize)
});

export const addRectangle = (canvasSize) => ({
    type: 'ADD_RECTANGLE',
    id: uniqueComponentId(),
    x: randomPoint(canvasSize.width),
    y: randomPoint(canvasSize.height),
    width: defaultSize,
    height: defaultSize
});

export const moveComponent = (id, offsetX, offsetY) => ({
    type: 'MOVE_COMPONENT',
    id,
    offsetX,
    offsetY
});

export const removeConnection = (id) => ({
    type: 'REMOVE_CONNECTION',
    id
});

export const resizeComponent = (id, bounds) => ({
    type: 'RESIZE_COMPONENT',
    id,
    bounds
});

export const selectComponent = (id) => ({
    type: 'SELECT_COMPONENT',
    id
});

export const movePipeEnd = (id, anchor, offsetX, offsetY) => ({
    type: 'MOVE_PIPE_END',
    id,
    anchor,
    offsetX,
    offsetY
});

export const startConnecting = (id) => ({
    type: 'START_CONNECTING',
    id
});

export const stopConnecting = (id) => ({
    type: 'STOP_CONNECTING',
    id
});
