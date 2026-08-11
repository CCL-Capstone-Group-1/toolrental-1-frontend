// src/hooks/usePayments.js 💳

import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = () => {
  // 1. Define State
  // 'payments' will hold the user's earning/payment history
  // 'currentPayment' can hold details for a specific receipt view
  const [payments, setPayments] = useState([]);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Process a New Transaction
  const processNewPayment = async (paymentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await paymentService.processPayment(paymentData);
      // Optimistically add the new transaction to the top of the history list
      setPayments((prevPayments) => [result, ...prevPayments]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to process the payment. Please check your details.');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fetch Payment and Earning History
  const fetchPaymentHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await paymentService.getPaymentHistory();
      setPayments(data);
    } catch (err) {
      setError(err.message || 'Failed to load your transaction history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Fetch a Specific Payment Receipt by ID
  const fetchPaymentById = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await paymentService.getPaymentById(id);
      setCurrentPayment(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load the payment details.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Expose the Data and Methods
  return {
    payments,
    currentPayment,
    isLoading,
    error,
    processNewPayment,
    fetchPaymentHistory,
    fetchPaymentById,
  };
};