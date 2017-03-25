import React, { PropTypes } from 'react'
import ToolButton from './ToolButton'

const ToolBar = ({ addEllipse, addRectangle }) => {
    return (
        <ul className="tool-bar">
            <ToolButton
                title='Add ellipse'
                onToolButtonClick={() => addEllipse()} />
            <ToolButton
                title='Add rectangle'
                onToolButtonClick={() => addRectangle()} />
        </ul>
    );
}

ToolBar.propTypes = {
    addEllipse: PropTypes.func.isRequired,
    addRectangle: PropTypes.func.isRequired
};

export default ToolBar;
