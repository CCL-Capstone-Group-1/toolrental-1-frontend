// src/services/loanService.js 🤝

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all loan-related API calls into 'loanService'.
export const loanService = {
  
  // READ: Retrieve a user's active borrowing or lending history.
  // Sends a GET request to http://localhost:3000/api/loans
  // The backend will use the attached auth token to know which user's loans to return.
  getUserLoans: () => api.get('/loans'),

  // READ: Fetch a specific loan agreement by its ID.
  getLoanById: (id) => api.get(`/loans/${id}`),

  // CREATE: Submit a new request to borrow a tool.
  // Accepts a 'loanData' object (e.g., toolId, startDate, endDate)
  // and sends a POST request to create the loan record in the database.
  requestLoan: (loanData) => api.post('/loans', loanData),

  // UPDATE: Update a loan's status (e.g., 'pending', 'approved', 'active', 'returned').
  // Requires the 'id' of the loan, and a 'statusData' object containing the new status.
  updateLoanStatus: (id, statusData) => api.put(`/loans/${id}/status`, statusData),
  
  // DELETE: Cancel a pending loan request.
  // Requires the 'id' of the loan to cancel and sends a DELETE request.
  cancelLoan: (id) => api.delete(`/loans/${id}`),
};