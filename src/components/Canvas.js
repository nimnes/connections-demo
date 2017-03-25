import React, { PropTypes } from 'react';
import Bounds from './Bounds';
import Ellipse from './Ellipse';
import Rectangle from './Rectangle';
import interactiveComponent from './interactiveComponent';

const RectangleComponent = interactiveComponent(Rectangle);
const EllipseComponent = interactiveComponent(Ellipse);

const createComponent = (component, moveComponent, selectComponent) => {
    switch (component.type) {
        case "rectangle":
            return (
                <RectangleComponent
                    x={component.x}
                    y={component.y}
                    width={component.width}
                    height={component.height}
                    key={component.id}
                    onComponentClick={() => selectComponent(component.id)}
                    onMove={(offsetX, offsetY) => moveComponent(component.id, offsetX, offsetY)}
                />
            );
        case "ellipse":
            return (
                <EllipseComponent
                    x={component.x}
                    y={component.y}
                    width={component.width}
                    height={component.height}
                    key={component.id}
                    onComponentClick={() => selectComponent(component.id)}
                    onMove={(offsetX, offsetY) => moveComponent(component.id, offsetX, offsetY)}
                />
        );
        default:
            return (
                <div key={component.id} />
            );
    }
};

const createBounds = (component) => {
    return (
        <Bounds component={component} />
    );
};

const Canvas = ({ components, selection, moveComponent, selectComponent }) => {
    const elements = components.map(c => createComponent(c, moveComponent, selectComponent));
    const selectedComponent = components.find(c => c.id === selection);

    return (
        <svg className="canvas" width="1280px" height="700px">
            {elements}
            {selectedComponent && createBounds(selectedComponent)}
        </svg>
    );
}

Canvas.propTypes = {
    components: PropTypes.array,
    moveComponent: PropTypes.func,
    selectin: PropTypes.string,
    selectComponent: PropTypes.func
};

export default Canvas;
