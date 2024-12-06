import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { cn } from "../utils/cn";

export function ChatMessage({ message, isBot, timestamp = new Date() }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-6",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-6",
          isBot
            ? "bg-gray-800 text-gray-100 ml-4 rounded-tl-none"
            : "bg-purple-600 text-white mr-4 rounded-tr-none"
        )}
      >
        <div className="flex items-center mb-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              isBot ? "bg-purple-600 text-white" : "bg-white text-purple-600"
            )}
          >
            {isBot ? "S" : "Y"}
          </div>
          <span className="ml-2 font-medium">
            {isBot ? "StudyBuddy AI" : "You"}
          </span>
          <span className="ml-2 text-xs text-gray-400">
            {format(timestamp, "HH:mm")}
          </span>
        </div>
        <div
          className={cn(
            "prose prose-sm max-w-none",
            isBot ? "prose-invert" : "prose-invert"
          )}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
