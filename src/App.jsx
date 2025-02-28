import React, { useState } from 'react';
import ComponentPalette from './components/ComponentPalette';
import DesignCanvas from './components/DesignCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import { useStore } from './store';

function App() {
  const { selectedComponent } = useStore();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Cabinet Designer</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette className="w-64 bg-white shadow-md p-4 overflow-y-auto" />
        
        <DesignCanvas className="flex-1 bg-gray-200 overflow-hidden" />
        
        <PropertiesPanel 
          className="w-80 bg-white shadow-md p-4 overflow-y-auto" 
          component={selectedComponent} 
        />
      </div>
    </div>
  );
}

export default App;