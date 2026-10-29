import React from "react";
import { motion } from "framer-motion";

export function WelcomeScreen() {
  return (
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
          <p className="text-base text-zinc-400 max-w-md mx-auto px-4">
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
}
