import React, { PropTypes } from 'react';
import Bounds from './Bounds';
import Ellipse from './Ellipse';
import Rectangle from './Rectangle';
import interactiveComponent from './interactiveComponent';

const RectangleComponent = interactiveComponent(Rectangle);
const EllipseComponent = interactiveComponent(Ellipse);

const createComponent = (component, moveComponent, selectComponent) => {
    const options = {
        ...component,
        key: component.id,
        onComponentMouseDown: (event) => {
            event.stopPropagation();
            selectComponent(component.id);
        },
        onMove: (offsetX, offsetY) => moveComponent(component.id, offsetX, offsetY)
    };

    switch (component.type) {
        case "rectangle":
            return (
                <RectangleComponent
                    {...options}
                />
            );
        case "ellipse":
            return (
                <EllipseComponent
                    {...options}
                />
        );
        default:
            return <div key={component.id} />;
    }
};

const createBounds = (component, resizeComponent) => {
    return (
        <Bounds
            component={component}
            onResize={(bounds) => resizeComponent(component.id, bounds)} />
    );
};

const Canvas = ({ components, selection, moveComponent, resizeComponent, selectComponent }) => {
    const elements = components.map(c => createComponent(c, moveComponent, selectComponent));
    const selectedComponent = components.find(c => c.id === selection);

    return (
        <svg className="canvas" onMouseDown={() => selectComponent(null)}>
            {elements}
            {selectedComponent && createBounds(selectedComponent, resizeComponent)}
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect className="canvas-grid" width="100%" height="100%" fill="url(#grid)" />
        </svg>
    );
}

Canvas.propTypes = {
    components: PropTypes.array,
    moveComponent: PropTypes.func,
    resizeComponent: PropTypes.func,
    selectin: PropTypes.string,
    selectComponent: PropTypes.func
};

export default Canvas;
