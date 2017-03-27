import { connect } from 'react-redux';
import { addEllipse, addPipe, addRectangle } from '../actions';
import ToolBar from '../components/ToolBar';

const mapDispatchToProps = {
    addEllipse,
    addPipe,
    addRectangle
};

const mapStateToProps = (state) => ({
    components: state.components,
    connections: state.connections
});

const ToolBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBar)

export default ToolBarContainer;
