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
        strokeWidth='1'
        stroke='#aa3e39'
        x={x}
        y={y}
        width={width}
        height={height}
    />
);

const ConnectionArea = ({ component }) => {
    switch (component.type) {
        case 'ellipse':
            return createEllipseArea(component);
        case 'rectangle':
            return createRectangularArea(component);
        default:
            return null;
    }
}

ConnectionArea.propTypes = {
    component: PropTypes.object
};

export default ConnectionArea;
