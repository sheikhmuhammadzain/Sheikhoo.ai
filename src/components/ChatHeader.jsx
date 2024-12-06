import React from "react";
import { motion } from "framer-motion";

export function ChatHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-black text-white py-4 px-6 border-b border-zinc-800/50"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center justify-between"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-semibold text-white">S</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">
                StudyBuddy.ai
              </h1>
              <motion.p
                className="text-xs text-zinc-400 font-normal"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Next-Gen AI Assistant
              </motion.p>
            </div>
          </div>
          <motion.button
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-md text-xs font-medium transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}
