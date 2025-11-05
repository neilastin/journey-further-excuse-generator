# Image Components - Ready-to-Use Code Templates

Copy-paste these exact patterns to match the existing design system.

---

## HeadshotUpload Component Template

### Full Component Structure

```typescript
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeadshotUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HeadshotUpload({ onFileSelect, disabled = false }: HeadshotUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG or PNG file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be under 5MB';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(file);
    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [disabled, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="space-y-3">
      <motion.div
        whileHover={!disabled ? { scale: 1.01 } : {}}
        transition={{ duration: 0.2 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative w-full rounded-card bg-background-card border-2 transition-all duration-200',
          'p-8',
          'focus-within:outline-none',
          file
            ? 'border-solid border-accent-purple shadow-lg shadow-accent-purple/20'
            : 'border-dashed border-text-muted/30',
          !file && !disabled && 'hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/20',
          isDragActive && !disabled && 'border-accent-green bg-accent-green/5 shadow-lg shadow-accent-green/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          id="headshot-upload"
          accept="image/jpeg,image/png"
          onChange={handleFileInput}
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? 'headshot-error' : undefined}
        />

        {!file ? (
          // Empty State
          <label
            htmlFor="headshot-upload"
            className={cn(
              'flex flex-col items-center justify-center text-center py-4',
              !disabled && 'cursor-pointer'
            )}
          >
            <Camera className="w-12 h-12 text-text-muted mb-3" />
            <p className="text-text-primary text-lg font-medium mb-1">
              Drag & drop your photo or click to browse
            </p>
            <p className="text-text-secondary text-sm">
              JPG or PNG, max 5MB
            </p>
          </label>
        ) : (
          // Preview State
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
              <img
                src={previewUrl!}
                alt="Uploaded headshot preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-text-primary font-medium truncate">
                {file.name}
              </p>
              <p className="text-text-secondary text-sm">
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              onClick={handleRemove}
              disabled={disabled}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'bg-background-input/50 hover:bg-red-500/20',
                'text-text-secondary hover:text-red-400',
                'focus:outline-none focus:ring-2 focus:ring-red-400',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Remove photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <div
          id="headshot-error"
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
        >
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## ImageDisplay Component Template

### Full Component Structure

```typescript
import { motion } from 'framer-motion';
import { Camera, Download, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  accentColor: 'blue' | 'purple' | 'green';
}

const accentColorClasses = {
  blue: {
    spinner: 'border-accent-blue',
    glow: 'shadow-lg shadow-accent-blue/10',
    buttonHover: 'hover:shadow-accent-blue/30',
    focusRing: 'focus:ring-accent-blue',
  },
  purple: {
    spinner: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/10',
    buttonHover: 'hover:shadow-accent-purple/30',
    focusRing: 'focus:ring-accent-purple',
  },
  green: {
    spinner: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/10',
    buttonHover: 'hover:shadow-accent-green/30',
    focusRing: 'focus:ring-accent-green',
  },
};

