import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  excuseType?: 'excuse1' | 'excuse2';
}

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
  excuseType,
}: ImageModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!imageUrl || isDownloading) return;

    setIsDownloading(true);

    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `excuse-evidence-${excuseType || 'photo'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Auto-close modal after download (small delay for user feedback)
    setTimeout(() => {
      setIsDownloading(false);
      onClose();
    }, 800);
  };

  // Close on ESC key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image preview"
        >
          {/* Close Button (Top Right) */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 z-10',
              'p-2 rounded-full',
              'bg-background-card/90 backdrop-blur-sm',
              'text-text-primary hover:text-accent-green',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-black'
            )}
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-7xl w-full"
          >
            <img
              src={imageUrl}
              alt="Full screen excuse evidence"
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '90vh', objectFit: 'contain' }}
            />

            {/* Download Button (Floating Bottom Right) */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'absolute bottom-6 right-6',
                'px-6 py-3 rounded-lg font-semibold',
                'bg-accent-green text-background',
                'shadow-lg shadow-accent-green/30',
                'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-black',
                'flex items-center gap-2',
                'transition-all duration-200',
                isDownloading && 'bg-accent-green/80'
              )}
              aria-label={isDownloading ? 'Downloading...' : 'Download image'}
            >
              {isDownloading ? (
                <>
                  <Check className="w-5 h-5" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
