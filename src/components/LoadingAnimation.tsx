import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from '@/lib/constants';

interface LoadingAnimationProps {
  isLoading: boolean;
}

export default function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    // Reset to first message when loading starts
    setMessageIndex(0);

    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, LOADING_MESSAGE_INTERVAL);

    // Cleanup interval on unmount or when loading stops
    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated spinner with glow effect */}
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-green border-t-transparent" />
        <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-accent-green border-t-transparent blur-md opacity-50" />
      </div>

      {/* Rotating messages with better styling */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-text-secondary text-lg text-center max-w-md font-medium"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
