let nextComponentId = 0;

const maxX = 1100;
const maxY = 500;
const randomX = () => Math.random() * (maxX - 100) + 100;
const randomY = () => Math.random() * (maxY - 100) + 100;

export const addRectangle = () => ({
    type: 'ADD_RECTANGLE',
    id: 'rectangle-' + nextComponentId++,
    x: randomX(),
    y: randomY(),
    width: 100,
    height: 100
});

export const addEllipse = () => ({
    type: 'ADD_ELLIPSE',
    id: 'ellipse-' + nextComponentId++,
    x: randomX(),
    y: randomY(),
    width: 100,
    height: 100
});

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
