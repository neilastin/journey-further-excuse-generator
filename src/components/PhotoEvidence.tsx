import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import HeadshotUpload from './HeadshotUpload';
import ImageDisplay from './ImageDisplay';
import AdminUnlockModal from './AdminUnlockModal';
import { cn } from '@/lib/utils';
import { checkUnlockStatus, setUnlockStatus } from '@/lib/adminAuth';

interface PhotoEvidenceProps {
  scenario: string;
  excuseText: string;
  excuseType: 'excuse1' | 'excuse2';
  accentColor: 'purple' | 'green';
  isGenerating: boolean;
  generatedImage: string | null;
  onGenerate: (headshotBase64?: string, headshotMimeType?: 'image/jpeg' | 'image/png', keepSameClothes?: boolean, aspectRatio?: string, lusciousLocks?: boolean, imageQuality?: 'standard' | 'pro') => void;
}

type AspectRatioOption = {
  value: string;
  ratio: string;
  description: string;
};

const aspectRatioOptions: AspectRatioOption[] = [
  { value: '16:9', ratio: '16:9', description: 'Best for Desktop and General Web' },
  { value: '4:5', ratio: '4:5', description: 'Best for Instagram and LinkedIn' },
  { value: '9:16', ratio: '9:16', description: 'Best for TikTok, Stories and Reels' },
  { value: '1:1', ratio: '1:1', description: 'Best for People Scared Of Rectangles' },
];

interface HeadshotData {
  file: File;
  base64: string;
  mimeType: 'image/jpeg' | 'image/png';
}

const excuseTypeLabels: Record<'excuse1' | 'excuse2', string> = {
  excuse1: 'Believable Excuse',
  excuse2: 'Risky Excuse',
};