export default function ImageDisplay({ imageUrl, isLoading, error, accentColor }: ImageDisplayProps) {
  const colorClasses = accentColorClasses[accentColor];

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `excuse-evidence-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full rounded-card bg-background-card overflow-hidden',
        imageUrl && colorClasses.glow
      )}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Empty State */}
      {!imageUrl && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-text-muted/30 px-6 py-12">
          <Camera className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-text-secondary text-lg text-center">
            Your photo evidence will appear here
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12">
          {/* Double-layer spinner with glow */}
          <div className="relative mb-6">
            <div
              className={cn(
                'animate-spin rounded-full h-16 w-16 border-4 border-t-transparent',
                colorClasses.spinner
              )}
            />
            <div
              className={cn(
                'absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-t-transparent blur-md opacity-50',
                colorClasses.spinner
              )}
            />
          </div>

          <p className="text-text-secondary text-lg text-center">
            Generating your photo evidence...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <p className="text-text-primary font-medium mb-2">
            Image generation failed
          </p>
          <p className="text-text-secondary text-sm text-center max-w-md">
            {error}
          </p>
        </div>
      )}

      {/* Image Loaded State */}
      {imageUrl && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <img
            src={imageUrl}
            alt="Generated excuse scenario"
            className="w-full h-full object-cover"
          />

          {/* Download Button Overlay */}
          <button
            onClick={handleDownload}
            className={cn(
              'absolute top-4 right-4 p-3 rounded-lg transition-all duration-200',
              'bg-background-card/80 backdrop-blur-sm',
              'text-text-secondary hover:text-text-primary',
              'shadow-lg',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
              colorClasses.buttonHover,
              colorClasses.focusRing
            )}
            aria-label="Download image"
            title="Download image"
          >
            <Download className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
```

---

## PhotoEvidence Component Template

### Full Component Structure

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeadshotUpload from './HeadshotUpload';
import ImageDisplay from './ImageDisplay';

interface PhotoEvidenceProps {
  excuseText: string;
  excuseType: 'technical' | 'believable' | 'outrageous';
  accentColor: 'blue' | 'purple' | 'green';
  isVisible: boolean;
}

const excuseTypeLabels = {
  technical: 'Technical Excuse',
  believable: 'Believable Excuse',
  outrageous: 'Outrageous Excuse',
};

export default function PhotoEvidence({
  excuseText,
  excuseType,
  accentColor,
  isVisible,
}: PhotoEvidenceProps) {
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('excuseText', excuseText);
      formData.append('excuseType', excuseType);

      if (headshotFile) {
        formData.append('headshot', headshotFile);
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image generation failed');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-mobile md:px-desktop py-8 md:py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          Photo Evidence
        </h2>
        <p className="text-text-secondary text-lg">
          Optional: Add your photo for personalised evidence
        </p>
      </div>

      {/* Headshot Upload */}
      <div className="mb-6">
        <HeadshotUpload
          onFileSelect={setHeadshotFile}
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !excuseText}
          whileHover={
            !isGenerating && excuseText
              ? {
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)",
                }
              : {}
          }
          whileTap={!isGenerating && excuseText ? { scale: 0.98 } : {}}
          className={cn(
            'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
            'bg-accent-green text-background',
            'shadow-lg shadow-accent-green/20',
            'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
            (isGenerating || !excuseText) && 'opacity-50 cursor-not-allowed'
          )}
          aria-busy={isGenerating}
        >
          {isGenerating
            ? 'Generating...'
            : `Generate Photo Evidence for ${excuseTypeLabels[excuseType]}`}
        </motion.button>
      </div>

      {/* Image Display */}
      <div>
        <ImageDisplay
          imageUrl={imageUrl}
          isLoading={isGenerating}
          error={error}
          accentColor={accentColor}
        />
      </div>
    </section>
  );
}
```

---

## Integration with App.tsx

### State Management

Add to `App.tsx`:

```typescript
import PhotoEvidence from './components/PhotoEvidence';

// Inside App component, add state
const [selectedExcuseForImage, setSelectedExcuseForImage] = useState<{
  text: string;
  type: 'technical' | 'believable' | 'outrageous';
  accentColor: 'blue' | 'purple' | 'green';
} | null>(null);

// After ExcuseCards component is rendered, set selected excuse
useEffect(() => {
  if (excuses) {
    // Default to believable excuse
    setSelectedExcuseForImage({
      text: excuses.excuse2.text,
      type: 'believable',
      accentColor: 'purple',
    });
  }
}, [excuses]);
```

### Component Placement

In `App.tsx` render method:

```typescript
return (
  <div className="min-h-screen bg-background">
    <Header />

    <main className="container mx-auto px-mobile md:px-desktop">
      <Hero variation={variation} />

      <ExcuseForm
        variation={variation}
        onSubmit={handleGenerateExcuses}
        isLoading={isGenerating}
      />

      {error && <ErrorMessage message={error} />}

      <LoadingAnimation isLoading={isGenerating} />

      <ExcuseCards
        excuses={excuses}
        isVisible={!isGenerating && excuses !== null}
      />

      {/* PhotoEvidence Component - Add below ExcuseCards */}
      {selectedExcuseForImage && (
        <PhotoEvidence
          excuseText={selectedExcuseForImage.text}
          excuseType={selectedExcuseForImage.type}
          accentColor={selectedExcuseForImage.accentColor}
          isVisible={!isGenerating && excuses !== null}
        />
      )}
    </main>
  </div>
);
```

---

## TypeScript Type Definitions

Add to `src/types/index.ts`:

```typescript
export interface HeadshotUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  accentColor: 'blue' | 'purple' | 'green';
}

export interface PhotoEvidenceProps {
  excuseText: string;
  excuseType: 'technical' | 'believable' | 'outrageous';
  accentColor: 'blue' | 'purple' | 'green';
  isVisible: boolean;
}

