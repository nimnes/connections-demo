import { connect } from 'react-redux';
import { addEllipse, addRectangle } from '../actions';
import ToolBar from '../components/ToolBar';

const mapDispatchToProps = {
    addEllipse,
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
