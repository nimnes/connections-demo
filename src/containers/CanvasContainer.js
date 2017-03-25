import { connect } from 'react-redux';
import { moveComponent, selectComponent } from '../actions';
import Canvas from '../components/Canvas';

const mapStateToProps = (state) => ({
    components: state.components,
    connections: state.connections,
    selection: state.selection
});

const mapDispatchToProps = {
    moveComponent,
    selectComponent
};

const CanvasContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas)

export default CanvasContainer;
