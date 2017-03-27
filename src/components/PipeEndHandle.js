import React, { PropTypes } from 'react';
import Rx from 'rxjs';
import $ from 'jquery';

const handleSize = 8;
const { fromEvent } = Rx.Observable;

class PipeEndHandle extends React.Component {

    componentDidMount() {
        const mouseDown$ = fromEvent(this.refs.handle, "mousedown");
        const mouseMove$ = fromEvent($(document), "mousemove").map(e => ({ x: e.pageX, y: e.pageY }));
        const mouseUp$ = fromEvent($(document), "mouseup");

        const moveHandle$ = mouseDown$
            .do(e => e.stopPropagation())
            .switchMap(down =>
                mouseMove$
                    .scan((prev, position) => ({
                        offset: {
                            x: position.x - prev.position.x,
                            y: position.y - prev.position.y
                        },
                        position
                    }), { position: { x: down.pageX, y: down.pageY }})
                    .map(state => state.offset)
                    .takeUntil(mouseUp$))
            .map(offset => () => this.props.onHandleMove(offset.x, offset.y));

        const startConnecting$ = mouseDown$.map(() => () => this.props.startConnecting(this.props.component.id));
        const stopConnecting$ = mouseUp$.map(() => () => this.props.stopConnecting(this.props.component.id));

        this.subscription = Rx.Observable.merge(moveHandle$, startConnecting$, stopConnecting$)
            .do(action => action())
            .subscribe();
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        const { anchor, component } = this.props;
        const position = anchor === 'start' ?
            component.points[0] : component.points[component.points.length - 1];

        return (
            <rect
                ref='handle'
                x={position.x - handleSize / 2}
                y={position.y - handleSize / 2}
                width={handleSize}
                height={handleSize}
                fill={anchor === 'start' ? '#daf0dd' : '#ffe9e8'}
                stroke={anchor === 'start' ? '#2c8437' : '#aa3e39'}
                style={{ cursor: 'pointer' }}
                onClick={(e) => e.stopPropagation()}
            />
        );
    }
};

PipeEndHandle.propTypes = {
    anchor: PropTypes.string,
    component: PropTypes.object,
    startConnecting: PropTypes.func,
    stopConnecting: PropTypes.func
};

export default PipeEndHandle;
