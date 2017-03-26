let nextComponentId = 1;
let nextConnectionId = 1;

const defaultSize = 100;
const randomPoint = (maxValue) => Math.random() * (maxValue - defaultSize);

const uniqueComponentId = () => "component-" + nextComponentId++;
const uniqueConnectionId = () => "connection-" + nextConnectionId++;

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
