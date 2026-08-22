// src/services/listingService.js 📋

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all listing-related API calls into 'listingService'.
// This will be imported into your custom hooks (like useListings.js) or directly into components.
export const listingService = {
  
  // READ: Retrieve all active tool rental listings.
  // Sends a GET request to http://localhost:3000/api/listings
  getAllListings: () => api.get('/listings'),

  // READ: Fetch a specific listing by its ID.
  getListingById: (id) => api.get(`/listings/${id}`),

  // READ: Fetch the date ranges a listing is already booked for.
  getListingBookings: (id) => api.get(`/listings/${id}/bookings`),

  // CREATE: Post a new tool as available for rent.
  // Accepts a 'listingData' object (e.g., tool ID, price per day, available dates)
  // and sends a POST request to create the listing in the database.
  createListing: (listingData) => api.post('/listings', listingData),

  // UPDATE: Edit the parameters of a specific listing.
  // Requires the 'id' of the listing to update, and the new 'listingData' to replace the old data.
  updateListing: (id, listingData) => api.put(`/listings/${id}`, listingData),

  // DELETE: Remove a listing from the marketplace.
  // Requires the 'id' of the listing to delete and sends a DELETE request.
  deleteListing: (id) => api.delete(`/listings/${id}`),
};