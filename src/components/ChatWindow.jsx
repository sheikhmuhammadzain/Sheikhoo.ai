import React, { useEffect, useRef } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { motion, useAnimation } from 'framer-motion';
import { ChatMessage } from './ChatMessage';

export function ChatWindow({ messages, isLoading }) {
  const controls = useAnimation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
    controls.start({ opacity: 1, y: 0 });
  }, [messages, isLoading]);

  return (
    <ScrollArea.Root className="flex-1 overflow-hidden bg-black">
      <ScrollArea.Viewport className="h-full w-full" ref={scrollRef}>
        <motion.div 
          className="max-w-4xl mx-auto px-6 py-4 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800/50"
            >
              <h2 className="text-lg font-medium text-white mb-2">Welcome to Sheikhoo.ai! 👋</h2>
              <p className="text-sm text-zinc-400">Start your conversation below.</p>
            </motion.div>
          )}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChatMessage
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp || new Date()}
              />
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-zinc-900/50 rounded-lg ml-4 max-w-[60%] border border-zinc-800/50"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-zinc-600 rounded-full"
                    animate={{
                      y: ['0%', '-50%', '0%'],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-400">Thinking...</span>
            </motion.div>
          )}
        </motion.div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-900/10 transition-colors duration-200 ease-in-out hover:bg-zinc-900/20 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-800/50 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}