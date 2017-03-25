import React, { Component } from 'react';
import ToolBarContainer from '../containers/ToolBarContainer'
import CanvasContainer from '../containers/CanvasContainer'
import '../App.css';

class App extends Component {
    render() {
        return (
            <div>
                <ToolBarContainer />
                <CanvasContainer />
            </div>
        );
    }
}

export default App;
