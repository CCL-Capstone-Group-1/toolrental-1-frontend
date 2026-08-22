// src/services/loanService.js 🤝

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// The backend returns loans in their raw Prisma shape — snake_case fields,
// with tool/owner details nested under `listings`/`listings.users` rather
// than flattened onto the loan itself. The UI (Cart, UserAccount, Rental's
// dev-skip mock loans) was built against a flat, camelCase shape, so we
// normalize every loan response here rather than have each screen guess at
// field names.
function normalizeLoan(loan) {
  if (!loan) return loan;

  const listing = loan.listings || {};
  const owner = listing.users || {};
  const borrower = loan.users || {};

  return {
    id: loan.id,
    toolId: loan.listing_id ?? loan.toolId ?? listing.id,
    toolName: listing.title ?? loan.toolName,
    ownerName: owner.name ?? loan.ownerName,
    imageUrl: listing.image_url ?? loan.imageUrl,
    startDate: loan.start_date ?? loan.startDate,
    endDate: loan.end_date ?? loan.endDate,
    status: loan.status,
    borrowerId: loan.borrower_id ?? loan.borrowerId,
    borrowerName: borrower.name,
    role: loan.role,
  };
}

// 2. EXPORT THE SERVICE OBJECT
// We group all loan-related API calls into 'loanService'.
export const loanService = {

  // READ: Retrieve a user's active borrowing or lending history.
  // Sends a GET request to http://localhost:3000/api/loans
  // The backend will use the attached auth token to know which user's loans to return.
  getUserLoans: () => api.get('/loans').then((loans) => (Array.isArray(loans) ? loans.map(normalizeLoan) : loans)),

  // READ: Fetch a specific loan agreement by its ID.
  getLoanById: (id) => api.get(`/loans/${id}`).then(normalizeLoan),

  // CREATE: Submit a new request to borrow a tool.
  // Accepts a 'loanData' object (e.g., toolId, startDate, endDate)
  // and sends a POST request to create the loan record in the database.
  requestLoan: (loanData) => api.post('/loans', loanData).then(normalizeLoan),

  // UPDATE: Update a loan's status (e.g., 'pending', 'approved', 'active', 'returned').
  // Requires the 'id' of the loan, and a 'statusData' object containing the new status.
  updateLoanStatus: (id, statusData) => api.put(`/loans/${id}/status`, statusData).then(normalizeLoan),

  // DELETE: Cancel a pending loan request.
  // Requires the 'id' of the loan to cancel and sends a DELETE request.
  cancelLoan: (id) => api.delete(`/loans/${id}`),
};