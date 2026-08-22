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

  getListingById: async (id) => {
    const local = getMockListingById(id);
    if (local) return local;
    try {
      return await api.get(`/listings/${id}`);
    } catch (err) {
      return mockListings.find((listing) => String(listing.id) === String(id)) || null;
    }
  },

  getListingBookings: async (_id) => {
    return [];
  },

  createListing: async (listingData) => {
    return addMockListing(listingData);
  },

  updateListing: async (id, listingData) => {
    return updateMockListing(id, listingData);
  },

  deleteListing: async (id) => {
    deleteMockListing(id);
    return { success: true };
  },
};