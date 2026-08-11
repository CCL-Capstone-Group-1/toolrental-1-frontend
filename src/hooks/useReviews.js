// src/hooks/useReviews.js ⭐

import { useState, useCallback } from 'react';
import { reviewService } from '../services/reviewService';

export const useReviews = () => {
  // 1. Define State
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetch All Reviews for a Specific Tool
  const fetchReviewsByTool = useCallback(async (toolId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await reviewService.getReviewsByTool(toolId);
      setReviews(data);
    } catch (err) {
      setError(err.message || 'Failed to load reviews for this tool.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Submit a New Review
  const addReview = async (reviewData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newReview = await reviewService.createReview(reviewData);
      // Optimistically add the new review to the UI
      setReviews((prevReviews) => [...prevReviews, newReview]);
      return newReview;
    } catch (err) {
      setError(err.message || 'Failed to submit your review.');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Update an Existing Review
  const editReview = async (id, reviewData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedReview = await reviewService.updateReview(id, reviewData);
      setReviews((prevReviews) => 
        prevReviews.map(review => (review.id === id ? updatedReview : review))
      );
      return updatedReview;
    } catch (err) {
      setError(err.message || 'Failed to update your review.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Delete a Review
  const removeReview = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await reviewService.deleteReview(id);
      setReviews((prevReviews) => prevReviews.filter(review => review.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete the review.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Expose the Data and Methods
  return {
    reviews,
    isLoading,
    error,
    fetchReviewsByTool,
    addReview,
    editReview,
    removeReview,
  };
};