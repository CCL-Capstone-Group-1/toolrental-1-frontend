// src/data/mockLoanStore.js
// Dev-only local fallback for loans/chat messages, used while there's no
// backend running. Lets the Rental -> Cart/Account history -> Chat flow be
// clicked through end-to-end with fabricated data stored in localStorage.
// Safe to delete once a real backend is available to hit.

const LOANS_KEY = "devMockLoans";
const MESSAGES_KEY = "devMockMessages";

export function getMockLoans() {
  try {
    return JSON.parse(localStorage.getItem(LOANS_KEY)) || [];
  } catch {
    return [];
  }
}

export function addMockLoan(loan) {
  const loans = getMockLoans();
  loans.push(loan);
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  return loan;
}

export function getMockLoan(id) {
  return getMockLoans().find((loan) => String(loan.id) === String(id)) || null;
}

function getAllMockMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || {};
  } catch {
    return {};
  }
}

export function getMockMessages(loanId) {
  return getAllMockMessages()[loanId] || [];
}

export function addMockMessage(loanId, message) {
  const all = getAllMockMessages();
  const list = all[loanId] || [];
  list.push(message);
  all[loanId] = list;
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  return message;
}
