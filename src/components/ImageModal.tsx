import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, Share2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ShareToSlackResponse } from '@/types';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  excuseType?: 'excuse1' | 'excuse2' | 'excuse3';
  scenario: string;
  excuseText: string;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
  excuseType,
  scenario,
  excuseText,
}: ImageModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleDownload = useCallback(() => {
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
  }, [imageUrl, isDownloading, excuseType, onClose]);

  const handleShareToSlack = useCallback(async () => {
    if (!imageUrl || !excuseType) return;

    setIsSharing(true);
    setShareError(null);

    try {
      const response = await fetch('/api/share-to-slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          excuseText,
          excuseType,
          imageBase64: imageUrl,
        }),
      });

      const data: ShareToSlackResponse = await response.json();

      if (data.success) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        setShareError(data.message || 'Failed to share to Slack');
        setTimeout(() => setShareError(null), 5000);
      }
    } catch (error) {
      console.error('Share to Slack error:', error);
      setShareError('Failed to share to Slack');
      setTimeout(() => setShareError(null), 5000);
    } finally {
      setIsSharing(false);
    }
  }, [imageUrl, excuseType, scenario, excuseText]);

  // Close on ESC key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

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

            {/* Action Buttons (Floating Bottom Right) */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              {/* Share to Slack Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                onClick={handleShareToSlack}
                disabled={isSharing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'px-6 py-3 rounded-lg font-semibold',
                  'shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
                  'flex items-center gap-2',
                  'transition-all duration-200',
                  shareSuccess
                    ? 'bg-accent-green text-background shadow-accent-green/30 focus:ring-accent-green'
                    : shareError
                    ? 'bg-red-500 text-background shadow-red-500/30 focus:ring-red-500'
                    : 'bg-accent-purple text-background shadow-accent-purple/30 focus:ring-accent-purple',
                  isSharing && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={isSharing ? 'Sharing...' : shareSuccess ? 'Shared!' : 'Share to Slack'}
              >
                {isSharing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : shareSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    Shared!
                  </>
                ) : shareError ? (
                  <>
                    <X className="w-5 h-5" />
                    Failed
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share to Slack
                  </>
                )}
              </motion.button>

              {/* Download Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.25 }}
                onClick={handleDownload}
                disabled={isDownloading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
