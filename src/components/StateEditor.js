import React, { PropTypes } from 'react';

const StateEditor = (state) => {
    const stateJSON = JSON.stringify(state, undefined, 4);
    return (
        <textarea
            className="state-editor"
            readOnly='true'
            value={stateJSON}
        />
    );
};

StateEditor.propTypes = {
    state: PropTypes.object.isRequired
};

export default StateEditor;
