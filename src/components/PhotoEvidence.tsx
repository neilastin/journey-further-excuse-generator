import { useState } from 'react';
import { motion } from 'framer-motion';
import HeadshotUpload from './HeadshotUpload';
import ImageDisplay from './ImageDisplay';
import { cn } from '@/lib/utils';

interface PhotoEvidenceProps {
  excuseText: string;
  excuseType: 'excuse1' | 'excuse2';
  accentColor: 'purple' | 'green';
  isGenerating: boolean;
  generatedImage: string | null;
  onGenerate: (headshotBase64?: string, headshotMimeType?: 'image/jpeg' | 'image/png') => void;
}

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
  excuseText,
  excuseType,
  accentColor,
  isGenerating,
  generatedImage,
  onGenerate,
}: PhotoEvidenceProps) {
  const [headshot, setHeadshot] = useState<HeadshotData | null>(null);

  const handleUpload = (file: File, base64: string, mimeType: 'image/jpeg' | 'image/png') => {
    setHeadshot({ file, base64, mimeType });
  };

  const handleRemove = () => {
    setHeadshot(null);
  };

  const handleGenerate = () => {
    if (headshot) {
      onGenerate(headshot.base64, headshot.mimeType);
    } else {
      onGenerate();
    }
  };

  const isButtonDisabled = isGenerating || !excuseText;
  const excuseLabel = excuseTypeLabels[excuseType];

  return (
    <section className="mt-16 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
          Photo Evidence
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Optional: Add your photo for personalised evidence
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload Controls */}
        <div className="space-y-6">
          {/* Headshot Upload */}
          <div>
            <h3 className="text-text-primary font-semibold mb-3 text-lg">
              Your Photo (Optional)
            </h3>
            <HeadshotUpload
              onUpload={handleUpload}
              onRemove={handleRemove}
              currentFile={headshot?.file || null}
              disabled={isGenerating}
            />
          </div>

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

          {/* Info Text */}
          {headshot ? (
            <p className="text-text-muted text-sm text-center">
              Your photo will be incorporated into the evidence image
            </p>
          ) : (
            <p className="text-text-muted text-sm text-center">
              Generate without a photo for generic evidence, or upload your photo for
              personalisation
            </p>
          )}
        </div>

        {/* Right Column: Image Display */}
        <div>
          <h3 className="text-text-primary font-semibold mb-3 text-lg">
            Generated Evidence
          </h3>
          <ImageDisplay
            imageUrl={generatedImage}
            isLoading={isGenerating}
            accentColor={accentColor}
            excuseType={excuseType}
          />
        </div>
      </div>
    </section>
  );
}
