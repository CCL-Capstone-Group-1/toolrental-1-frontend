// src/services/listingService.js 📋
// Reads (browsing) pull from BOTH the real database and anything created
// locally in this demo session, always layered on top of the static demo
// catalog (mockListings.js) so the page never looks empty or thin —
// regardless of what the real backend returns. Writes (create/update/
// delete) stay fully simulated client-side, since those need an
// authenticated user and this demo's auth is simulated (see
// authService.js) — a fake token can't be verified by the real backend.
import { api } from './api';
import { mockListings } from '../data/mockListings';
import {
  getMockListings,
  getMockListingById,
  addMockListing,
  updateMockListing,
  deleteMockListing,
} from '../data/mockListingStore';

export const listingService = {

  // READ: Always show the static mock catalog, plus whatever the real API
  // and local demo storage add on top — so the catalog never looks empty
  // or thin, regardless of what the deployed backend returns.
  getAllListings: async () => {
    const localListings = getMockListings();
    let realArray = [];
    try {
      const realListings = await api.get('/listings');
      realArray = Array.isArray(realListings) ? realListings : realListings?.data || [];
    } catch (err) {
      console.warn('Real listings API failed, using mock catalog only:', err.message);
    }
    return [...mockListings, ...realArray, ...localListings];
  },

  // READ: Check local listings first (covers newly-created demo tools),
  // then the real database, then the static mock catalog.
  getListingById: async (id) => {
    const local = getMockListingById(id);
    if (local) return local;
    try {
      return await api.get(`/listings/${id}`);
    } catch (err) {
      return mockListings.find((listing) => String(listing.id) === String(id)) || null;
    }
  },

  // READ: Booking date ranges — no real bookings data yet, return empty.
  getListingBookings: async (_id) => {
    return [];
  },

  // CREATE: Post a new tool as available for rent (simulated locally).
  createListing: async (listingData) => {
    return addMockListing(listingData);
  },

  // UPDATE: Edit an existing listing (simulated locally).
  updateListing: async (id, listingData) => {
    return updateMockListing(id, listingData);
  },

  // DELETE: Remove a listing (simulated locally).
  deleteListing: async (id) => {
    deleteMockListing(id);
    return { success: true };
  },
};