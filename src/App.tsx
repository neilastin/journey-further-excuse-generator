import { useState, useRef, useCallback } from 'react';
import type { ExcusesResponse, GenerateImageResponse, CustomExcuseOptions } from '@/types';
import { getRandomVariation, type TaglineVariation } from '@/lib/taglineVariations';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ExcuseForm from '@/components/ExcuseForm';
import ExcuseCards from '@/components/ExcuseCards';
import ErrorMessage from '@/components/ErrorMessage';
import PhotoEvidence from '@/components/PhotoEvidence';
import Footer from '@/components/Footer';

function App() {
  // Tagline variation (selected on mount via lazy initializer - no need for useEffect)
  const [variation] = useState<TaglineVariation>(() => getRandomVariation());

  // Loading states
  const [isGeneratingExcuses, setIsGeneratingExcuses] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Generated content
  const [excuses, setExcuses] = useState<ExcusesResponse | null>(null);
  const [originalSituation, setOriginalSituation] = useState<string>('');
  const [imagesByExcuse, setImagesByExcuse] = useState<
    Record<'excuse1' | 'excuse2', string | null>
  >({
    excuse1: null,
    excuse2: null,
  });

  // UI state
  const [showExcuses, setShowExcuses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExcuseTab, setSelectedExcuseTab] = useState<'excuse1' | 'excuse2'>(
    'excuse1'
  ); // Default to 'believable' which maps to excuse1

  // Ref for scroll target
  const formRef = useRef<HTMLDivElement>(null);

  const generateExcuses = useCallback(async (data: {
    scenario: string;
    audience: string;
    customOptions?: CustomExcuseOptions;
  }) => {
    try {
      setIsGeneratingExcuses(true);
      setError(null);
      setShowExcuses(false);
      setOriginalSituation(data.scenario); // Store for image generation

      const response = await fetch('/api/generate-excuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate excuses');
      }

      const excusesData: ExcusesResponse = await response.json();
      setExcuses(excusesData);
      setShowExcuses(true);

      // Reset images when new excuses are generated
      setImagesByExcuse({
        excuse1: null,
        excuse2: null,
      });
    } catch (err) {
      console.error('Error generating excuses:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate excuses. Please try again.'
      );
    } finally {
      setIsGeneratingExcuses(false);
    }
  }, []);

  const generateImage = useCallback(async (
    excuseType: 'excuse1' | 'excuse2',
    headshotBase64?: string,
    headshotMimeType?: 'image/jpeg' | 'image/png',
    keepSameClothes: boolean = true,
    aspectRatio: string = '16:9',
    lusciousLocks: boolean = false
  ) => {
    if (!excuses) return;

    setIsGeneratingImage(true);
    setError(null);

    try {
      const excuse = excuses[excuseType];
      // Use 'Observational' style for excuse1 (believable), actual style for excuse2 (risky)
      const styleToUse = excuseType === 'excuse1' ? 'Observational' : excuses.comedicStyle;

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excuseText: excuse.text,
          comedicStyle: styleToUse,
          headshotBase64,
          headshotMimeType,
          originalSituation,
          keepSameClothes,
          aspectRatio,
          lusciousLocks,
          excuseFocus: excuses.excuseFocus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data: GenerateImageResponse = await response.json();
      setImagesByExcuse((prev) => ({ ...prev, [excuseType]: data.imageUrl }));
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [excuses, originalSituation]);

  const handleTabChange = useCallback((excuseType: 'excuse1' | 'excuse2') => {
    setSelectedExcuseTab(excuseType);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Header />

      <main className="pt-28">
        <Hero variation={variation} />

        <div ref={formRef} className="max-w-form mx-auto px-mobile md:px-desktop">
          <ExcuseForm
            onSubmit={generateExcuses}
            isLoading={isGeneratingExcuses}
          />

          {showExcuses && excuses && (
            <>
              <ExcuseCards
                excuses={excuses}
                isVisible={showExcuses}
                onTabChange={handleTabChange}
              />

              <PhotoEvidence
                excuseText={excuses[selectedExcuseTab].text}
                excuseType={selectedExcuseTab}
                accentColor={
                  selectedExcuseTab === 'excuse1'
                    ? 'purple'
                    : 'green'
                }
                isGenerating={isGeneratingImage}
                generatedImage={imagesByExcuse[selectedExcuseTab]}
                onGenerate={(headshotBase64, headshotMimeType, keepSameClothes, aspectRatio, lusciousLocks) =>
                  generateImage(selectedExcuseTab, headshotBase64, headshotMimeType, keepSameClothes, aspectRatio, lusciousLocks)
                }
              />

              {error && <ErrorMessage message={error} />}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