export default function PhotoEvidence({
  scenario,
  excuseText,
  excuseType,
  accentColor,
  isGenerating,
  generatedImage,
  onGenerate,
}: PhotoEvidenceProps) {
  const [headshot, setHeadshot] = useState<HeadshotData | null>(null);
  const [keepSameClothes, setKeepSameClothes] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [showLinkedInWarning, setShowLinkedInWarning] = useState(false);
  const [showNoPhotoWarning, setShowNoPhotoWarning] = useState(false);
  const [showSafeExcuseWarning, setShowSafeExcuseWarning] = useState(false);

  // Luscious Locks easter egg state
  const [outfitToggleCount, setOutfitToggleCount] = useState(0);
  const [lastToggleTime, setLastToggleTime] = useState(0);
  const [lusciousLocksUnlocked, setLusciousLocksUnlocked] = useState(false);
  const [lusciousLocksEnabled, setLusciousLocksEnabled] = useState(false);

  // Admin pro mode state
  const [isProModeUnlocked, setIsProModeUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [imageQuality, setImageQuality] = useState<'standard' | 'pro'>('standard');

  // Check unlock status on mount
  useEffect(() => {
    setIsProModeUnlocked(checkUnlockStatus());
  }, []);

  const handleUpload = useCallback((file: File, base64: string, mimeType: 'image/jpeg' | 'image/png') => {
    setHeadshot({ file, base64, mimeType });
  }, []);

  const handleRemove = useCallback(() => {
    setHeadshot(null);
  }, []);

  const handleAspectRatioSelect = useCallback((value: string) => {
    setAspectRatio(value);

    // Show LinkedIn warning when selecting 4:5
    if (value === '4:5') {
      setShowLinkedInWarning(true);
    }
  }, []);

  // Auto-hide LinkedIn warning after 3 seconds
  useEffect(() => {
    if (showLinkedInWarning) {
      const timer = setTimeout(() => {
        setShowLinkedInWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLinkedInWarning]);

  // Auto-hide no photo warning after 3 seconds
  useEffect(() => {
    if (showNoPhotoWarning) {
      const timer = setTimeout(() => {
        setShowNoPhotoWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoPhotoWarning]);

  const handleOutfitToggle = useCallback(() => {
    const now = Date.now();

    // Track rapid toggling for easter egg (within 500ms between clicks)
    if (now - lastToggleTime < 500) {
      const newCount = outfitToggleCount + 1;
      setOutfitToggleCount(newCount);

      // Unlock luscious locks mode after 10 rapid toggles
      if (newCount >= 10 && !lusciousLocksUnlocked) {
        setLusciousLocksUnlocked(true);
        setLusciousLocksEnabled(true);
      }
    } else {
      setOutfitToggleCount(1);
    }
    setLastToggleTime(now);

    if (!headshot) {
      setShowNoPhotoWarning(true);
      return;
    }
    setKeepSameClothes(!keepSameClothes);
  }, [lastToggleTime, outfitToggleCount, lusciousLocksUnlocked, headshot, keepSameClothes]);

  const handleUnlock = useCallback((token: string) => {
    setUnlockStatus(token);
    setIsProModeUnlocked(true);
  }, []);

  const handleGenerate = useCallback(() => {
    // Show warning if trying to generate for safe excuse
    if (excuseType === 'excuse1') {
      setShowSafeExcuseWarning(true);
      return;
    }

    if (headshot) {
      onGenerate(headshot.base64, headshot.mimeType, keepSameClothes, aspectRatio, lusciousLocksEnabled, imageQuality);
    } else {
      onGenerate(undefined, undefined, undefined, aspectRatio, lusciousLocksEnabled, imageQuality);
    }
  }, [headshot, onGenerate, keepSameClothes, aspectRatio, lusciousLocksEnabled, imageQuality, excuseType]);

  const handleGenerateAnyway = useCallback(() => {
    setShowSafeExcuseWarning(false);
    if (headshot) {
      onGenerate(headshot.base64, headshot.mimeType, keepSameClothes, aspectRatio, lusciousLocksEnabled, imageQuality);
    } else {
      onGenerate(undefined, undefined, undefined, aspectRatio, lusciousLocksEnabled, imageQuality);
    }
  }, [headshot, onGenerate, keepSameClothes, aspectRatio, lusciousLocksEnabled, imageQuality]);

  const isButtonDisabled = isGenerating || !excuseText;
  const excuseLabel = excuseTypeLabels[excuseType];

  return (
    <section className="mt-16 space-y-8">
      {/* Section Header */}
      <div className="text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary inline-block">
          Photo Evidence
        </h2>
        <button
          onClick={() => setShowUnlockModal(true)}
          className="absolute top-1/2 -translate-y-1/2 right-0 md:right-8 text-text-muted hover:text-text-secondary transition-colors opacity-30 hover:opacity-60"
          aria-label="Admin settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Admin Unlock Modal */}
      <AdminUnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlock={handleUnlock}
      />

      {/* Single Column Layout */}
      <div className="max-w-xl mx-auto space-y-6">
        {/* Headshot Upload */}
        <div>
          <h3 className="text-text-primary font-semibold mb-2 text-lg">
            Your Headshot (Optional)
          </h3>
          {headshot ? (
            <p className="text-text-muted text-sm mb-3">
              Your headshot will be incorporated into the evidence image
            </p>
          ) : (
            <div className="text-text-muted text-sm mb-3">
              <p>Uploading your own headshot will give you personalised photographic evidence.</p>
              <p>We can't promise it will stand up in a court of law, but it should fool HR.</p>
            </div>
          )}
          <HeadshotUpload
            onUpload={handleUpload}
            onRemove={handleRemove}
            currentFile={headshot?.file || null}
            disabled={isGenerating}
          />
        </div>

        {/* Clothing Toggle - always visible */}
        <div className="relative flex items-center justify-between p-4 bg-background-card rounded-lg border border-background-input">
          <div>
            <p className="text-text-primary font-medium text-sm">Outfit Options</p>
            <p className="text-text-muted text-xs mt-0.5">
              {keepSameClothes
                ? "Keep the same clothes from your photo"
                : "Get creative with the outfit"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOutfitToggle}
            disabled={isGenerating}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
              keepSameClothes ? 'bg-text-muted' : 'bg-accent-green',
              isGenerating && 'opacity-50 cursor-not-allowed'
            )}
            role="switch"
            aria-checked={!keepSameClothes}
            aria-label="Toggle creative outfit"
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                keepSameClothes ? 'translate-x-1' : 'translate-x-6'
              )}
            />
          </button>

          {/* No Photo Warning Popup */}
          <AnimatePresence>
            {showNoPhotoWarning && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2.5 bg-accent-green border-2 border-accent-green rounded-lg shadow-lg shadow-accent-green/30"
              >
                <p className="text-background text-sm font-medium whitespace-nowrap">
                  You haven't uploaded a photo yet
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Luscious Locks Mode - Easter Egg */}
        <AnimatePresence>
          {lusciousLocksUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="flex items-center justify-between p-4 rounded-lg border-2"
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                borderColor: 'rgb(255, 215, 0)',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
              }}
            >
              <div>
                <p className="font-medium text-sm" style={{ color: 'rgb(255, 215, 0)' }}>
                  Luscious Locks Mode Unlocked
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255, 215, 0, 0.8)' }}>
                  {lusciousLocksEnabled
                    ? "Give yourself long flowing luscious locks"
                    : "Use your boring ugly normal hair"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLusciousLocksEnabled(!lusciousLocksEnabled)}
                disabled={isGenerating}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                  isGenerating && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  backgroundColor: lusciousLocksEnabled ? 'rgb(255, 215, 0)' : 'rgb(107, 114, 128)',
                  boxShadow: lusciousLocksEnabled ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                }}
                role="switch"
                aria-checked={lusciousLocksEnabled}
                aria-label="Toggle luscious locks mode"
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    lusciousLocksEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aspect Ratio Selector - 2x2 grid on desktop, 1x4 on mobile */}
        <div className="relative">
          <h3 className="text-text-primary font-semibold mb-3 text-lg">
            Created Image Format
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {aspectRatioOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAspectRatioSelect(option.value)}
                disabled={isGenerating}
                className={cn(
                  'text-center px-4 py-3 rounded-lg transition-all border-2',
                  'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
                  aspectRatio === option.value
                    ? 'bg-accent-green/20 border-accent-green text-text-primary'
                    : 'bg-background-card border-background-input text-text-secondary hover:bg-background-input',
                  isGenerating && 'opacity-50 cursor-not-allowed'
                )}
                aria-pressed={aspectRatio === option.value}
              >
                <span className="block text-base font-bold">{option.ratio}</span>
                <span className="block text-xs mt-0.5">{option.description}</span>
              </button>
            ))}
          </div>

          {/* LinkedIn Warning Popup */}
          <AnimatePresence>
            {showLinkedInWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-4 py-2.5 bg-accent-purple border-2 border-accent-purple rounded-lg shadow-lg shadow-accent-purple/30"
              >
                <p className="text-white text-sm font-medium whitespace-nowrap">
                  LinkedIn? Really? Please don't.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image Quality Selector - Pro Mode */}
        <AnimatePresence>
          {isProModeUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary font-semibold text-lg">
                  Image Quality (Pro Mode)
                </h3>
                <span className="text-xs text-accent-green font-medium">Unlocked</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImageQuality('standard')}
                  disabled={isGenerating}
                  className={cn(
                    'text-center px-4 py-3 rounded-lg transition-all border-2',
                    'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
                    imageQuality === 'standard'
                      ? 'bg-accent-green/20 border-accent-green text-text-primary'
                      : 'bg-background-card border-background-input text-text-secondary hover:bg-background-input',
                    isGenerating && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-pressed={imageQuality === 'standard'}
                >
                  <span className="block text-base font-bold">Standard</span>
                  <span className="block text-xs mt-0.5">Fast & Free (Gemini 2.5 Flash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageQuality('pro')}
                  disabled={isGenerating}
                  className={cn(
                    'text-center px-4 py-3 rounded-lg transition-all border-2',
                    'focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background',
                    imageQuality === 'pro'
                      ? 'bg-accent-purple/20 border-accent-purple text-text-primary'
                      : 'bg-background-card border-background-input text-text-secondary hover:bg-background-input',
                    isGenerating && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-pressed={imageQuality === 'pro'}
                >
                  <span className="block text-base font-bold">Pro</span>
                  <span className="block text-xs mt-0.5">Higher Quality (Gemini 3 Pro)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.button
          onClick={handleGenerate}
          disabled={isButtonDisabled}
          whileHover={
            !isButtonDisabled
              ? {
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)',
                }
              : {}
          }
          whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
          className={cn(
            'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
            'bg-accent-green text-background',
            'shadow-lg shadow-accent-green/20',
            'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
            isButtonDisabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-busy={isGenerating}
        >
          {isGenerating
            ? 'Generating Photo Evidence...'
            : `Generate Photo Evidence for ${excuseLabel}`}
        </motion.button>

        {/* Generated Evidence */}
        <div>
          <h3 className="text-text-primary font-semibold mb-3 text-lg">
            Generated Evidence
          </h3>
          <ImageDisplay
            scenario={scenario}
            excuseText={excuseText}
            imageUrl={generatedImage}
            isLoading={isGenerating}
            accentColor={accentColor}
            excuseType={excuseType}
          />
          {generatedImage && !isGenerating && (
            <div className="mt-4 text-text-muted text-sm space-y-2">
              <p>Sometimes our photographic evidence creation team do a good job, and sometimes they don't.</p>
              <p>If you're not completely satisfied with your evidence, you could always spend a few years mastering photo editing yourself.</p>
              <p>Or, you could not be so guilty in the first place.</p>
            </div>
          )}
        </div>
      </div>

      {/* Safe Excuse Warning Modal */}
      <AnimatePresence>
        {showSafeExcuseWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setShowSafeExcuseWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-card rounded-card p-8 max-w-md w-full border-2 border-accent-purple shadow-2xl shadow-accent-purple/30"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">
                Seriously?
              </h3>
              <p className="text-text-secondary text-base mb-6 text-center leading-relaxed">
                You want to generate photo evidence for your <span className="text-accent-purple font-semibold">believable excuse</span>?
                <br /><br />
                This is technically possible, but I think you're missing the point! The risky excuse is where it's at! This is the bit that Nastino spent countless hours coding (countless minutes telling AI to code).
                <br /><br />
                Are you sure about this?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSafeExcuseWarning(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold bg-accent-green text-background hover:bg-accent-green/90 transition-colors shadow-lg shadow-accent-green/20"
                >
                  You're Right, I'll Try Risky
                </button>
                <button
                  onClick={handleGenerateAnyway}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold bg-text-muted/20 text-text-muted hover:bg-text-muted/30 transition-colors border border-text-muted/40"
                >
                  Generate Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
