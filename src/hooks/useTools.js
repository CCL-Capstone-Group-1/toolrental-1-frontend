// src/hooks/useTools.js 🧰

import { useState, useCallback } from 'react';
import { toolService } from '../services/toolService';

export const useTools = () => {
  // 1. Define State
  // We keep track of the tool inventory, loading status, and any network errors.
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetch All Tools
  // useCallback caches this function so it doesn't cause unnecessary re-renders in your components.
  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await toolService.getAllTools();
      setTools(data);
    } catch (err) {
      setError(err.message || 'Failed to load the tool inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Add a New Tool
  const addTool = async (toolData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTool = await toolService.createTool(toolData);
      // Optimistically add the new tool to the UI state immediately
      setTools((prevTools) => [...prevTools, newTool]);
      return newTool;
    } catch (err) {
      setError(err.message || 'Failed to add the tool.');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Update an Existing Tool
  const editTool = async (id, toolData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTool = await toolService.updateTool(id, toolData);
      // Find the old tool in the state and replace it with the updated one
      setTools((prevTools) => 
        prevTools.map(tool => (tool.id === id ? updatedTool : tool))
      );
      return updatedTool;
    } catch (err) {
      setError(err.message || 'Failed to update the tool.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Delete a Tool
  const removeTool = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await toolService.deleteTool(id);
      // Filter the deleted tool out of the current state
      setTools((prevTools) => prevTools.filter(tool => tool.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete the tool.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Expose the Data and Methods
  return {
    tools,
    isLoading,
    error,
    fetchTools,
    addTool,
    editTool,
    removeTool,
  };
};