import React from 'react';
import { useStore } from '../store';

function PropertiesPanel({ className, component }) {
  const { updateComponent, removeComponent, theme } = useStore();
  
  if (!component) {
    return (
      <div className={className}>
        <h2 className={`text-lg font-semibold mb-4 ${theme.text}`}>Properties</h2>
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
  
  const borderColor = theme.name === 'light' ? 'border-gray-300' : 'border-gray-600';
  const sectionBg = theme.name === 'light' ? '' : 'bg-gray-750';
  const disabledBg = theme.name === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const readOnlyBg = theme.name === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${theme.text}`}>Properties: {component.type}</h2>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Dimensions section */}
        <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
          <h3 className={`font-medium mb-2 ${theme.text}`}>Dimensions</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Width (mm)</label>
              <input
                type="number"
                value={component.dimensions.width}
                onChange={(e) => handleChange('dimensions.width', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('width')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('width') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                min="10"
                step="1"
              />
            </div>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Height (mm)</label>
              <input
                type="number"
                value={component.dimensions.height}
                onChange={(e) => handleChange('dimensions.height', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('height')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('height') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                min="10"
                step="1"
              />
            </div>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Depth (mm)</label>
              <input
                type="number"
                value={component.dimensions.depth}
                onChange={(e) => handleChange('dimensions.depth', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('depth')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('depth') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                min="10"
                step="1"
              />
            </div>
          </div>
        </div>
        
        {/* Position section */}
        <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
          <h3 className={`font-medium mb-2 ${theme.text}`}>Position</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>X</label>
              <input
                type="number"
                value={Math.round(component.position.x)}
                onChange={(e) => handleChange('position.x', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('x')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('x') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                step="1"
              />
            </div>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Y</label>
              <input
                type="number"
                value={Math.round(component.position.y)}
                onChange={(e) => handleChange('position.y', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('y')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('y') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                step="1"
              />
            </div>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Z</label>
              <input
                type="number"
                value={component.position.z}
                onChange={(e) => handleChange('position.z', Number(e.target.value))}
                disabled={component.constrainedDimensions?.includes('z')}
                className={`w-full border rounded p-1 ${
                  component.constrainedDimensions?.includes('z') ? disabledBg : ''
                } ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                step="1"
              />
            </div>
          </div>
        </div>
        
        {/* Component-specific properties */}
        {component.type === 'cabinet' && (
          <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
            <h3 className={`font-medium mb-2 ${theme.text}`}>Cabinet Properties</h3>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Material Thickness (mm)</label>
                <input
                  type="number"
                  value={component.materialThickness}
                  onChange={(e) => handleChange('materialThickness', Number(e.target.value))}
                  className={`w-full border rounded p-1 ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                  min="1"
                  max="50"
                  step="1"
                />
              </div>
              
              <div>
                <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Transparency: {Math.round((1 - (component.opacity || 0.8)) * 100)}%
                </label>
                <div className="flex items-center">
                  <span className={`text-xs ${theme.text}`}>Solid</span>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={1 - (component.opacity || 0.8)}
                    onChange={(e) => handleChange('opacity', 1 - Number(e.target.value))}
                    className="mx-2 flex-grow"
                  />
                  <span className={`text-xs ${theme.text}`}>Clear</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {component.type === 'shelf' && (
          <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
            <h3 className={`font-medium mb-2 ${theme.text}`}>Shelf Properties</h3>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Max Load (kg)</label>
              <input
                type="number"
                value={component.maxLoadCapacity}
                onChange={(e) => handleChange('maxLoadCapacity', Number(e.target.value))}
                className={`w-full border rounded p-1 ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
                min="1"
                max="500"
                step="1"
              />
            </div>
          </div>
        )}
        
        {component.type === 'drawer' && (
          <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
            <h3 className={`font-medium mb-2 ${theme.text}`}>Drawer Properties</h3>
            
            <div>
              <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Extension Type</label>
              <select
                value={component.extensionType}
                onChange={(e) => handleChange('extensionType', e.target.value)}
                className={`w-full border rounded p-1 ${theme.name === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
              >
                <option value="full">Full Extension</option>
                <option value="partial">Partial Extension</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Appearance */}
        <div className={`border ${borderColor} rounded p-3 ${sectionBg}`}>
          <h3 className={`font-medium mb-2 ${theme.text}`}>Appearance</h3>
          
          <div>
            <label className={`block text-sm ${theme.name === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Color</label>
            <input
              type="color"
              value={component.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full border rounded p-1 h-10"
            />
          </div>
        </div>
        
        {/* Constraints information (read-only) */}
        <div className={`border ${borderColor} rounded p-3 ${readOnlyBg}`}>
          <h3 className={`font-medium mb-2 ${theme.text}`}>Constraints</h3>
          
          <div className={`text-sm ${theme.text}`}>
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