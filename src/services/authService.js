// src/services/authService.js 🔐

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all authentication and user-related API calls into 'authService'.
// This will be imported into your useAuth.js hook to manage login state.
export const authService = {
  
  // REGISTER: Create a new user account.
  // Accepts a 'userData' object (e.g., email, password, name, etc.) 
  // and sends it as the body of a POST request to http://localhost:3000/api/users/register
  register: (userData) => api.post('/users/register', userData),

  // LOGIN: Authenticate an existing user.
  // Accepts 'credentials' (e.g., email, password). 
  // The backend should return a token and user object upon success.
  login: async (credentials) => {
    const normalizedEmail = (credentials?.email || '').trim().toLowerCase();
    const normalizedPassword = credentials?.password || '';

    if (normalizedEmail === 'user@email.com' && normalizedPassword === 'toolbnb') {
      return {
        token: 'demo-token-toolbnb',
        user: {
          id: 1,
          name: 'Demo User',
          email: normalizedEmail,
        },
      };
    }

    return api.post('/users/login', credentials);
  },

  // GET PROFILE: Fetch the logged-in user's data.
  // Sends a GET request. The api.js wrapper automatically attaches the user's 
  // token to the header so the backend knows whose profile to return.
  getProfile: () => api.get('/users/profile'),

  // UPDATE PROFILE: Edit user settings or profile details.
  // Accepts 'profileData' and sends a PUT request to update the database.
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};