import React, { useRef, useState } from 'react';
import { useStore } from '../store';

function ComponentRenderer({ component, isSelected, onClick, scale, theme }) {
  const elementRef = useRef();
  const { updateComponent } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (!isSelected) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    
    // Calculate movement adjusted for scale
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;
    
    // Only allow dragging along unconstrained dimensions
    const constrainedDims = component.constrainedDimensions || [];
    const updates = { position: { ...component.position } };
    
    if (!constrainedDims.includes('x')) {
      updates.position.x += deltaX;
    }
    
    if (!constrainedDims.includes('y')) {
      updates.position.y += deltaY;
    }
    
    updateComponent(component.id, updates);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);
  
  // Get component style based on type and selection state
  const getComponentStyle = () => {
    // Base style without border (moved to component-specific styling)
    const baseStyle = {
      position: 'absolute',
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      width: `${component.dimensions.width}px`,
      height: `${component.dimensions.height}px`,
      backgroundColor: component.color,
      cursor: isSelected ? 'move' : 'pointer',
      zIndex: isSelected ? 10 : 1
    };
    
    // Get border style based on selection state
    const getBorderStyle = () => {
      if (isSelected) {
        return {
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: theme.name === 'light' ? '#3b82f6' : '#60a5fa'
        };
      } else {
        return {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.name === 'light' ? '#666' : '#999'
        };
      }
    };
    
    // Add component-specific styling
    switch (component.type) {
      case 'cabinet':
        return {
          ...baseStyle,
          ...getBorderStyle(),
          boxShadow: theme.name === 'light' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.3)',
          opacity: component.opacity !== undefined ? component.opacity : 1
        };
      case 'shelf':
        return {
          ...baseStyle,
          ...getBorderStyle(),
          height: `${component.dimensions.height}px`
        };
      case 'drawer':
        const borderStyle = getBorderStyle();
        return {
          ...baseStyle,
          borderLeftWidth: borderStyle.borderWidth,
          borderLeftStyle: borderStyle.borderStyle,
          borderLeftColor: borderStyle.borderColor,
          borderRightWidth: borderStyle.borderWidth,
          borderRightStyle: borderStyle.borderStyle,
          borderRightColor: borderStyle.borderColor,
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: theme.name === 'light' ? '#999' : '#ccc',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: theme.name === 'light' ? '#999' : '#ccc'
        };
      case 'hangingRod':
        return {
          ...baseStyle,
          ...getBorderStyle(),
          height: `${component.dimensions.height}px`,
          borderRadius: '10px'
        };
      case 'handle':
        return {
          ...baseStyle,
          ...getBorderStyle(),
          borderRadius: '4px'
        };
      default:
        return {
          ...baseStyle,
          ...getBorderStyle()
        };
    }
  };
  
  // Render resize handles if component is selected
  const renderResizeHandles = () => {
    if (!isSelected) return null;
    
    const handles = [];
    const constrainedDims = component.constrainedDimensions || [];
    const handleColor = theme.name === 'light' ? 'bg-blue-500' : 'bg-blue-400';
    
    // Right handle (width)
    if (!constrainedDims.includes('width')) {
      handles.push(
        <div
          key="right"
          className={`absolute w-3 h-3 ${handleColor} rounded-full cursor-ew-resize`}
          style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
          onMouseDown={(e) => handleResizeStart(e, 'width')}
        />
      );
    }
    
    // Bottom handle (height)
    if (!constrainedDims.includes('height')) {
      handles.push(
        <div
          key="bottom"
          className={`absolute w-3 h-3 ${handleColor} rounded-full cursor-ns-resize`}
          style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}
          onMouseDown={(e) => handleResizeStart(e, 'height')}
        />
      );
    }
    
    // Bottom-right handle (both width and height)
    if (!constrainedDims.includes('width') && !constrainedDims.includes('height')) {
      handles.push(
        <div
          key="bottom-right"
          className={`absolute w-3 h-3 ${handleColor} rounded-full cursor-nwse-resize`}
          style={{ bottom: '-6px', right: '-6px' }}
          onMouseDown={(e) => handleResizeStart(e, 'both')}
        />
      );
    }
    
    return handles;
  };
  
  // Handle resize start
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  
  const handleResizeStart = (e, type) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle resize move
  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    e.stopPropagation();
    
    // Calculate movement adjusted for scale
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;
    
    const updates = { dimensions: { ...component.dimensions } };
    
    if (resizeType === 'width' || resizeType === 'both') {
      updates.dimensions.width = Math.max(50, component.dimensions.width + deltaX);
    }
    
    if (resizeType === 'height' || resizeType === 'both') {
      updates.dimensions.height = Math.max(50, component.dimensions.height + deltaY);
    }
    
    updateComponent(component.id, updates);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeType(null);
  };
  
  // Add global mouse event listeners when resizing
  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, dragStart, resizeType]);
  
  // Render component label
  const renderLabel = () => {
    const labelBg = theme.name === 'light' ? 'bg-white bg-opacity-75' : 'bg-gray-800 bg-opacity-75';
    const labelText = theme.name === 'light' ? 'text-gray-800' : 'text-gray-200';
    
    return (
      <div 
        className={`absolute top-0 left-0 ${labelBg} px-1 text-xs ${labelText}`}
        style={{ pointerEvents: 'none' }}
      >
        {component.type}
      </div>
    );
  };
  
  return (
    <div
      ref={elementRef}
      style={getComponentStyle()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={handleMouseDown}
    >
      {renderLabel()}
      {renderResizeHandles()}
    </div>
  );
}

export default ComponentRenderer;