// src/services/api.js 🚀

// 🌐 Define the base URL using Vite environment variables, falling back to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * ⚙️ Core Fetch Wrapper to handle headers, tokens, and errors globally
 */
async function fetchWrapper(endpoint, options = {}) {
  // 🔐 Retrieve the auth token (adjust this if you are using Supabase sessions directly)
  const token = localStorage.getItem('token'); 

  // 🏷️ Set up default headers, injecting the Bearer token if it exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle 204 No Content responses (often used for DELETE requests)
    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      // 🛑 Throw an error that your UI components can easily catch and display
      throw new Error(data.message || 'An unexpected error occurred during the request.');
    }

    return data;
  } catch (error) {
    console.error(`🚨 API Error at ${endpoint}:`, error.message);
    throw error;
  }
}

// 📦 Export the standard CRUD methods for clean importing across your app
export const api = {
  get: (endpoint, options) => fetchWrapper(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => fetchWrapper(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => fetchWrapper(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => fetchWrapper(endpoint, { ...options, method: 'DELETE' }),
};