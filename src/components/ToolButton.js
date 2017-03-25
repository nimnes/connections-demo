import React, { PropTypes } from 'react'

const ToolButton = ({ title, onToolButtonClick }) => (
    <li className="tool-button-item">
        <button onClick={onToolButtonClick} className="tool-button">
            {title}
        </button>
    </li>
);

ToolButton.propTypes = {
    onToolButtonClick: PropTypes.func.isRequired
};

export default ToolButton;
