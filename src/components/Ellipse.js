import React, { PropTypes } from 'react'

class Ellipse extends React.Component {

    render() {
        const { x, y, width, height, onComponentClick } = this.props;
        return (
            <ellipse
                ref='component'
                cx={x + width / 2}
                cy={y + height / 2}
                rx={width / 2}
                ry={height / 2}
                fill='#55aa55'
                opacity='0.8'
                onClick={onComponentClick}
            />
        );
    }
};

Ellipse.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    onComponentClick: PropTypes.func
};

export default Ellipse;
