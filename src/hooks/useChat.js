import { useState } from 'react';
import { sendChatMessage, sendStreamingChatMessage, sendMultiModalMessage } from '../utils/chat-service';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (text, files = []) => {
    try {
      setIsLoading(true);
      
      // Add user message to the chat
      setMessages(prev => [...prev, { 
        text, 
        isBot: false,
        timestamp: new Date()
      }]);
      
      // Add an empty bot message that will be updated during streaming
      const botMessageId = Date.now().toString();
      setMessages(prev => [...prev, { 
        id: botMessageId,
        text: '', 
        isBot: true,
        isStreaming: true,
        timestamp: new Date()
      }]);
      
      setIsStreaming(true);
      
      // Handle streaming updates
      const handleStreamUpdate = (partialResponse) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: partialResponse } 
              : msg
          )
        );
      };
      
      // Use the appropriate function based on whether we have files
      let response;
      if (files && files.length > 0) {
        response = await sendMultiModalMessage(text, files, handleStreamUpdate);
      } else {
        response = await sendStreamingChatMessage(text, handleStreamUpdate);
      }
      
      // Update the final message when streaming completes
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: response, isStreaming: false } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage
  };
}