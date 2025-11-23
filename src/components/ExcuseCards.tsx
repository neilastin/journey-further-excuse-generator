import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ExcusesResponse } from '@/types';
import ExcuseCard from './ExcuseCard';
import { cn } from '@/lib/utils';

interface ExcuseCardsProps {
  excuses: ExcusesResponse | null;
  isVisible: boolean;
  onTabChange?: (excuseType: 'excuse1' | 'excuse2') => void;
}

type ExcuseType = 'believable' | 'risky';

export default function ExcuseCards({ excuses, isVisible, onTabChange }: ExcuseCardsProps) {
  const [activeTab, setActiveTab] = useState<ExcuseType>('believable');

  // Map excuses to UI tabs (use titles from API)
  const excuseData = useMemo(() => {
    if (!excuses) return null;

    return {
      believable: {
        ...excuses.excuse1,
        type: 'believable' as const,
        accentColor: 'purple' as const,
      },
      risky: {
        ...excuses.excuse2,
        type: 'risky' as const,
        accentColor: 'green' as const,
      },
    };
  }, [excuses]);

  const handleTabChange = useCallback((excuseType: ExcuseType) => {
    setActiveTab(excuseType);

    // Map UI tab type to API excuse type and notify parent
    const excuseTypeMap: Record<ExcuseType, 'excuse1' | 'excuse2'> = {
      believable: 'excuse1',
      risky: 'excuse2',
    };

    onTabChange?.(excuseTypeMap[excuseType]);
  }, [onTabChange]);

  // Memoize tabs array to prevent recreation on each render
  const tabs = useMemo(() => [
    { type: 'believable' as const, label: 'Believable' },
    { type: 'risky' as const, label: 'Risky!', emoji: '🔥💥' },
  ], []);

  if (!isVisible || !excuseData) {
    return null;
  }

  const activeExcuse = excuseData[activeTab];

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
        Your Excuses
      </h2>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-8 max-w-2xl mx-auto">
        {tabs.map(({ type, label, emoji }) => {
          const isActive = activeTab === type;
          const isRisky = type === 'risky';

          return (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              className={cn(
                'relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                isActive
                  ? isRisky
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/40 scale-105'
                    : 'bg-accent-green text-background shadow-lg shadow-accent-green/30 scale-105'
                  : 'bg-background-card text-text-secondary hover:text-text-primary hover:bg-background-input',
                isRisky && !isActive && 'risky-tab-inactive',
                isRisky && 'focus:ring-red-500',
                !isRisky && 'focus:ring-accent-green'
              )}
              aria-pressed={isActive}
              aria-label={`Show ${label} excuse`}
            >
              <span className="flex items-center justify-center gap-2">
                {label}
                {emoji && (
                  <span className={cn(
                    'text-lg',
                    isRisky && !isActive && 'animate-bounce'
                  )}>
                    {emoji}
                  </span>
                )}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={cn(
                    'absolute inset-0 rounded-lg -z-10',
                    isRisky
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-accent-green'
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Single Card Display with Animation */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <ExcuseCard
            title={activeExcuse.title}
            text={activeExcuse.text}
            accentColor={activeExcuse.accentColor}
            index={0}
            isSafeExcuse={activeTab === 'believable'}
            onSwitchToRisky={() => handleTabChange('risky')}
          />
        </motion.div>
      </div>
    </section>
  );
}
