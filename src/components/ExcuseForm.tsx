import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AUDIENCE_OPTIONS, LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL, getRandomPlaceholder } from '@/lib/constants';
import type { CustomExcuseOptions } from '@/types';
import { cn } from '@/lib/utils';
import CustomiseModal from './CustomiseModal';

interface ExcuseFormProps {
  onSubmit: (data: {
    scenario: string;
    audience: string;
    customOptions?: CustomExcuseOptions;
  }) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface FormErrors {
  scenario?: string;
  audience?: string;
}

export default function ExcuseForm({ onSubmit, isLoading, disabled = false }: ExcuseFormProps) {
  const [scenario, setScenario] = useState('');
  const [audience, setAudience] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [messageIndex, setMessageIndex] = useState(0);
  const [isCustomiseOpen, setIsCustomiseOpen] = useState(false);

  // Get a random placeholder on component mount (only once)
  const placeholderText = useMemo(() => getRandomPlaceholder(), []);

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

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!scenario.trim()) {
      errors.scenario = 'Please describe what happened';
    } else if (scenario.trim().length < 10) {
      errors.scenario = 'Please provide at least 10 characters';
    }

    if (!audience) {
      errors.audience = 'Please select your audience';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      scenario: scenario.trim(),
      audience,
    });
  };

  const handleScenarioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setScenario(e.target.value);
    if (formErrors.scenario) {
      setFormErrors((prev) => ({ ...prev, scenario: undefined }));
    }
  };

  const handleAudienceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAudience(e.target.value);
    if (formErrors.audience) {
      setFormErrors((prev) => ({ ...prev, audience: undefined }));
    }
  };

  const openCustomiseModal = () => setIsCustomiseOpen(true);
  const closeCustomiseModal = () => setIsCustomiseOpen(false);

  const handleCustomiseGenerate = (options: {
    style: string;
    narrativeElements: string[];
    excuseFocus: string;
  }) => {
    // Validate form first
    if (!validateForm()) {
      // Close modal if form invalid, let error messages show
      closeCustomiseModal();
      return;
    }

    // Call onSubmit with custom options
    onSubmit({
      scenario: scenario.trim(),
      audience,
      customOptions: {
        style: options.style,
        narrativeElements: options.narrativeElements,
        excuseFocus: options.excuseFocus,
      },
    });

    // Modal stays open - parent will handle closing after generation completes
    // (Modal shows loading state internally)
  };

  const isFormValid = scenario.trim().length >= 10 && audience;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-background-card p-6 md:p-8 rounded-card shadow-lg">
      {/* Scenario Textarea */}
      <div className="space-y-2">
        <label htmlFor="scenario" className="text-text-primary font-medium mb-2 block">
          What Do You Need An Excuse For?
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          placeholder={`Example: ${placeholderText}`}
          rows={3}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input',
            'placeholder:text-text-muted',
            'focus:outline-none',
            'input-glow',
            formErrors.scenario && 'border-red-400',
            (isLoading || disabled) && 'opacity-50 cursor-not-allowed'
          )}
          required
          aria-invalid={!!formErrors.scenario}
          aria-describedby={formErrors.scenario ? 'scenario-error' : undefined}
        />
        {formErrors.scenario && (
          <p id="scenario-error" className="text-red-400 text-sm mt-1">
            {formErrors.scenario}
          </p>
        )}
      </div>

      {/* Audience Select */}
      <div className="space-y-2">
        <label htmlFor="audience" className="text-text-primary font-medium mb-2 block">
          Who Needs Convincing That This Isn't Your Fault?
        </label>
        <select
          id="audience"
          value={audience}
          onChange={handleAudienceChange}
          disabled={isLoading || disabled}
          className={cn(
            'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input',
            'focus:outline-none',
            'input-glow',
            formErrors.audience && 'border-red-400',
            (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
            !audience && 'text-text-muted'
          )}
          required
          aria-invalid={!!formErrors.audience}
          aria-describedby={formErrors.audience ? 'audience-error' : undefined}
        >
          <option value="" disabled>
            Select your audience
          </option>
          {AUDIENCE_OPTIONS.map((option) => (
            <option key={option} value={option} className="text-text-primary">
              {option}
            </option>
          ))}
        </select>
        {formErrors.audience && (
          <p id="audience-error" className="text-red-400 text-sm mt-1">
            {formErrors.audience}
          </p>
        )}
      </div>

      {/* Button Layout - Side by Side on Desktop, Stacked on Mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Generate Excuses Button - 4x wider on desktop */}
        <motion.button
          type="submit"
          disabled={!isFormValid || isLoading || disabled}
          whileHover={
            isFormValid && !isLoading && !disabled
              ? {
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)",
                }
              : {}
          }
          whileTap={
            isFormValid && !isLoading && !disabled
              ? { scale: 0.98 }
              : {}
          }
          className={cn(
            'flex-1 sm:flex-[4] py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
            'bg-accent-green text-background',
            'shadow-lg shadow-accent-green/20',
            'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
            (!isFormValid || isLoading || disabled) && 'opacity-50 cursor-not-allowed',
            'h-[64px] flex items-center justify-center'
          )}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              {/* Spinner on left */}
              <div className="relative flex-shrink-0">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-background border-t-transparent" />
                <div className="absolute inset-0 animate-spin rounded-full h-6 w-6 border-2 border-background border-t-transparent blur-sm opacity-50" />
              </div>

              {/* Rotating messages on right */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={messageIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : (
            'Generate Excuses'
          )}
        </motion.button>

        {/* Customise Button - 1x width on desktop */}
        <motion.button
          type="button"
          onClick={openCustomiseModal}
          disabled={!isFormValid || isLoading || disabled}
          whileHover={
            isFormValid && !isLoading && !disabled
              ? {
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(160, 160, 160, 0.2)",
                }
              : {}
          }
          whileTap={
            isFormValid && !isLoading && !disabled
              ? { scale: 0.98 }
              : {}
          }
          className={cn(
            'flex-1 sm:flex-[1] py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
            'bg-background-card border border-text-muted text-text-secondary',
            'hover:border-text-secondary hover:text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-text-muted focus:ring-offset-2 focus:ring-offset-background',
            (!isFormValid || isLoading || disabled) && 'opacity-50 cursor-not-allowed',
            'h-[64px] flex items-center justify-center'
          )}
        >
          Customise
        </motion.button>
      </div>
      </form>

      {/* Customise Modal */}
      <CustomiseModal
        isOpen={isCustomiseOpen}
        onClose={closeCustomiseModal}
        onGenerate={handleCustomiseGenerate}
        isLoading={isLoading}
      />
    </>
  );
}
