// src/services/authService.js 🔐
// Auth is handled entirely by our own backend (bcrypt + JWT) — no
// Supabase Auth involved.
import { api } from './api';

export const authService = {

  // REGISTER: Create a new user account.
  register: (userData) => api.post('/users/register', userData),

  // LOGIN: Authenticate an existing user.
  login: (credentials) => api.post('/users/login', credentials),

  // GET PROFILE: Fetch the logged-in user's data.
  getProfile: () => api.get('/users/profile'),

  // UPDATE PROFILE: Edit user settings or profile details.
  updateProfile: (id, profileData) => api.put(`/users/${id}`, profileData),
};