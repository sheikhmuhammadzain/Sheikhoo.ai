import React, { useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { WelcomeScreen } from "./WelcomeScreen";

// Memoize the ChatMessage component to prevent unnecessary re-renders
const MemoizedChatMessage = memo(ChatMessage, (prevProps, nextProps) => {
  // Only re-render when these props change
  return (
    prevProps.message === nextProps.message && 
    prevProps.isStreaming === nextProps.isStreaming
  );
});

export function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use behavior: "instant" for immediate scrolling on new messages
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  // Scroll to bottom immediately when new messages arrive
  useEffect(() => {
    // Skip animation frame for faster response
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 relative max-h-[80vh]">
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-4 min-h-full">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0.8, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  layout="position"
                >
                  <MemoizedChatMessage
                    message={message.text}
                    isBot={message.isBot}
                    isStreaming={message.isStreaming}
                    timestamp={message.timestamp || new Date()}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && !messages.some(msg => msg.isStreaming) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-4 space-y-3"
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-sm text-zinc-400">
                  Model is Deeply Reasoning...
                </p>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
