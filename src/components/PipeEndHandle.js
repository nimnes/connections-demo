import React, { PropTypes } from 'react';
import Rx from 'rxjs';
import $ from 'jquery';

const handleSize = 6;

class PipeEndHandle extends React.Component {

    componentDidMount() {
        const mouseDown$ = Rx.Observable.fromEvent(this.refs.handle, "mousedown");
        const mouseMove$ = Rx.Observable.fromEvent($(document), "mousemove");
        const mouseUp$ = Rx.Observable.fromEvent($(document), "mouseup");

        const moveHandle$ = mouseDown$
            .do(e => e.stopPropagation())
            .switchMap(down =>
                mouseMove$
                    .scan((prev, move) => ({
                        prev: prev.current,
                        current: { x: move.pageX, y: move.pageY }
                    }), { current: { x: down.pageX, y: down.pageY }})
                    .map(({ prev, current }) => ({
                        x: current.x - prev.x,
                        y: current.y - prev.y
                    }))
                    .takeUntil(mouseUp$))
            .map(offset => () => this.props.onHandleMove(offset.x, offset.y));

        const startConnecting$ = mouseDown$.mapTo(this.props.startConnecting);
        const stopConnecting$ = mouseUp$.mapTo(this.props.stopConnecting);

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
                fill='#daf0dd'
                stroke='#2c8437'
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
