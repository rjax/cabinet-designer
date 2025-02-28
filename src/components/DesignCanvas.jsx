import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../store';
import ComponentRenderer from './ComponentRenderer';

function DesignCanvas({ className }) {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(1);
  const { components, addComponent, selectComponent, selectedComponentId, theme } = useStore();
  
  // Auto-adjust scale to fit 3m width in viewport
  useEffect(() => {
    const calculateInitialScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Calculate scale to fit 3000px (3m) in the available width
        const newScale = containerWidth / 3000;
        setScale(newScale);
      }
    };
    
    calculateInitialScale();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateInitialScale);
    return () => window.removeEventListener('resize', calculateInitialScale);
  }, []);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Calculate drop position relative to the scalable canvas
      // This gives us the exact position where the mouse is in the canvas coordinate system
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
  
  // Helper function to get the component info for status bar
  const getSelectedComponentInfo = () => {
    const selectedComponent = components.find(c => c.id === selectedComponentId);
    if (!selectedComponent) return null;
    
    // Check if it's a cabinet
    if (selectedComponent.type === 'cabinet') {
      return {
        type: 'cabinet',
        label: 'Cabinet selected - Drag components to add inside'
      };
    }
    
    return {
      type: selectedComponent.type,
      label: `${selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} selected`
    };
  };
  
  const selectedComponentInfo = getSelectedComponentInfo();
  
  return (
    <div ref={containerRef} className={`${className} relative`}>
      {/* Status bar showing selected component info */}
      {selectedComponentInfo && (
        <div className={`absolute top-2 left-2 ${theme.componentBg} rounded shadow p-2 z-10`}>
          <span className={`${theme.text} text-sm flex items-center`}>
            {selectedComponentInfo.type === 'cabinet' ? (
              <>
                <span className="text-lg mr-2">🗄️</span>
                <span className={selectedComponentInfo.type === 'cabinet' ? 'font-semibold' : ''}>
                  {selectedComponentInfo.label}
                </span>
              </>
            ) : (
              <>
                <span className={`${theme.text}`}>
                  {selectedComponentInfo.label}
                </span>
              </>
            )}
          </span>
        </div>
      )}
      
      <div className={`absolute top-2 right-2 ${theme.componentBg} rounded shadow p-2 z-10`}>
        <button 
          onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
          className={`px-2 py-1 bg-gray-200 rounded mr-1 ${theme.name === 'dark' ? 'text-gray-800' : ''}`}
        >
          +
        </button>
        <button 
          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
          className={`px-2 py-1 bg-gray-200 rounded ${theme.name === 'dark' ? 'text-gray-800' : ''}`}
        >
          -
        </button>
        <span className={`ml-2 ${theme.text}`}>{Math.round(scale * 100)}%</span>
      </div>
      
      <div 
        ref={connectRefs} 
        className={`w-full h-full overflow-auto ${isOver ? 'bg-blue-100' : theme.canvas}`}
        onWheel={handleZoom}
        onClick={() => selectComponent(null)} // Deselect when clicking on empty area
      >
        <div 
          className="relative"
          style={{ 
            width: '3000px', 
            height: '5000px', 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundImage: `linear-gradient(${theme.canvasGrid} 1px, transparent 1px), linear-gradient(90deg, ${theme.canvasGrid} 1px, transparent 1px)`,
            backgroundSize: '100px 100px' // 10cm grid
          }}
        >
          {components.map(component => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              onClick={() => selectComponent(component.id)}
              scale={scale}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignCanvas;