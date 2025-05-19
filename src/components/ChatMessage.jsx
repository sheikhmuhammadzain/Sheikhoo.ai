import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../utils/cn";

export function ChatMessage({ message, isBot, isStreaming, timestamp = new Date(), isError }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messageRef = useRef(null);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => setCopiedIndex(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiedIndex]);

  // Ensure message visibility - this might be better handled in ChatWindow if causing issues
  useEffect(() => {
    if (messageRef.current && isBot) { // Scroll bot messages into view
      // messageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [message, isBot]);

  const renderContent = () => {
    if (isStreaming && message && message.length > 0) {
      // During streaming with content, render plain text for performance
      return (
        <div className="prose prose-sm max-w-none prose-invert prose-p:leading-relaxed whitespace-pre-wrap">
          {message}
          <span className="inline-block w-1.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />
        </div>
      );
    }
    // When not streaming, or when streaming but message is empty (initial loading dots)
    return (
      <ReactMarkdown
        components={{
          pre: ({ node, ...props }) => {
            // Assuming node.children[0] is 'code' and node.children[0].children[0] is the text node
            const codeContentNode = node?.children?.[0]?.children?.[0];
            const codeText = codeContentNode?.value || "";
            // Create a unique-ish index for copy state based on code content
            const codeBlockIdentifier = codeText.slice(0, 30) + codeText.length; 

            return (
              <div className="relative group my-4 rounded-md overflow-hidden">
                {props.children}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeText);
                    setCopiedIndex(codeBlockIdentifier);
                  }}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-700 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-zinc-600"
                >
                  {copiedIndex === codeBlockIdentifier ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          },
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "plaintext"; // Default to plaintext
            
            return !inline ? (
              <SyntaxHighlighter
                style={atomDark}
                language={language}
                PreTag="div"
                className="rounded-md !bg-zinc-900 border border-zinc-700" // Ensure bg for highlighter
                showLineNumbers={true}
                wrapLines={true}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-zinc-700/50 rounded px-1 py-0.5 text-xs" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message}
      </ReactMarkdown>
    );
  };

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0.5, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "flex max-w-[85%] sm:max-w-[80%] mx-auto mb-2",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 backdrop-blur-md border overflow-hidden break-words",
          isBot
            ? "bg-zinc-900/30 text-gray-100 rounded-tl-none border-zinc-800/50"
            : "bg-purple-500/20 text-white rounded-tr-none border-purple-500/30",
          isError && isBot ? "!bg-red-500/30 !border-red-500/50" : "" // Error styling for bot messages
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shadow-lg shrink-0",
              isBot 
                ? (isError ? "bg-gradient-to-br from-red-600 to-red-800 text-white" : "bg-gradient-to-br from-zinc-700 to-zinc-900 text-white")
                : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
            )}
          >
            {isBot ? (isError ? "!" : "S") : "Y"}
          </motion.div>
          <span className="text-xs font-medium truncate">
            {isBot ? "StudyBuddy AI" : "You"}
          </span>
          <span className="text-[10px] text-gray-400 ml-auto shrink-0">
            {format(new Date(timestamp), "HH:mm")}
          </span>
        </div>
        <div
          className={cn(
            "prose prose-sm max-w-none overflow-x-auto",
            // Tailwind prose styles will be applied by ReactMarkdown or the plain text div
            isBot ? "prose-invert" : "prose-invert", 
            (isStreaming && message && message.length > 0) ? "" : "prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:border-none prose-code:text-xs prose-code:leading-relaxed prose-pre:p-0 prose-pre:rounded-lg"
          )}
        >
          {isStreaming && (!message || message.length === 0) ? (
            <div className="flex space-x-2 my-2"> {/* Loading dots */}
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          ) : renderContent()}
          
          {/* Streaming caret is now inside renderContent for plain text streaming path */}
        </div>
      </div>
    </motion.div>
  );
}
