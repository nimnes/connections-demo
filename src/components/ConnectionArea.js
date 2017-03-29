import React, { PropTypes } from 'react';

const createEllipseArea = ({ x, y, width, height }) => (
    <ellipse
        fill='none'
        strokeWidth='2'
        stroke='#aa3e39'
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
    />
)

const createRectangularArea = ({ x, y, width, height }) => (
    <rect
        fill='none'
        strokeWidth='2'
        stroke='#aa3e39'
        x={x}
        y={y}
        width={width}
        height={height}
    />
);

const getSnapPoints = ({ x, y, width, height, type }) => {
    if (type !== 'pipe') {
        return [
            { x: x, y: y + height / 2 },
            { x: x + width / 2, y: y },
            { x: x + width, y: y + height / 2 },
            { x: x + width / 2, y: y + height }
        ];
    }

    return [];
}

const getConnectionArea = (component) => {
    switch (component.type) {
        case 'ellipse':
            return createEllipseArea(component);
        case 'rectangle':
            return createRectangularArea(component);
        default:
            return null;
    }
}

const ConnectionArea = ({ component }) => {
    const snapPoints = getSnapPoints(component)
        .map((point, index) => (
            <ellipse
                key={`snap-point-${component.id}-${index}`}
                cx={point.x}
                cy={point.y}
                rx='3'
                ry='3'
                fill='#daf0dd'
                stroke='#2c8437'
            />
        ));

    const connectionArea = getConnectionArea(component);

    return (
        <g>
            {connectionArea}
            {snapPoints}
        </g>
    );
}

ConnectionArea.propTypes = {
    component: PropTypes.object
};

export default ConnectionArea;
