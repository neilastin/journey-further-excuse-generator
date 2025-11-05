import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-white/5">
      <div className="max-w-container mx-auto px-mobile md:px-desktop py-3">
        <div className="flex items-center justify-center gap-2">
          {/* Logo - Left side */}
          <img
            src="/logo.svg"
            alt="Journey Further Logo"
            className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"
          />

          {/* Title and Badge - Centered between logos */}
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap">
              <span className="text-white">Journey </span>
              <span className="bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">
                Further
              </span>
            </h1>

            {/* AI Badge - Centered under title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/20">
                <Sparkles className="w-4 h-4 text-accent-green flex-shrink-0" />
                <span className="text-xs font-medium text-accent-green whitespace-nowrap tracking-wider">
                  Excuse Generator
                </span>
              </div>
            </motion.div>
          </div>

          {/* Logo - Right side (mirrored) */}
          <img
            src="/logo.svg"
            alt="Journey Further Logo"
            className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 scale-x-[-1]"
          />
        </div>
      </div>
    </header>
  );
}
