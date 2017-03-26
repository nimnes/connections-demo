let nextComponentId = 1;

const defaultSize = 100;
const randomPoint = (maxValue) => Math.random() * (maxValue - defaultSize);
const uniqueId = () => "component-" + nextComponentId++;

export const addRectangle = (canvasSize) => ({
    type: 'ADD_RECTANGLE',
    id: uniqueId(),
    x: randomPoint(canvasSize.width),
    y: randomPoint(canvasSize.height),
    width: defaultSize,
    height: defaultSize
});

export const addEllipse = (canvasSize) => ({
    type: 'ADD_ELLIPSE',
    id: uniqueId(),
    x: randomPoint(canvasSize.width),
    y: randomPoint(canvasSize.height),
    width: defaultSize,
    height: defaultSize
});

export const resizeComponent = (id, bounds) => {
    return {
        type: 'RESIZE_COMPONENT',
        id,
        bounds
    };
};

export const selectComponent = (id) => {
    return {
        type: 'SELECT_COMPONENT',
        id
    };
};

export const moveComponent = (id, offsetX, offsetY) => {
    return {
        type: 'MOVE_COMPONENT',
        id,
        offsetX,
        offsetY
    };
};
