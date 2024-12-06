import { useState } from 'react';
import { sendChatMessage } from '../utils/chat-service';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { 
        text, 
        isBot: false,
        timestamp: new Date()
      }]);
      
      const response = await sendChatMessage(text);
      
      setMessages(prev => [...prev, { 
        text: response, 
        isBot: true,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}