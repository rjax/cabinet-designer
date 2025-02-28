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

function DraggableComponent({ type, name, icon }) {
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
      className={`flex items-center p-3 mb-2 rounded cursor-move border border-gray-300 hover:bg-blue-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-2xl mr-3">{icon}</span>
      <span>{name}</span>
    </div>
  );
}

function ComponentPalette({ className }) {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div>
        {componentTypes.map((component) => (
          <DraggableComponent
            key={component.id}
            type={component.id}
            name={component.name}
            icon={component.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default ComponentPalette;