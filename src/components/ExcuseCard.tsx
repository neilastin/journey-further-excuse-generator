import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COPY_SUCCESS_DURATION, CARD_STAGGER_DELAY } from '@/lib/constants';

interface ExcuseCardProps {
  title: string;
  text: string;
  accentColor: 'blue' | 'purple' | 'green';
  index: number;
  isSafeExcuse?: boolean;
  onSwitchToRisky?: () => void;
}

const accentColorClasses = {
  blue: {
    border: 'border-accent-blue',
    glow: 'shadow-lg shadow-accent-blue/20',
    badge: 'bg-accent-blue/20 text-accent-blue',
    hoverShadow: '0 12px 40px rgba(0, 217, 255, 0.3)',
  },
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/20',
    badge: 'bg-accent-blue/30 text-accent-blue',
    hoverShadow: '0 12px 40px rgba(181, 123, 255, 0.3)',
  },
  green: {
    border: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/20',
    badge: 'bg-accent-green/20 text-accent-green',
    hoverShadow: '0 12px 40px rgba(0, 255, 136, 0.3)',
  },
};

function ExcuseCard({ title, text, accentColor, index, isSafeExcuse, onSwitchToRisky }: ExcuseCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, COPY_SUCCESS_DURATION);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [text]);

  const colorClasses = accentColorClasses[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: colorClasses.hoverShadow,
      }}
      transition={{
        duration: 0.4,
        delay: index * CARD_STAGGER_DELAY,
        ease: "easeOut"
      }}
      className={cn(
        'relative bg-background-card rounded-card p-6 md:p-8 border-2',
        colorClasses.border,
        colorClasses.glow
      )}
    >
      {/* Title Badge */}
      <span
        className={cn(
          'inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4',
          colorClasses.badge
        )}
      >
        {title}
      </span>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={cn(
          'absolute top-4 right-4 p-2 rounded-lg transition-all duration-200',
          'bg-background-input/50 hover:bg-background-input',
          'text-text-secondary hover:text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-accent-green'
        )}
        aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        title={isCopied ? 'Copied!' : 'Copy to clipboard'}
      >
        {isCopied ? (
          <Check className="w-5 h-5 text-accent-green" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>

      {/* Excuse Text */}
      <p className="text-text-primary text-base leading-relaxed whitespace-pre-line">
        {text}
      </p>

      {/* Copy Success Feedback */}
      {isCopied && (
        <p className="text-accent-green text-sm font-medium mt-2 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Copied to clipboard!
        </p>
      )}

      {/* Encouragement for Safe Excuse */}
      {isSafeExcuse && onSwitchToRisky && (
        <div className="mt-4 pt-4 border-t border-text-muted/20">
          <button
            onClick={onSwitchToRisky}
            className="text-sm font-medium text-accent-green hover:text-accent-green/80 transition-colors duration-200 flex items-center gap-2"
          >
            <span>Too believable for you? Check out the risky excuse!</span>
            <span className="text-lg">🔥</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default memo(ExcuseCard);
