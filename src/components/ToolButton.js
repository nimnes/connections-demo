import React, { PropTypes } from 'react'

const ToolButton = ({ title, onToolButtonClick }) => (
    <li className="tool-button-item">
        <div onClick={onToolButtonClick} className="tool-button">
            {title}
        </div>
    </li>
);

ToolButton.propTypes = {
    onToolButtonClick: PropTypes.func.isRequired
};

export default ToolButton;
