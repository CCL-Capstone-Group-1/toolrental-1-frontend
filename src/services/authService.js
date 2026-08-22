// src/services/authService.js 🔐
// Auth itself is handled by Supabase directly (client-side, using the
// public anon key — safe to expose in frontend code). This service also
// calls the backend once, right after signup/login, to create or fetch
// the matching profile row in our own Prisma `users` table.
import { api } from './api';
import { supabase } from './supabaseClient';

export const authService = {

  // REGISTER: Creates the real account in Supabase Auth, then creates the
  // matching Prisma profile row on our own backend.
  register: async (userData) => {
    const { email, password, name, avatarUrl } = userData;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    if (!data.session) {
      // This means Supabase's "Confirm email" setting is turned on, so no
      // active session comes back until the user clicks a confirmation
      // link in their inbox. For this app, that setting should be off.
      throw new Error(
        'Account created, but email confirmation is required before you can sign in. Check your Supabase Auth settings.'
      );
    }

    const token = data.session.access_token;

    // Create the Prisma profile row, authenticated with the token we just
    // got back from Supabase.
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, image_url: avatarUrl }),
    });
    const user = await response.json();
    if (!response.ok) {
      throw new Error(user.message || 'Account created, but failed to set up your profile.');
    }

    return { token, user };
  },

  // LOGIN: Authenticates with Supabase directly, then fetches the matching
  // Prisma profile row from our backend.
  login: async (credentials) => {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error('Invalid email or password.');
    }

    const token = data.session.access_token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await response.json();
    if (!response.ok) {
      throw new Error(user.message || 'Logged in, but no profile was found for this account.');
    }

    return { token, user };
  },

  // GET PROFILE: Fetch the logged-in user's data.
  getProfile: () => api.get('/users/profile'),

  // UPDATE PROFILE: Edit user settings or profile details.
  updateProfile: (id, profileData) => api.put(`/users/${id}`, profileData),
};