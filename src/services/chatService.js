// src/services/chatService.js 💬

// 1. IMPORT THE BASE API
// This imports the fetch wrapper that automatically applies your VITE_API_URL 
// and attaches the Bearer token from localStorage.
import { api } from './api';

// 2. EXPORT THE SERVICE OBJECT
// We group all chat and messaging API calls into 'chatService'.
export const chatService = {
  
  // READ: Load a user's active message threads with other users.
  // Sends a GET request to http://localhost:3000/api/chats
  getUserChats: () => api.get('/chats'),

  // READ: Load the message history for a specific conversation.
  // Sends a GET request using the specific chat ID.
  getChatMessages: (chatId) => api.get(`/chats/${chatId}/messages`),

  // CREATE: Send a new message to another user regarding a listing or loan.
  // Accepts a 'messageData' object (e.g., the text content)
  // and sends a POST request to add the message to the thread.
  sendMessage: (chatId, messageData) => api.post(`/chats/${chatId}/messages`, messageData),
};