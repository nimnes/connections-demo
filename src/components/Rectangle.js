import React, { PropTypes } from 'react';

class Rectangle extends React.Component {

    render() {
        const { x, y, width, height, onComponentMouseDown } = this.props;
        return (
            <rect
                ref='component'
                x={x}
                y={y}
                width={width}
                height={height}
                fill='#84c68c'
                opacity='0.8'
                onMouseDown={onComponentMouseDown}
            />
        );
    }
};

Rectangle.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    onComponentMouseDown: PropTypes.func
};

export default Rectangle;
