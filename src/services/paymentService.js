// src/services/paymentService.js 💳

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all payment-related API calls into 'paymentService'.
export const paymentService = {
  
  // CREATE/PROCESS: Execute a transaction for a completed loan agreement.
  // Accepts a 'paymentData' object (e.g., loanId, amount, paymentMethodId)
  // and sends a POST request to process the charge.
  processPayment: (paymentData) => api.post('/payments/process', paymentData),

  // READ: Fetch a user's payment and earning history.
  // Sends a GET request to http://localhost:3000/api/payments/history
  getPaymentHistory: () => api.get('/payments/history'),
  
  // READ: Fetch the details of a specific, individual transaction.
  getPaymentById: (id) => api.get(`/payments/${id}`),
};