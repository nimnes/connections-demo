import React, { PropTypes } from 'react';
import R from 'ramda';

const createPath = (points) => {
    const start = R.head(points);
    return R.tail(points)
        .reduce((path, point) => path + ` L ${point.x} ${point.y}`, `M ${start.x} ${start.y}`);
}

class Pipe extends React.Component {

    render() {
        const { points } = this.props;
        return (
            <path
                ref='component'
                d={createPath(points)}
                stroke='rgba(104, 151, 155, 0.8)'
                fill='none'
                strokeWidth='5'
                onMouseDown={this.props.onComponentMouseDown}
            />
        );
    }
};

Pipe.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    points: PropTypes.array
};

export default Pipe;
