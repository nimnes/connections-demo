import React, { Component } from 'react';
import ToolBarContainer from '../containers/ToolBarContainer';
import CanvasContainer from '../containers/CanvasContainer';
import StateEditorContainer from '../containers/StateEditorContainer';
import '../App.css';

class App extends Component {
    render() {
        return (
            <div className='main'>
                <ToolBarContainer />
                <div className='editor-area'>
                    <CanvasContainer />
                    <StateEditorContainer />
                </div>
            </div>
        );
    }
}

export default App;
