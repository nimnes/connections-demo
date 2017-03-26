import React, { PropTypes } from 'react'
import Rx from 'rxjs';
import $ from 'jquery';

const handleSize = 6;

class BoundsHandle extends React.Component {

    componentDidMount() {
        const mouseDown$ = Rx.Observable.fromEvent(this.refs.handle, "mousedown");
        const mouseMove$ = Rx.Observable.fromEvent($(document), "mousemove");
        const mouseUp$ = Rx.Observable.fromEvent($(document), "mouseup");

        this.mouseSubscription = mouseDown$
            .do(e => e.stopPropagation())
            .switchMap(down =>
                mouseMove$
                    .scan((prevPosition, move) => {
                        const position = { x: move.pageX, y: move.pageY };
                        const dx = position.x - prevPosition.x;
                        const dy = position.y - prevPosition.y;

                        this.props.onHandleMove(dx, dy);
                        return position;
                    }, { x: down.pageX, y: down.pageY })
                    .takeUntil(mouseUp$))
            .subscribe();
    }

    componentWillUnmount() {
        this.mouseSubscription.unsubscribe();
    }

    render() {
        const { x, y } = this.props;
        return (
            <rect
                ref='handle'
                x={x - handleSize / 2}
                y={y - handleSize / 2}
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

BoundsHandle.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    onHandleMove: PropTypes.func
};

export default BoundsHandle;
