import React, { useState } from 'react';
import ComponentPalette from './components/ComponentPalette';
import DesignCanvas from './components/DesignCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import { useStore } from './store';

function App() {
  const { selectedComponent, theme, toggleTheme } = useStore();

  return (
    <div className={`flex flex-col h-screen ${theme.background}`}>
      <header className={`${theme.header} ${theme.headerText} p-4 shadow-md flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Cabinet Designer</h1>
        <button 
          onClick={toggleTheme}
          className="px-3 py-2 rounded-md bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
        >
          {theme.name === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette className={`w-64 ${theme.componentBg} shadow-md p-4 overflow-y-auto`} />
        
        <DesignCanvas className="flex-1 overflow-hidden" />
        
        <PropertiesPanel 
          className={`w-80 ${theme.componentBg} shadow-md p-4 overflow-y-auto`}
          component={selectedComponent} 
        />
      </div>
    </div>
  );
}

export default App;