import React, { PropTypes } from 'react';
import ToolButton from './ToolButton';
import $ from 'jquery';

const ToolBar = ({ addEllipse, addRectangle, addPipe }) => {
    const canvasSize = () => ({
        width: $(".canvas").width(),
        height: $(".canvas").height()
    });

    return (
        <ul className="tool-bar">
            <ToolButton
                title='Add ellipse'
                onToolButtonClick={() => addEllipse(canvasSize())} />
            <ToolButton
                title='Add rectangle'
                onToolButtonClick={() => addRectangle(canvasSize())} />
            <ToolButton
                title='Add pipe'
                onToolButtonClick={() => addPipe(canvasSize())} />
        </ul>
    );
}

ToolBar.propTypes = {
    addEllipse: PropTypes.func.isRequired,
    addPipe: PropTypes.func.isRequired,
    addRectangle: PropTypes.func.isRequired
};

export default ToolBar;
