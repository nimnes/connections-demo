import React from 'react';
import Rx from 'rxjs'
import $ from 'jquery'

const interactiveComponent = (WrappedComponent) => {
    return class extends React.Component {

        componentDidMount() {
            const mouseDown$ = Rx.Observable.fromEvent(this.component.refs.component, "mousedown");
            const mouseMove$ = Rx.Observable.fromEvent($(document), "mousemove");
            const mouseUp$ = Rx.Observable.fromEvent($(document), "mouseup");

            this.mouseSubscription = mouseDown$
                .switchMap(down =>
                    mouseMove$
                        .scan((prevPosition, move) => {
                            const position = { x: move.pageX, y: move.pageY };
                            const dx = position.x - prevPosition.x;
                            const dy = position.y - prevPosition.y;

                            this.props.onMove(dx, dy);
                            return position;
                        }, { x: down.pageX, y: down.pageY })
                        .takeUntil(mouseUp$))
                .subscribe();
        }

        componentWillUnmount() {
            this.mouseSubscription.unsubscribe();
        }

        render() {
            return <WrappedComponent
                {...this.props}
                ref={(component) => { this.component = component; }} />;
        }

    }
};

export default interactiveComponent;
