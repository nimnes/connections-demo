import { connect } from 'react-redux';
import {
    addConnection,
    moveComponent,
    removeConnection,
    resizeComponent,
    selectComponent,
    startConnecting,
    stopConnecting,
    movePipeEnd
} from '../actions';
import Canvas from '../components/Canvas';

const mapStateToProps = (state) => ({
    components: state.canvas.components,
    connectable: state.canvas.connectable,
    connections: state.canvas.connections,
    selection: state.selection
});

const mapDispatchToProps = {
    addConnection,
    moveComponent,
    removeConnection,
    resizeComponent,
    selectComponent,
    startConnecting,
    stopConnecting,
    movePipeEnd
};

const CanvasContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas)

export default CanvasContainer;
