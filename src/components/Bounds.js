import React, { PropTypes } from 'react';
import BoundsHandle from './BoundsHandle';

const anchors = [
    ['minX', 'minY'],
    ['minX', 'midY'],
    ['minX', 'maxY'],
    ['maxX', 'minY'],
    ['maxX', 'maxY'],
    ['maxX', 'midY'],
    ['midX', 'minY'],
    ['midX', 'maxY']
];

const getBounds = (component) => {
    return {
        minX: component.x,
        minY: component.y,
        maxX: component.x + component.width,
        maxY: component.y + component.height,
        midX: component.x + component.width / 2,
        midY: component.y + component.height / 2
    };
}

const createHandles = (bounds, updateBounds) => {
    return anchors
        .reduce((handles, anchor, index) => {
            const handle = (
                <BoundsHandle
                    x={bounds[anchor[0]]}
                    y={bounds[anchor[1]]}
                    key={"bounds-handle-" + index}
                    onHandleMove={(dx, dy) => updateBounds(anchor, dx, dy)}
                />
            );
            return handles.concat(handle);
        }, []);
}

const Bounds = ({ component, onResize }) => {
    const { x, y, width, height } = component;
    const bounds = getBounds(component);

    const updateBounds = (anchor, dx, dy) => {
        const updatedBounds = {
            ...bounds,
            [anchor[0]]: bounds[anchor[0]] + dx,
            [anchor[1]]: bounds[anchor[1]] + dy
        };

        onResize(updatedBounds);
    };

    const handles = createHandles(bounds, updateBounds);
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill='none'
                stroke='#2c8437'
                strokeDasharray='3 3'
                pointerEvents='none'
            />
            {handles}
        </g>
    );
};

Bounds.propTypes = {
    component: PropTypes.object.isRequired,
    onResize: PropTypes.func
};

export default Bounds;
