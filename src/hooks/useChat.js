import { useState, useRef, useCallback } from 'react';
// Assuming sendChatMessage is for non-streaming, which isn't used in this specific sendMessage flow
// import { sendChatMessage, sendStreamingChatMessage, sendMultiModalMessage } from '../utils/chat-service';
import { sendStreamingChatMessage, sendMultiModalMessage } from '../utils/chat-service';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Indicates an API call is in progress
  const [isStreaming, setIsStreaming] = useState(false); // Indicates a bot message is actively streaming
  
  // Ref to track the last time the streaming UI was updated.
  // Used by the throttler to ensure smooth updates around 60fps.
  const lastUpdateTimeRef = useRef(0);
  const animationFrameIdRef = useRef(null); // To store requestAnimationFrame ID

  /**
   * Creates a throttled function to handle streaming updates for a specific bot message.
   * This ensures that UI updates for streaming text don't overwhelm the browser,
   * leading to a smoother animation of text appearing.
   */
  const createThrottledStreamHandler = useCallback((botMessageId) => {
    let currentTextBuffer = ''; // Holds the most up-to-date full text for this specific message
    let updateScheduled = false; // Flag to prevent scheduling multiple animation frames

    const flushUpdate = () => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: currentTextBuffer } // Update only the target bot message
            : msg
        )
      );
      updateScheduled = false;
      // lastUpdateTimeRef.current = performance.now(); // performance.now() can be recorded here if needed for other logic
    };

    // This function will be called by the chat service with chunks of text
    // We assume `streamedTextChunk` is the *cumulative* text so far for the message.
    return (streamedTextChunk) => {
      currentTextBuffer = streamedTextChunk; // Update the buffer with the latest full text

      if (!updateScheduled) {
        updateScheduled = true;
        // Cancel any previously scheduled frame to avoid redundant updates
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        animationFrameIdRef.current = requestAnimationFrame(flushUpdate);
      }
    };
  }, [setMessages]); // setMessages is stable

  const sendMessage = async (text, files = []) => {
    // Generate unique IDs for the user message and the upcoming bot message.
    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const botMessageId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // --- Optimistic UI Update Part 1: Add messages immediately ---
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: userMessageId,
        text,
        files: files && files.length > 0 ? files.map(f => ({ name: f.name, type: f.type })) : undefined, 
        isBot: false,
        timestamp: new Date().toISOString() // Use ISO string for consistent timestamp format
      },
      {
        id: botMessageId,
        text: '', 
        isBot: true,
        isStreaming: true,
        timestamp: new Date().toISOString()
      }
    ]);
    
    setIsLoading(true);
    setIsStreaming(true);
    
    // --- Optimistic UI Update Part 2: Ensure React renders before blocking call ---
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    try {
      const handleStreamUpdate = createThrottledStreamHandler(botMessageId);
      
      let fullResponseText;
      if (files && files.length > 0) {
        fullResponseText = await sendMultiModalMessage(text, files, handleStreamUpdate);
      } else {
        fullResponseText = await sendStreamingChatMessage(text, handleStreamUpdate);
      }
      
      // --- Final Update: Once streaming is complete ---
      // Ensure the final update uses the text from the awaited response
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: fullResponseText, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages =>
        prevMessages.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: 'Sorry, an error occurred. Please try again.', isBot: true, isStreaming: false, isError: true, timestamp: new Date().toISOString() }
            : msg
        ).filter(msg => !(msg.id === botMessageId && msg.text === '' && !error)) 
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      if (animationFrameIdRef.current) { // Clean up animation frame on completion/error
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }
  };

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage
  };
}