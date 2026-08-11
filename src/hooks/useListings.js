// src/hooks/useListings.js 📋

import { useState, useCallback } from 'react';
import { listingService } from '../services/listingService';

export const useListings = () => {
  // 1. Define State
  // We keep track of the data, the loading status, and any errors.
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetch All Listings
  // useCallback prevents this function from being recreated on every render
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors before starting
    
    try {
      const data = await listingService.getAllListings();
      setListings(data);
    } catch (err) {
      setError(err.message || 'Failed to load listings. Please try again.');
    } finally {
      setIsLoading(false); // Turn off the loading state whether it succeeds or fails
    }
  }, []);

  // 3. Create a New Listing
  const addListing = async (listingData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newListing = await listingService.createListing(listingData);
      // Optimistically update the state so the UI feels fast
      setListings((prevListings) => [...prevListings, newListing]);
      return newListing;
    } catch (err) {
      setError(err.message || 'Failed to create your listing.');
      throw err; // Throw it so the component can also catch it (e.g., to show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Return the state and functions
  // Any component that imports this hook will have access to these exact values
  return {
    listings,
    isLoading,
    error,
    fetchListings,
    addListing,
  };
};