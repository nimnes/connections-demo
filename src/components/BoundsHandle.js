import React, { PropTypes } from 'react'

const handleSize = 8;
const BoundsHandle = ({ x, y }) => {
    return (
        <rect
            x={x - handleSize / 2}
            y={y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            fill='#88cc88'
            stroke='#004400'
            style={{ cursor: 'pointer' }}
        />
    );
};

BoundsHandle.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number
};

export default BoundsHandle;
