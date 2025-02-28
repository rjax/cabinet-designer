import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../store';
import ComponentRenderer from './ComponentRenderer';

function DesignCanvas({ className }) {
  const canvasRef = useRef();
  const [scale, setScale] = useState(1);
  const { components, addComponent, selectComponent, selectedComponentId } = useStore();
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Calculate position relative to canvas
      const position = {
        x: (offset.x - canvasRect.left) / scale,
        y: (offset.y - canvasRect.top) / scale,
        z: 0
      };
      
      // Add the component at the drop position
      addComponent(item.type, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  
  // Connect the drop ref to the canvas ref
  const connectRefs = (element) => {
    drop(element);
    canvasRef.current = element;
  };
  
  // Handle zoom
  const handleZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prevScale => Math.max(0.5, Math.min(2, prevScale + delta)));
  };
  
  return (
    <div className={`${className} relative`}>
      <div className="absolute top-2 right-2 bg-white rounded shadow p-2 z-10">
        <button 
          onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
          className="px-2 py-1 bg-gray-200 rounded mr-1"
        >
          +
        </button>
        <button 
          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="ml-2">{Math.round(scale * 100)}%</span>
      </div>
      
      <div 
        ref={connectRefs} 
        className={`w-full h-full overflow-auto ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}
        onWheel={handleZoom}
      >
        <div 
          className="relative"
          style={{ 
            width: '5000px', 
            height: '5000px', 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundImage: 'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {components.map(component => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              onClick={() => selectComponent(component.id)}
              scale={scale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignCanvas;