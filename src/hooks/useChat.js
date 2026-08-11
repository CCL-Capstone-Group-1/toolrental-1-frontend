// src/hooks/useChat.js 💬

import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

export const useChat = () => {
  // 1. Define State
  // 'chats' holds the list of all active message threads
  // 'currentMessages' holds the history for whichever chat thread is currently open
  const [chats, setChats] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Fetch the user's active message threads
  const fetchUserChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await chatService.getUserChats();
      setChats(data);
    } catch (err) {
      setError(err.message || 'Failed to load your messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Load the message history for a specific conversation
  const fetchChatMessages = async (chatId) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getChatMessages(chatId);
      setCurrentMessages(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load the conversation.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Send a new message to another user
  const sendNewMessage = async (chatId, messageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newMessage = await chatService.sendMessage(chatId, messageData);
      // Optimistically add the new message to the currently open thread
      setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err.message || 'Failed to send your message.');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Expose the Data and Methods
  return {
    chats,
    currentMessages,
    isLoading,
    error,
    fetchUserChats,
    fetchChatMessages,
    sendNewMessage,
  };
};