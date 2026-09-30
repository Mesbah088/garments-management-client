import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = "Loading Garments Hub..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 dark:border-emerald-400/20 dark:border-t-emerald-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🧵</span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm animate-pulse tracking-wide">
        {text}
      </p>
    </div>
  );
}
