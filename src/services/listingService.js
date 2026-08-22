import { api } from './api';
import { mockListings } from '../data/mockListings';
import { getMockListings } from '../data/mockListingStore';

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
    return [...realArray, ...localListings, ...mockListings];
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
    return api.post('/listings', listingData);
  },

  updateListing: async (id, listingData) => {
    return api.put(`/listings/${id}`, listingData);
  },

  deleteListing: async (id) => {
    return api.delete(`/listings/${id}`);
  },
};