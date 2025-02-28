// Generate a unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Calculate internal dimensions of a container
export function getInternalDimensions(component) {
  if (!component || !component.materialThickness) {
    return { width: 0, height: 0, depth: 0 };
  }
  
  const thickness = component.materialThickness;
  return {
    width: component.dimensions.width - (2 * thickness),
    height: component.dimensions.height - (2 * thickness),
    depth: component.dimensions.depth - (2 * thickness)
  };
}

// Check if a point is inside a component
export function isPointInComponent(point, component) {
  const { x, y, z } = component.position;
  const { width, height, depth } = component.dimensions;
  
  return (
    point.x >= x && point.x <= x + width &&
    point.y >= y && point.y <= y + height &&
    point.z >= z && point.z <= z + depth
  );
}

// Find potential parent for a component based on position
export function findPotentialParent(components, position, componentType) {
  // Only certain types need parents
  if (componentType === 'cabinet') {
    return null;
  }
  
  // Find containers that could be parents
  return components
    .filter(c => c.type === 'cabinet')
    .find(container => isPointInComponent(position, container));
}

// Convert 3D coordinates to 2D screen coordinates
export function worldToScreen(position, camera, canvas) {
  // This is a simplified version - in a real app you'd use Three.js methods
  const vector = {
    x: (position.x / canvas.width) * 2 - 1,
    y: -(position.y / canvas.height) * 2 + 1
  };
  
  return {
    x: (vector.x + 1) * canvas.width / 2,
    y: (1 - vector.y) * canvas.height / 2
  };
}