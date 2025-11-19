import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import {
  COMEDY_STYLES,
  ALWAYS_AVAILABLE_ELEMENTS,
  getActiveLimitedTimeElements,
  EXCUSE_FOCUS_OPTIONS,
  MAX_NARRATIVE_ELEMENTS,
  type ComedyStyle,
  type ExcuseFocus,
  type NarrativeElement,
} from '@/lib/spiceItUpOptions';
import { LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CustomiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: {
    style: string;
    narrativeElements: string[];
    excuseFocus: string;
    aiModel?: 'claude' | 'gemini';
  }) => void;
  isLoading: boolean;
}

export default function CustomiseModal({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
}: CustomiseModalProps) {
  // Form state
  const [selectedStyle, setSelectedStyle] = useState<ComedyStyle>('surprise-me');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<ExcuseFocus>('let-ai-decide');
  const [selectedModel, setSelectedModel] = useState<'claude' | 'gemini'>('claude');

  // Limited time elements (fetched once on mount)
  const [limitedTimeElements, setLimitedTimeElements] = useState<NarrativeElement[]>([]);

  // Loading message rotation
  const [messageIndex, setMessageIndex] = useState(0);

  // Track previous loading state for auto-close
  const wasLoading = useRef(false);

  // Fetch limited time elements on mount
  useEffect(() => {
    setLimitedTimeElements(getActiveLimitedTimeElements());
  }, []);

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) {
      return;
    }

    setMessageIndex(0);

    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, LOADING_MESSAGE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  // Auto-close modal when loading completes
  useEffect(() => {
    if (wasLoading.current && !isLoading && isOpen) {
      onClose();
    }
    wasLoading.current = isLoading;
  }, [isLoading, isOpen, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  // Ref to scrollable container for scroll position preservation
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle narrative element toggle
  const handleElementToggle = useCallback((elementId: string) => {
    if (isLoading) return;

    // Save scroll position before state update
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;

    setSelectedElements((prev) => {
      if (prev.includes(elementId)) {
        // Remove if already selected
        return prev.filter((id) => id !== elementId);
      } else if (prev.length < MAX_NARRATIVE_ELEMENTS) {
        // Add if under max limit
        return [...prev, elementId];
      }
      // Max limit reached, ignore
      return prev;
    });

    // Restore scroll position after React updates
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, [isLoading]);

  // Handle form submission
  const handleGenerate = useCallback(() => {
    if (isLoading) return;

    onGenerate({
      style: selectedStyle,
      narrativeElements: selectedElements,
      excuseFocus: selectedFocus,
      aiModel: selectedModel,
    });
  }, [isLoading, onGenerate, selectedStyle, selectedElements, selectedFocus, selectedModel]);

  // Check if element checkbox should be disabled
  const isElementDisabled = useCallback((elementId: string): boolean => {
    return (
      isLoading ||
      (!selectedElements.includes(elementId) && selectedElements.length >= MAX_NARRATIVE_ELEMENTS)
    );
  }, [isLoading, selectedElements]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[600px] max-h-[85vh] bg-background-card rounded-card shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background-card border-b border-background-input px-5 md:px-6 py-4 flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span>Customise Your Excuse</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-background-input focus:outline-none focus:ring-2 focus:ring-accent-green',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto flex-1 min-h-0 px-5 md:px-6 py-4 space-y-4"
            style={{ overflowAnchor: 'none' }}
          >
            {/* Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Left Column: Excuse Focus */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-text-primary">
                  Excuse Focus <span className="text-text-muted text-xs font-normal">(pick one)</span>
                </h3>
                <div className="space-y-1.5">
                  {EXCUSE_FOCUS_OPTIONS.map((focus) => (
                    <label
                      key={focus.id}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all',
                        'hover:bg-background-input',
                        selectedFocus === focus.id && 'bg-background-input ring-2 ring-accent-green',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <input
                        type="radio"
                        name="excuse-focus"
                        value={focus.id}
                        checked={selectedFocus === focus.id}
                        onChange={(e) => setSelectedFocus(e.target.value as ExcuseFocus)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          selectedFocus === focus.id
                            ? 'border-accent-green bg-accent-green'
                            : 'border-text-muted'
                        )}
                      >
                        {selectedFocus === focus.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-background" />
                        )}
                      </div>
                      <span className="text-2xl" aria-hidden="true">
                        {focus.emoji}
                      </span>
                      <span className="text-sm text-text-primary font-medium">{focus.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right Column: Comedy Style */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-text-primary">
                  Comedy Style <span className="text-text-muted text-xs font-normal">(pick one)</span>
                </h3>
                <div className="space-y-1.5">
                  {COMEDY_STYLES.map((style) => (
                    <label
                      key={style.id}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all',
                        'hover:bg-background-input',
                        selectedStyle === style.id && 'bg-background-input ring-2 ring-accent-green',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <input
                        type="radio"
                        name="comedy-style"
                        value={style.id}
                        checked={selectedStyle === style.id}
                        onChange={(e) => setSelectedStyle(e.target.value as ComedyStyle)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          selectedStyle === style.id
                            ? 'border-accent-green bg-accent-green'
                            : 'border-text-muted'
                        )}
                      >
                        {selectedStyle === style.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-background" />
                        )}
                      </div>
                      <span className="text-2xl" aria-hidden="true">
                        {style.emoji}
                      </span>
                      <span className="text-sm text-text-primary font-medium">{style.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-text-primary">
                AI Model <span className="text-text-muted text-xs font-normal">(pick one)</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-lg cursor-pointer transition-all',
                    'hover:bg-background-input',
                    selectedModel === 'claude' && 'bg-background-input ring-2 ring-accent-green',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input
                    type="radio"
                    name="ai-model"
                    value="claude"
                    checked={selectedModel === 'claude'}
                    onChange={(e) => setSelectedModel(e.target.value as 'claude' | 'gemini')}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      selectedModel === 'claude'
                        ? 'border-accent-green bg-accent-green'
                        : 'border-text-muted'
                    )}
                  >
                    {selectedModel === 'claude' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    )}
                  </div>
                  <span className="text-sm text-text-primary font-medium">Claude</span>
                </label>

                <label
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-lg cursor-pointer transition-all',
                    'hover:bg-background-input',
                    selectedModel === 'gemini' && 'bg-background-input ring-2 ring-accent-green',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input
                    type="radio"
                    name="ai-model"
                    value="gemini"
                    checked={selectedModel === 'gemini'}
                    onChange={(e) => setSelectedModel(e.target.value as 'claude' | 'gemini')}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      selectedModel === 'gemini'
                        ? 'border-accent-green bg-accent-green'
                        : 'border-text-muted'
                    )}
                  >
                    {selectedModel === 'gemini' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    )}
                  </div>
                  <span className="text-sm text-text-primary font-medium">Gemini</span>
                </label>
              </div>
            </div>

            {/* Special Ingredients (Always Available) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  Special Ingredients To Feature In Your Excuse{' '}
                  <span className="text-text-muted text-xs font-normal">
                    (pick up to {MAX_NARRATIVE_ELEMENTS})
                  </span>
                </h3>
                <span
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    selectedElements.length >= MAX_NARRATIVE_ELEMENTS
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-background-input text-text-secondary'
                  )}
                >
                  {selectedElements.length}/{MAX_NARRATIVE_ELEMENTS} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ALWAYS_AVAILABLE_ELEMENTS.map((element) => (
                  <div
                    key={element.id}
                    role="checkbox"
                    aria-checked={selectedElements.includes(element.id)}
                    aria-disabled={isElementDisabled(element.id)}
                    tabIndex={isElementDisabled(element.id) ? -1 : 0}
                    onClick={() => handleElementToggle(element.id)}
                    onKeyDown={(e) => {
                      if ((e.key === ' ' || e.key === 'Enter') && !isElementDisabled(element.id)) {
                        e.preventDefault();
                        handleElementToggle(element.id);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all',
                      'hover:bg-background-input',
                      'focus:outline-none focus:ring-2 focus:ring-accent-green',
                      selectedElements.includes(element.id) && 'bg-background-input ring-2 ring-accent-green',
                      isElementDisabled(element.id) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                        selectedElements.includes(element.id)
                          ? 'border-accent-green bg-accent-green'
                          : 'border-text-muted'
                      )}
                    >
                      {selectedElements.includes(element.id) && (
                        <Check className="w-2.5 h-2.5 text-background" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-2xl" aria-hidden="true">
                      {element.emoji}
                    </span>
                    <span className="text-sm text-text-primary font-medium">{element.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limited Time Elements (if any) */}
            {limitedTimeElements.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-accent-blue">Limited Time Only</h3>
                  <span className="text-xl" aria-hidden="true">
                    ⏰
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3 rounded-lg bg-accent-blue/15 border border-accent-blue/40">
                  {limitedTimeElements.map((element) => (
                    <div
                      key={element.id}
                      role="checkbox"
                      aria-checked={selectedElements.includes(element.id)}
                      aria-disabled={isElementDisabled(element.id)}
                      tabIndex={isElementDisabled(element.id) ? -1 : 0}
                      onClick={() => handleElementToggle(element.id)}
                      onKeyDown={(e) => {
                        if ((e.key === ' ' || e.key === 'Enter') && !isElementDisabled(element.id)) {
                          e.preventDefault();
                          handleElementToggle(element.id);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all',
                        'hover:bg-accent-blue/20',
                        'focus:outline-none focus:ring-2 focus:ring-accent-blue',
                        selectedElements.includes(element.id) &&
                          'bg-accent-blue/20 ring-2 ring-accent-blue',
                        isElementDisabled(element.id) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                          selectedElements.includes(element.id)
                            ? 'border-accent-blue bg-accent-blue'
                            : 'border-accent-blue/60'
                        )}
                      >
                        {selectedElements.includes(element.id) && (
                        <Check className="w-2.5 h-2.5 text-background" strokeWidth={3} />
                      )}
                      </div>
                      <span className="text-2xl" aria-hidden="true">
                        {element.emoji}
                      </span>
                      <span className="text-sm text-text-primary font-medium">{element.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Generate Button */}
          <div className="sticky bottom-0 bg-background-card border-t border-background-input px-5 md:px-6 py-3.5">
            <motion.button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              className={cn(
                'w-full py-3.5 px-6 rounded-input font-bold text-base transition-all duration-200',
                'bg-accent-green text-background',
                'shadow-lg shadow-accent-green/20',
                'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background-card',
                isLoading && 'opacity-50 cursor-not-allowed',
                'h-[56px] flex items-center justify-center'
              )}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  {/* Spinner */}
                  <div className="relative flex-shrink-0">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-background border-t-transparent" />
                    <div className="absolute inset-0 animate-spin rounded-full h-5 w-5 border-2 border-background border-t-transparent blur-sm opacity-50" />
                  </div>

                  {/* Rotating messages */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={messageIndex}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs font-medium"
                    >
                      {LOADING_MESSAGES[messageIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              ) : (
                'Generate Custom Excuse'
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
  );
}
 
