import React from 'react';
import { useStore } from '../store';

function PropertiesPanel({ className, component }) {
  const { updateComponent, removeComponent } = useStore();
  
  if (!component) {
    return (
      <div className={className}>
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-gray-500">Select a component to view its properties</p>
      </div>
    );
  }
  
  const handleChange = (field, value) => {
    // For nested properties like dimensions.width
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateComponent(component.id, {
        [parent]: {
          ...component[parent],
          [child]: value
        }
      });
    } else {
      updateComponent(component.id, { [field]: value });
    }
  };
  
  const handleDelete = () => {
    removeComponent(component.id);
  };
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Properties: {component.type}</h2>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Dimensions section */}
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Dimensions</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600">Width (mm)</label>
              <input
                type="number"
                value={component.dimensions.width}
                onChange={(e) => handleChange('dimensions.width', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('width')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('width') ? 'bg-gray-100' : ''
                }`}
                min="10"
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Height (mm)</label>
              <input
                type="number"
                value={component.dimensions.height}
                onChange={(e) => handleChange('dimensions.height', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('height')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('height') ? 'bg-gray-100' : ''
                }`}
                min="10"
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Depth (mm)</label>
              <input
                type="number"
                value={component.dimensions.depth}
                onChange={(e) => handleChange('dimensions.depth', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('depth')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('depth') ? 'bg-gray-100' : ''
                }`}
                min="10"
                step="1"
              />
            </div>
          </div>
        </div>
        
        {/* Position section */}
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Position</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm text-gray-600">X</label>
              <input
                type="number"
                value={Math.round(component.position.x)}
                onChange={(e) => handleChange('position.x', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('x')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('x') ? 'bg-gray-100' : ''
                }`}
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Y</label>
              <input
                type="number"
                value={Math.round(component.position.y)}
                onChange={(e) => handleChange('position.y', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('y')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('y') ? 'bg-gray-100' : ''
                }`}
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Z</label>
              <input
                type="number"
                value={component.position.z}
                onChange={(e) => handleChange('position.z', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('z')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('z') ? 'bg-gray-100' : ''
                }`}
                step="1"
              />
            </div>
          </div>
        </div>
        
        {/* Component-specific properties */}
        {component.type === 'cabinet' && (
          <div className="border rounded p-3">
            <h3 className="font-medium mb-2">Cabinet Properties</h3>
            
            <div>
              <label className="block text-sm text-gray-600">Material Thickness (mm)</label>
              <input
                type="number"
                value={component.materialThickness}
                onChange={(e) => handleChange('materialThickness', Number(e.target.value))}
                className="w-full border rounded p-1"
                min="1"
                max="50"
                step="1"
              />
            </div>
          </div>
        )}
        
        {component.type === 'shelf' && (
          <div className="border rounded p-3">
            <h3 className="font-medium mb-2">Shelf Properties</h3>
            
            <div>
              <label className="block text-sm text-gray-600">Max Load (kg)</label>
              <input
                type="number"
                value={component.maxLoadCapacity}
                onChange={(e) => handleChange('maxLoadCapacity', Number(e.target.value))}
                className="w-full border rounded p-1"
                min="1"
                max="500"
                step="1"
              />
            </div>
          </div>
        )}
        
        {component.type === 'drawer' && (
          <div className="border rounded p-3">
            <h3 className="font-medium mb-2">Drawer Properties</h3>
            
            <div>
              <label className="block text-sm text-gray-600">Extension Type</label>
              <select
                value={component.extensionType}
                onChange={(e) => handleChange('extensionType', e.target.value)}
                className="w-full border rounded p-1"
              >
                <option value="full">Full Extension</option>
                <option value="partial">Partial Extension</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Appearance */}
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Appearance</h3>
          
          <div>
            <label className="block text-sm text-gray-600">Color</label>
            <input
              type="color"
              value={component.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full border rounded p-1 h-10"
            />
          </div>
        </div>
        
        {/* Constraints information (read-only) */}
        <div className="border rounded p-3 bg-gray-50">
          <h3 className="font-medium mb-2">Constraints</h3>
          
          <div className="text-sm">
            <p><span className="font-medium">Type:</span> {component.constraintType}</p>
            {component.constrainedDimensions?.length > 0 && (
              <p><span className="font-medium">Constrained:</span> {component.constrainedDimensions.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;