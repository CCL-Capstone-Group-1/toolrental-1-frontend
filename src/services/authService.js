// src/services/authService.js 🔐
// 1. IMPORT THE BASE API
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
export const authService = {

  // REGISTER: Simulated for this demo environment — no real backend or
  // Supabase call. Mirrors the same pattern as the demo login below.
  // Generates a fake token/user so the rest of the app (which expects a
  // token + user object back) works exactly as if a real account was made.
  register: async (userData) => {
    const fakeUser = {
      id: Date.now(), // unique-enough for a demo session
      name: userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      homeAddress: userData.homeAddress,
      aptNumber: userData.aptNumber,
      city: userData.city,
      state: userData.state,
      avatarUrl: userData.avatarUrl || null,
    };

    return {
      token: `demo-token-${fakeUser.id}`,
      user: fakeUser,
    };
  },

  // LOGIN: Authenticate an existing user.
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
  getProfile: () => api.get('/users/profile'),

  // UPDATE PROFILE: Simulated for this demo environment — echoes back
  // whatever was submitted so the caller can merge it into local state.
  updateProfile: async (profileData) => {
    return profileData;
  },
};