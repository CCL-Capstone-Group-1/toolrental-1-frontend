// src/hooks/useLoans.js 🤝

import { useState, useCallback } from 'react';
import { loanService } from '../services/loanService';

export const useLoans = () => {
  // 1. Define State
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetch the user's active borrowing or lending history
  const fetchUserLoans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loanService.getUserLoans();
      setLoans(data);
    } catch (err) {
      setError(err.message || 'Failed to load your loan history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Submit a new request to borrow a tool
  const requestNewLoan = async (loanData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newLoan = await loanService.requestLoan(loanData);
      // Optimistically add the new loan to the UI state
      setLoans((prevLoans) => [...prevLoans, newLoan]);
      return newLoan;
    } catch (err) {
      setError(err.message || 'Failed to submit your loan request.');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Update a loan's status (e.g., 'pending', 'approved', 'active', 'returned')
  const updateStatus = async (id, statusData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedLoan = await loanService.updateLoanStatus(id, statusData);
      // Find the old loan in the state and replace it with the updated one
      setLoans((prevLoans) => 
        prevLoans.map(loan => (loan.id === id ? updatedLoan : loan))
      );
      return updatedLoan;
    } catch (err) {
      setError(err.message || 'Failed to update the loan status.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Cancel a pending loan request
  const cancelUserLoan = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await loanService.cancelLoan(id);
      // Filter the canceled loan out of the current state
      setLoans((prevLoans) => prevLoans.filter(loan => loan.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to cancel the loan.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Expose the Data and Methods
  return {
    loans,
    isLoading,
    error,
    fetchUserLoans,
    requestNewLoan,
    updateStatus,
    cancelUserLoan,
  };
};