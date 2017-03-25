import React, { PropTypes } from 'react';

class Rectangle extends React.Component {

    render() {
        const { x, y, width, height, onComponentClick } = this.props;
        return (
            <rect
                ref='component'
                x={x}
                y={y}
                width={width}
                height={height}
                fill='#55aa55'
                opacity='0.8'
                onClick={onComponentClick}
            />
        );
    }
};

Rectangle.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    onComponentClick: PropTypes.func
};

export default Rectangle;
