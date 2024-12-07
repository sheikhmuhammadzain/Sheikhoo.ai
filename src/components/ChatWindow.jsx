import React, { useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { motion, useAnimation } from "framer-motion";
import { ChatMessage } from "./ChatMessage";

const WelcomeScreen = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.3,
      type: "spring",
      stiffness: 100,
      damping: 20,
    }}
    className="relative text-center py-12 backdrop-blur-xl bg-gradient-to-b from-zinc-900/30 to-black/30 rounded-2xl border border-zinc-800/50 shadow-2xl overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10"
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-4xl font-geist font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight mb-3">
          Welcome to StudyBuddy.ai
        </h2>
        <p className="text-base text-zinc-400 max-w-md mx-auto">
          Your AI-powered study companion. Ask questions, get explanations, and
          enhance your learning experience.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex justify-center gap-4"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
          <span className="w-1 h-1 rounded-full bg-green-500" />
          Built by Zain
        </span>
      </motion.div>
    </div>
  </motion.div>
);

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
    <ScrollArea.Root className="flex-1 overflow-hidden bg-gradient-to-b from-black to-zinc-900/50">
      <ScrollArea.Viewport className="h-full w-full" ref={scrollRef}>
        <motion.div
          className="max-w-4xl mx-auto px-4 py-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          {messages.length === 0 && !isLoading && <WelcomeScreen />}

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
              className="flex items-center gap-2 p-2 backdrop-blur-sm bg-zinc-900/30 rounded-xl ml-2 max-w-[180px] border border-zinc-800/50"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                    animate={{
                      y: ["0%", "-50%", "0%"],
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
        className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out hover:bg-zinc-800/20 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-700/50 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