export interface ImageGenerationRequest {
  excuseText: string;
  excuseType: string;
  headshot?: File;
}

export interface ImageGenerationResponse {
  imageUrl: string;
}
```

---

## Tailwind Classes Quick Reference

### Container Classes (Copy-Paste)

```typescript
// Section container (PhotoEvidence)
"w-full max-w-4xl mx-auto px-mobile md:px-desktop py-8 md:py-12"

// Card container (HeadshotUpload)
"relative w-full rounded-card bg-background-card border-2 border-dashed border-text-muted/30 p-8 transition-all duration-200"

// Image container (ImageDisplay)
"relative w-full rounded-card bg-background-card overflow-hidden"

// Empty state container
"flex flex-col items-center justify-center h-full border-2 border-dashed border-text-muted/30 px-6 py-12"
```

### Button Classes (Copy-Paste)

```typescript
// Primary action button (Generate)
"w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200 bg-accent-green text-background shadow-lg shadow-accent-green/20 focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background"

// Icon button (Download, Remove)
"p-2 rounded-lg transition-all duration-200 bg-background-input/50 hover:bg-background-input text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green"

// Icon button (Remove - with red hover)
"p-2 rounded-lg transition-all duration-200 bg-background-input/50 hover:bg-red-500/20 text-text-secondary hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
```

### Text Classes (Copy-Paste)

```typescript
// Section heading
"text-3xl md:text-4xl font-bold text-text-primary mb-2"

// Section description
"text-text-secondary text-lg"

// Primary body text
"text-text-primary text-lg font-medium"

// Secondary body text
"text-text-secondary text-sm"

// Muted text
"text-text-muted text-sm"

// Error text
"text-red-400 text-sm"
```

### Icon Classes (Copy-Paste)

```typescript
// Large icon (empty state)
"w-16 h-16 text-text-muted"

// Medium icon (empty state)
"w-12 h-12 text-text-muted"

// Small icon (button)
"w-5 h-5"

// Tiny icon (inline)
"w-4 h-4"
```

### Spacing Classes (Copy-Paste)

```typescript
// Section spacing
"mt-12"  // Between major sections (matches ExcuseCards)

// Component spacing
"mb-6"   // Between components within section
"mb-8"   // After section headers
"space-y-3"  // Between related elements (upload + error)

// Internal padding
"p-6 md:p-8"  // Card padding
"px-6 py-12"  // Empty state padding
"px-mobile md:px-desktop"  // Section horizontal padding
```

---

## Accessibility Checklist

Copy-paste this checklist to component comments:

```typescript
/**
 * Accessibility Requirements:
 * - [ ] All interactive elements keyboard accessible
 * - [ ] Focus indicators visible (focus:ring-2)
 * - [ ] ARIA labels on icon-only buttons
 * - [ ] Error messages use aria-describedby
 * - [ ] Loading states use aria-busy
 * - [ ] Alt text on images
 * - [ ] Color contrast meets WCAG AA (4.5:1)
 * - [ ] Touch targets ≥ 44px on mobile
 * - [ ] Logical tab order
 * - [ ] Screen reader friendly labels
 */
```

---

## Common Pattern Reference

### File Upload Pattern
```typescript
// Input (hidden)
<input
  type="file"
  id="headshot-upload"
  accept="image/jpeg,image/png"
  onChange={handleFileInput}
  disabled={disabled}
  className="sr-only"  // Accessible but hidden
/>

// Label (visible, clickable)
<label
  htmlFor="headshot-upload"
  className="cursor-pointer"
>
  {/* Visual upload area */}
</label>
```

### Drag & Drop Pattern
```typescript
onDrop={handleDrop}
onDragOver={handleDragOver}
onDragLeave={handleDragLeave}

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();  // Required!
  setIsDragActive(true);
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();  // Required!
  setIsDragActive(false);
  const file = e.dataTransfer.files[0];
  // Handle file
};
```

### File Reader Pattern
```typescript
const reader = new FileReader();
reader.onloadend = () => {
  setPreviewUrl(reader.result as string);
};
reader.readAsDataURL(file);
```

### Download Pattern
```typescript
const handleDownload = async () => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `filename-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
```

---

These templates are ready to use and match the existing "Not My Fault" design system exactly. Copy-paste and customize as needed.
