import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TaglineVariation } from '@/lib/taglineVariations';

interface HeroProps {
  variation: TaglineVariation;
  className?: string;
}

export default function Hero({ variation, className }: HeroProps) {
  return (
    <section className={cn('py-6 md:py-8 text-center', className)}>
      <div className="max-w-container mx-auto px-mobile md:px-desktop">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Main Tagline with Gradient Effects */}
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              <span className="text-white">{variation.tagline.line1}</span>
            </motion.h2>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-accent-green via-accent-blue to-accent-purple bg-clip-text text-transparent">
                {variation.tagline.line2}
              </span>
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}
