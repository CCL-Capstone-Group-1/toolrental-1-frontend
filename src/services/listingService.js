// src/services/toolService.js 🧰

// 1. IMPORT THE BASE API
// We import the custom 'api' wrapper we created in api.js. 
// This ensures all these requests automatically use the correct VITE_API_URL and attach authorization tokens.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all tool-related API calls into a single 'toolService' object.
// This makes it easy to import into your React components or custom hooks (e.g., `toolService.getAllTools()`).
export const toolService = {
  
  // READ: Fetch the entire inventory of tools.
  // Sends a GET request to http://localhost:3000/api/tools
  getAllTools: () => api.get('/tools'),

  // READ: Fetch a single, specific tool by its unique ID.
  // Example: toolService.getToolById(5) sends a GET request to /tools/5
  getToolById: (id) => api.get(`/tools/${id}`),

  // CREATE: Add a new tool to the database.
  // Accepts a 'toolData' object (like name, price, description) and sends it in the body of a POST request.
  createTool: (toolData) => api.post('/tools', toolData),

  // UPDATE: Edit an existing tool's details.
  // Requires the 'id' of the tool to update, and the new 'toolData' to replace the old data. Uses a PUT request.
  updateTool: (id, toolData) => api.put(`/tools/${id}`, toolData),

  // DELETE: Remove a tool from the inventory permanently.
  // Requires the 'id' of the tool to delete and sends a DELETE request to that specific route.
  deleteTool: (id) => api.delete(`/tools/${id}`),
};