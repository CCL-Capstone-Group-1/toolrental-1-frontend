// src/services/listingService.js 📋
// Simulated for this demo environment — listings are stored locally
// (see mockListingStore.js) rather than hitting the real backend, since
// auth is also simulated client-side and can't produce a token the
// backend can verify. Mirrors the same approach as authService.js.
import {
  getMockListings,
  getMockListingById,
  addMockListing,
  updateMockListing,
  deleteMockListing,
} from '../data/mockListingStore';

export const listingService = {

  // READ: Retrieve all listings.
  getAllListings: async () => {
    return getMockListings();
  },

  // READ: Fetch a specific listing by its ID.
  getListingById: async (id) => {
    return getMockListingById(id);
  },

  // READ: Booking date ranges — no real bookings data yet, return empty.
  getListingBookings: async (_id) => {
    return [];
  },

  // CREATE: Post a new tool as available for rent.
  createListing: async (listingData) => {
    return addMockListing(listingData);
  },

  // UPDATE: Edit an existing listing (e.g. deactivate/reactivate, edit fields).
  updateListing: async (id, listingData) => {
    return updateMockListing(id, listingData);
  },

  // DELETE: Remove a listing.
  deleteListing: async (id) => {
    deleteMockListing(id);
    return { success: true };
  },
};