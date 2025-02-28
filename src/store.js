import { create } from 'zustand';
import { generateId } from './utils';

export const useStore = create((set, get) => ({
  components: [],
  selectedComponentId: null,
  selectedComponent: null,
  
  // Add a new component to the design
  addComponent: (componentType, position) => {
    const newComponent = createComponent(componentType, position);
    
    // Find potential parent for the component
    const state = get();
    let parentComponent = null;
    
    if (componentType !== 'cabinet') {
      // Find a cabinet that contains this position
      parentComponent = state.components.find(comp => {
        if (comp.type !== 'cabinet') return false;
        
        return (
          position.x >= comp.position.x &&
          position.x <= comp.position.x + comp.dimensions.width &&
          position.y >= comp.position.y &&
          position.y <= comp.position.y + comp.dimensions.height
        );
      });
      
      if (parentComponent) {
        newComponent.constrainedBy = parentComponent.id;
      }
    }
    
    set(state => {
      const updatedComponents = [...state.components, newComponent];
      const componentsWithConstraints = applyConstraints(updatedComponents);
      
      // Find the newly added component after constraints are applied
      const addedComponent = componentsWithConstraints.find(c => c.id === newComponent.id);
      
      return {
        components: componentsWithConstraints,
        selectedComponentId: addedComponent.id,
        selectedComponent: addedComponent
      };
    });
    
    return newComponent;
  },
  
  // Update a component's properties
  updateComponent: (id, updates) => {
    set(state => {
      const updatedComponents = state.components.map(component => 
        component.id === id ? { ...component, ...updates } : component
      );
      
      // Apply constraints after updates
      const updatedComponentsWithConstraints = applyConstraints(updatedComponents);
      
      const updatedComponent = updatedComponentsWithConstraints.find(c => c.id === id);
      
      return {
        components: updatedComponentsWithConstraints,
        selectedComponent: updatedComponent
      };
    });
  },
  
  // Select a component
  selectComponent: (id) => {
    set(state => {
      const selectedComponent = state.components.find(c => c.id === id) || null;
      return {
        selectedComponentId: id,
        selectedComponent
      };
    });
  },
  
  // Remove a component
  removeComponent: (id) => {
    set(state => {
      // First, find any components that are constrained by this one
      const childComponents = state.components.filter(c => c.constrainedBy === id);
      
      // Remove the component and its children
      const componentsToRemove = [id, ...childComponents.map(c => c.id)];
      const filteredComponents = state.components.filter(c => !componentsToRemove.includes(c.id));
      
      return {
        components: filteredComponents,
        selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        selectedComponent: state.selectedComponentId === id ? null : state.selectedComponent
      };
    });
  }
}));

// Create a new component based on type
function createComponent(type, position) {
  const baseComponent = {
    id: generateId(),
    type,
    position: { ...position },
    constraintType: 'None',
    constrainedDimensions: [],
    constrainedBy: null
  };
  
  switch (type) {
    case 'cabinet':
      return {
        ...baseComponent,
        dimensions: { width: 600, height: 800, depth: 600 },
        materialThickness: 18,
        color: '#E8D0B0'
      };
    case 'shelf':
      return {
        ...baseComponent,
        dimensions: { width: 564, height: 18, depth: 580 },
        constraintType: 'Contained',
        constrainedDimensions: ['width'],
        maxLoadCapacity: 50,
        color: '#D4B483'
      };
    case 'drawer':
      return {
        ...baseComponent,
        dimensions: { width: 564, height: 150, depth: 580 },
        constraintType: 'Contained',
        constrainedDimensions: ['width'],
        extensionType: 'full',
        color: '#C1A87D'
      };
    case 'hangingRod':
      return {
        ...baseComponent,
        dimensions: { width: 564, height: 10, depth: 25 },
        constraintType: 'Contained',
        constrainedDimensions: ['width', 'x'],
        color: '#A0A0A0'
      };
    case 'handle':
      return {
        ...baseComponent,
        dimensions: { width: 150, height: 20, depth: 30 },
        constraintType: 'Attached',
        constrainedDimensions: [],
        color: '#808080'
      };
    default:
      return baseComponent;
  }
}

// Apply constraints to all components
function applyConstraints(components) {
  return components.map(component => {
    if (component.constraintType === 'None' || !component.constrainedBy) {
      return component;
    }
    
    // Find parent component
    const parent = components.find(c => c.id === component.constrainedBy);
    if (!parent) return component;
    
    let updatedComponent = { ...component };
    
    // Apply constraints based on type
    if (component.constraintType === 'Contained') {
      // Calculate internal dimensions of parent
      const internalWidth = parent.dimensions.width - (2 * parent.materialThickness);
      
      // Apply width constraint if needed
      if (component.constrainedDimensions.includes('width')) {
        updatedComponent.dimensions.width = internalWidth;
      }
      
      // Ensure component stays within parent boundaries
      if (component.constrainedDimensions.includes('x')) {
        updatedComponent.position.x = parent.position.x + parent.materialThickness;
      } else {
        // Constrain X position to be within parent
        const minX = parent.position.x + parent.materialThickness;
        const maxX = parent.position.x + parent.dimensions.width - component.dimensions.width - parent.materialThickness;
        updatedComponent.position.x = Math.max(minX, Math.min(maxX, component.position.x));
      }
      
      // Constrain Y position to be within parent
      const minY = parent.position.y + parent.materialThickness;
      const maxY = parent.position.y + parent.dimensions.height - component.dimensions.height - parent.materialThickness;
      updatedComponent.position.y = Math.max(minY, Math.min(maxY, component.position.y));
    }
    
    if (component.constraintType === 'Attached') {
      // For attached elements like handles, ensure they're positioned at the edge of the parent
      // For simplicity, we'll attach them to the right edge
      updatedComponent.position.x = parent.position.x + parent.dimensions.width - component.dimensions.width / 2;
      
      // Constrain Y position to be within parent
      const minY = parent.position.y;
      const maxY = parent.position.y + parent.dimensions.height - component.dimensions.height;
      updatedComponent.position.y = Math.max(minY, Math.min(maxY, component.position.y));
    }
    
    return updatedComponent;
  });
}