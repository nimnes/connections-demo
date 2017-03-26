import React, { PropTypes } from 'react';

const size = 6;
const ConnectionPoint = ({ x, y, onConnectionPointClick }) => (
    <ellipse
        cx={x}
        cy={y}
        rx={size}
        ry={size}
        fill='#ffcfcc'
        stroke='#aa3e39'
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onConnectionPointClick}
    />
);

ConnectionPoint.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    onConnectionPointClick: PropTypes.func
};

export default ConnectionPoint;
