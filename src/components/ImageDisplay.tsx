import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImageModal from './ImageModal';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  accentColor: 'purple' | 'green';
  excuseType?: 'excuse1' | 'excuse2';
}

const accentColorClasses = {
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/20',
    bg: 'bg-accent-purple/5',
    text: 'text-accent-purple',
  },
  green: {
    border: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/20',
    bg: 'bg-accent-green/5',
    text: 'text-accent-green',
  },
};

// Witty loading messages for image generation
const loadingMessages = [
  "Fabricating photographic evidence...",
  "Staging the crime scene...",
  "Teaching AI to lie convincingly...",
  "Adjusting the lighting on your alibi...",
  "Making it look totally legit...",
  "Adding just the right amount of chaos...",
  "Consulting with professional excuse-makers...",
  "Photoshopping your innocence...",
  "Creating plausible deniability...",
  "Generating your get-out-of-jail card...",
  "Manufacturing proof of your whereabouts...",
  "Crafting visual believability...",
  "Adding dramatic effect...",
  "Making fiction look like fact...",
  "Assembling your defence exhibit...",
];

export default function ImageDisplay({
  imageUrl,
  isLoading,
  accentColor,
  excuseType,
}: ImageDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const colorClasses = accentColorClasses[accentColor];

  // Rotate through loading messages
  useEffect(() => {
    if (!isLoading) {
      setCurrentMessageIndex(0);
      return;
    }

    // Set random initial message
    setCurrentMessageIndex(Math.floor(Math.random() * loadingMessages.length));

    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleImageClick = () => {
    if (imageUrl && !isLoading) {
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-card border-2 overflow-hidden',
        'bg-background-card transition-all duration-300',
        colorClasses.border,
        imageUrl && colorClasses.glow
      )}
      style={{ aspectRatio: '16 / 9' }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          // Loading State with rotating messages
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8"
          >
            <div className="relative">
              <div
                className={cn(
                  'animate-spin rounded-full h-16 w-16 border-4',
                  accentColor === 'purple' ? 'border-accent-purple' : 'border-accent-green',
                  'border-t-transparent'
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 blur-md opacity-50',
                  accentColor === 'purple' ? 'border-accent-purple' : 'border-accent-green',
                  'border-t-transparent'
                )}
                style={{ animationDirection: 'reverse' }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-text-secondary text-lg text-center font-medium"
              >
                {loadingMessages[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : imageUrl ? (
          // Image Display State - Clickable to open full screen
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={handleImageClick}
            className={cn(
              'relative w-full h-full group cursor-pointer',
              'transition-transform duration-200',
              'hover:scale-[1.02]'
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageClick();
              }
            }}
            aria-label="Click to view full screen"
          >
            <img
              src={imageUrl}
              alt="Generated excuse evidence"
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay with Expand Icon */}
            <div
              className={cn(
                'absolute inset-0 bg-black/0 group-hover:bg-black/30',
                'transition-all duration-300',
                'flex items-center justify-center',
                'pointer-events-none'
              )}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className={cn(
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'p-4 rounded-full bg-background-card/90 backdrop-blur-sm',
                  'shadow-lg shadow-accent-green/20'
                )}
              >
                <Maximize2 className="w-8 h-8 text-accent-green" />
              </motion.div>
            </div>

            {/* Permanent hint text at bottom - always visible */}
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0',
                'bg-gradient-to-t from-black/60 to-transparent',
                'p-3 text-center',
                'pointer-events-none'
              )}
            >
              <p className="text-white text-sm font-medium">Click to view full screen</p>
            </div>
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center gap-4 p-8',
              'border-2 border-dashed rounded-card',
              colorClasses.border,
              colorClasses.bg
            )}
          >
            <div className={cn('p-4 rounded-full bg-background-input', colorClasses.bg)}>
              <ImageIcon className={cn('w-12 h-12', colorClasses.text)} />
            </div>
            <div className="text-center max-w-md">
              <p className="text-text-primary font-medium mb-1">No photo evidence yet</p>
              <p className="text-text-muted text-sm">
                Generate photo evidence for your excuse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Modal */}
      {imageUrl && (
        <ImageModal
          isOpen={isModalOpen}
          imageUrl={imageUrl}
          onClose={() => setIsModalOpen(false)}
          excuseType={excuseType}
        />
      )}
    </div>
  );
}
