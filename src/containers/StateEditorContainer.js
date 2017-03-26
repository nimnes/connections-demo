import { connect } from 'react-redux';
import StateEditor from '../components/StateEditor';

const mapStateToProps = (state) => ({
    state
});

const mapDispatchToProps = {};

const StateEditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StateEditor)

export default StateEditorContainer;
