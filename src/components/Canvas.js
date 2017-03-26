import React, { PropTypes } from 'react';
import Bounds from './Bounds';
import CanvasGrid from './CanvasGrid';
import ConnectionPoint from './ConnectionPoint';
import Ellipse from './Ellipse';
import Rectangle from './Rectangle';
import interactiveComponent from './interactiveComponent';

const RectangleComponent = interactiveComponent(Rectangle);
const EllipseComponent = interactiveComponent(Ellipse);

class Canvas extends React.Component {
    render() {
        const { components, selectComponent, selection } = this.props;
        const elements = components.map(c => this._createComponent(c));
        const selectedComponent = this._findComponent(selection);
        const connectionPoints = this._createConnectionPoints();

        return (
            <svg className="canvas" onMouseDown={() => selectComponent(null)}>
                {elements}
                {selectedComponent && this._createBounds(selectedComponent)}
                {connectionPoints}
                <CanvasGrid />
            </svg>
        );
    }

    _createBounds(component) {
        return (
            <Bounds
                component={component}
                onResize={(bounds) => this.props.resizeComponent(component.id, bounds)} />
        );
    }

    _createComponent(component) {
        const options = {
            ...component,
            key: component.id,
            onComponentMouseDown: event => this._onComponentMouseDown(event, component),
            onMove: (offsetX, offsetY) => this.props.moveComponent(component.id, offsetX, offsetY)
        };

        switch (component.type) {
            case "rectangle":
                return <RectangleComponent {...options} />;
            case "ellipse":
                return <EllipseComponent {...options} />;
            default:
                return <div key={component.id} />;
        }
    }

    _createConnectionPoints() {
        const { connections } = this.props;
        return connections
            .map(connection => {
                const component = this._findComponent(connection.componentId);
                const x = component.x + connection.sx * component.width;
                const y = component.y + connection.sy * component.height;

                return (
                    <ConnectionPoint
                        x={x}
                        y={y}
                        key={connection.id}
                        onConnectionPointClick={() => this.props.removeConnection(connection.id)}
                    />
                );
            });
    }

    _findComponent(componentId) {
        return this.props.components.find(c => c.id === componentId);
    }

    _onComponentMouseDown(event, component) {
        event.stopPropagation();

        if (event.ctrlKey || event.metaKey) {
            const mousePosition = {
                x: event.nativeEvent.offsetX,
                y: event.nativeEvent.offsetY
            };

            const sx = (mousePosition.x - component.x) / component.width;
            const sy = (mousePosition.y - component.y) / component.height;

            this.props.addConnection(component.id, sx, sy);
        } else {
            this.props.selectComponent(component.id);
        }
    }
}

Canvas.propTypes = {
    addConnection:    PropTypes.func,
    components:       PropTypes.array,
    moveComponent:    PropTypes.func,
    removeConnection: PropTypes.func,
    resizeComponent:  PropTypes.func,
    selectin:         PropTypes.string,
    selectComponent:  PropTypes.func
};

export default Canvas;
