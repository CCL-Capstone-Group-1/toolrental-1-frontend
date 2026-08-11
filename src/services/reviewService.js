// src/services/reviewService.js ⭐

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all review-related API calls into 'reviewService'.
export const reviewService = {
  
  // READ: Fetch all reviews and ratings for a specific tool.
  // Sends a GET request to http://localhost:3000/api/reviews/:toolId
  getReviewsByTool: (toolId) => api.get(`/reviews/${toolId}`),

  // CREATE: Submit a new rating and review after a loan is completed.
  // Accepts a 'reviewData' object (e.g., toolId, rating, comment)
  // and sends a POST request to add the review to the database.
  createReview: (reviewData) => api.post('/reviews', reviewData),

  // UPDATE: Edit an existing review (if users are allowed to change their feedback).
  // Requires the 'id' of the review to update and the new 'reviewData'.
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),

  // DELETE: Remove a review from the platform.
  // Requires the 'id' of the review to delete and sends a DELETE request.
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};