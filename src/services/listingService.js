import { api } from './api';
import { mockListings } from '../data/mockListings';
import { addMockListing, getMockListings } from '../data/mockListingStore';

export const listingService = {

  getAllListings: async () => {
    // Local listings are listed first so that, once a title-based merge
    // dedupes this against a same-titled real API row, the fuller local
    // copy (which has the fields the backend doesn't persist yet, like
    // category/imageUrl - see createListing below) wins instead of the
    // sparser real one.
    const localListings = getMockListings();
    let realArray = [];
    try {
      const realListings = await api.get('/listings');
      realArray = Array.isArray(realListings) ? realListings : realListings?.data || [];
    } catch (err) {
      console.warn('Real listings API failed, using mock catalog only:', err.message);
    }
    return [...localListings, ...realArray, ...mockListings];
  },

  getListingById: async (id) => {
    try {
      return await api.get(`/listings/${id}`);
    } catch (err) {
      const localListings = getMockListings();
      return (
        localListings.find((listing) => String(listing.id) === String(id)) ||
        mockListings.find((listing) => String(listing.id) === String(id)) ||
        null
      );
    }
  },

  getListingBookings: async (_id) => {
    return [];
  },

  createListing: async (listingData) => {
    // The real backend doesn't persist every field yet (category, imageUrl -
    // see the Catalog merge comments), so a listing that round-trips through
    // it loses those on the next reload. Always keep a full local copy as
    // the source of truth for this listing, falling back to a purely local
    // one if the backend is unreachable.
    let created = null;
    try {
      created = await api.post('/listings', listingData);
    } catch (err) {
      console.warn('Create listing API call failed, saving locally only:', err.message);
    }
    // Only let the backend's response override a field when it actually
    // returned a value for it (e.g. its generated id) - a field it left
    // null/missing (category, imageUrl) should keep what was submitted,
    // not silently blank it out.
    const definedCreated = Object.fromEntries(
      Object.entries(created || {}).filter(([, value]) => value !== null && value !== undefined && value !== '')
    );
    return addMockListing({ ...listingData, ...definedCreated });
  },

  updateListing: async (id, listingData) => {
    return api.put(`/listings/${id}`, listingData);
  },

  deleteListing: async (id) => {
    return api.delete(`/listings/${id}`);
  },
};