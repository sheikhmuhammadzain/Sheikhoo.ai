import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { WelcomeScreen } from "./WelcomeScreen";

export function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 relative">
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-4 min-h-full">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp || new Date()}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
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
