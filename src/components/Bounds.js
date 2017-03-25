import React, { PropTypes } from 'react';
import BoundsHandle from './BoundsHandle';

const handleDefs = [
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

const createHandles = (bounds) => {
    return handleDefs
        .reduce((handles, handleDef, index) => {
            const handle = (
                <BoundsHandle
                    x={bounds[handleDef[0]]}
                    y={bounds[handleDef[1]]}
                    key={"bounds-handle-" + index}
                />
            );
            return handles.concat(handle);
        }, []);
}

const Bounds = ({ component }) => {
    const { x, y, width, height } = component;
    const handles = createHandles(getBounds(component));
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill='none'
                stroke='#004400'
                strokeDasharray='3 3'
                pointerEvents='none'
            />
            {handles}
        </g>
    );
};

Bounds.propTypes = {
    component: PropTypes.object.isRequired
};

export default Bounds;
