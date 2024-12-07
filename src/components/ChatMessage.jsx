import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { cn } from "../utils/cn";

export function ChatMessage({ message, isBot, timestamp = new Date() }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-2",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 backdrop-blur-md border",
          isBot
            ? "bg-zinc-900/30 text-gray-100 ml-2 rounded-tl-none border-zinc-800/50"
            : "bg-purple-500/20 text-white mr-2 rounded-tr-none border-purple-500/30"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shadow-lg",
              isBot 
                ? "bg-gradient-to-br from-zinc-700 to-zinc-900 text-white" 
                : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
            )}
          >
            {isBot ? "S" : "Y"}
          </motion.div>
          <span className="text-xs font-medium">
            {isBot ? "StudyBuddy AI" : "You"}
          </span>
          <span className="text-[10px] text-gray-400 ml-auto">
            {format(timestamp, "HH:mm")}
          </span>
        </div>
        <div
          className={cn(
            "prose prose-sm max-w-none",
            "prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800/50",
            isBot ? "prose-invert" : "prose-invert"
          )}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
