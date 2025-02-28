import React from 'react';
import { useDrag } from 'react-dnd';
import { useStore } from '../store';

const componentTypes = [
  { id: 'cabinet', name: 'Cabinet', icon: '🗄️' },
  { id: 'shelf', name: 'Shelf', icon: '📚' },
  { id: 'drawer', name: 'Drawer', icon: '🗃️' },
  { id: 'hangingRod', name: 'Hanging Rod', icon: '🧵' },
  { id: 'handle', name: 'Handle', icon: '🔧' }
];

// Group components by type
const componentGroups = [
  {
    title: 'Containers',
    types: ['cabinet']
  },
  {
    title: 'Internal Components',
    types: ['shelf', 'drawer', 'hangingRod']
  },
  {
    title: 'Accessories',
    types: ['handle']
  }
];

function DraggableComponent({ type, name, icon }) {
  const { theme } = useStore();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  
  return (
    <div
      ref={drag}
      className={`flex items-center p-3 mb-2 rounded cursor-move border ${
        theme.name === 'light' ? 'border-gray-300 hover:bg-blue-50' : 'border-gray-600 hover:bg-gray-700'
      } ${isDragging ? 'opacity-50' : ''} ${theme.text}`}
    >
      <span className="text-2xl mr-3">{icon}</span>
      <span>{name}</span>
    </div>
  );
}

function ComponentPalette({ className }) {
  const { theme, selectedComponent } = useStore();
  
  // Find the selected component to show user hints
  const isCabinetSelected = selectedComponent?.type === 'cabinet';
  
  return (
    <div className={className}>
      <h2 className={`text-lg font-semibold mb-4 ${theme.text}`}>Components</h2>
      
      {/* Add guidance text based on selection */}
      {isCabinetSelected && (
        <div className={`mb-4 p-2 bg-blue-100 rounded text-sm ${theme.name === 'dark' ? 'bg-blue-900 text-blue-100' : 'text-blue-800'}`}>
          <p>Cabinet selected. Drag internal components to add them inside.</p>
        </div>
      )}
      
      {/* Group components by type */}
      {componentGroups.map(group => (
        <div key={group.title} className="mb-6">
          <h3 className={`text-sm font-medium mb-2 ${theme.text} uppercase tracking-wide`}>{group.title}</h3>
          {componentTypes
            .filter(component => group.types.includes(component.id))
            .map(component => (
              <DraggableComponent
                key={component.id}
                type={component.id}
                name={component.name}
                icon={component.icon}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export default ComponentPalette;