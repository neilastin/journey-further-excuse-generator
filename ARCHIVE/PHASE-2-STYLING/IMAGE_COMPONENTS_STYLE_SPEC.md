# Image Generation Components - Style Specification

This document provides exact styling specifications for the three new image generation components to ensure they match the existing "Not My Fault" design system seamlessly.

---

## Design System Reference

### Color Palette (from src/index.css)
```css
--color-background: #0a0a0a;          /* Deep black background */
--color-background-card: #1a1a1a;      /* Card backgrounds */
--color-background-input: #2a2a2a;     /* Input/interactive backgrounds */

--color-accent-green: #00ff88;         /* Primary action color */
--color-accent-blue: #00d9ff;          /* Technical excuse accent */
--color-accent-purple: #b57bff;        /* Believable excuse accent */

--color-text-primary: #ffffff;         /* Primary text */
--color-text-secondary: #a0a0a0;       /* Secondary text */
--color-text-muted: #666666;           /* Muted/disabled text */
```

### Spacing Scale
```css
--spacing-mobile: 24px;    /* Mobile padding */
--spacing-desktop: 48px;   /* Desktop padding */
```

### Border Radius
```css
--radius-card: 12px;      /* Cards, sections */
--radius-input: 8px;      /* Inputs, buttons */
```

### Animation Timing
- Hover/tap transitions: `duration-200` (0.2s)
- Fade-in animations: `duration-300` (0.3s)
- Framer Motion springs: Default spring physics

### Typography
- Font family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Headings: Bold weight, white color
- Body text: `text-base` (16px), `leading-relaxed` line height

---

## Component 1: HeadshotUpload

### Purpose
Allows users to upload their photo for personalized excuse images.

### Container Styling

**Base State**:
```typescript
className={cn(
  'relative w-full rounded-card bg-background-card border-2 border-dashed border-text-muted/30',
  'p-8 transition-all duration-200',
  'focus-within:outline-none'
)}
```

**Hover State** (when not disabled):
```typescript
'hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/20'
```

**With File Uploaded**:
```typescript
'border-solid border-accent-purple shadow-lg shadow-accent-purple/20'
```

**Disabled State**:
```typescript
'opacity-50 cursor-not-allowed'
```

**Drag Active State**:
```typescript
'border-accent-green bg-accent-green/5 shadow-lg shadow-accent-green/30'
```

### Framer Motion Wrapper
```typescript
<motion.div
  whileHover={!disabled ? { scale: 1.01 } : {}}
  transition={{ duration: 0.2 }}
  className={/* container classes */}
>
```

### Empty State (No File)

**Icon**:
```typescript
<Camera className="w-12 h-12 text-text-muted mb-3" />
```

**Primary Text**:
```typescript
<p className="text-text-primary text-lg font-medium mb-1">
  Drag & drop your photo or click to browse
</p>
```

**Secondary Text**:
```typescript
<p className="text-text-secondary text-sm">
  JPG or PNG, max 5MB
</p>
```

**Layout**:
```typescript
<div className="flex flex-col items-center justify-center text-center py-4">
  {/* Icon + Text */}
</div>
```

### Preview State (With File)

**Preview Container**:
```typescript
<div className="flex items-center gap-4">
  {/* Thumbnail + File Info + Remove Button */}
</div>
```

**Thumbnail**:
```typescript
<div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
  <img
    src={previewUrl}
    alt="Uploaded headshot preview"
    className="w-full h-full object-cover rounded-lg"
  />
</div>
```

**File Info**:
```typescript
<div className="flex-1 min-w-0">
  <p className="text-text-primary font-medium truncate">
    {fileName}
  </p>
  <p className="text-text-secondary text-sm">
    {fileSize}
  </p>
</div>
```

**Remove Button**:
```typescript
<button
  onClick={handleRemove}
  className={cn(
    'p-2 rounded-lg transition-all duration-200',
    'bg-background-input/50 hover:bg-red-500/20',
    'text-text-secondary hover:text-red-400',
    'focus:outline-none focus:ring-2 focus:ring-red-400'
  )}
  aria-label="Remove photo"
>
  <X className="w-5 h-5" />
</button>
```

### Error State

**Container**:
```typescript
<div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
  <p className="text-red-400 text-sm flex items-center gap-2">
    <AlertCircle className="w-4 h-4" />
    {errorMessage}
  </p>
</div>
```

---

## Component 2: ImageDisplay

### Purpose
Displays the generated excuse image with loading and error states.

### Container Styling

**16:9 Aspect Ratio Container**:
```typescript
<div
  className="relative w-full rounded-card bg-background-card overflow-hidden"
  style={{ aspectRatio: '16/9' }}
>
```

### Empty State (No Image Generated Yet)

```typescript
<div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-text-muted/30 px-6 py-12">
  <Camera className="w-16 h-16 text-text-muted mb-4" />
  <p className="text-text-secondary text-lg text-center">
    Your photo evidence will appear here
  </p>
</div>
```

### Loading State

**Spinner + Text (matching LoadingAnimation pattern)**:
```typescript
<div className="flex flex-col items-center justify-center h-full px-6 py-12">
  {/* Spinner with glow effect */}
  <div className="relative mb-6">
    <div className={cn(
      'animate-spin rounded-full h-16 w-16 border-4 border-t-transparent',
      accentColor === 'green' && 'border-accent-green',
      accentColor === 'blue' && 'border-accent-blue',
      accentColor === 'purple' && 'border-accent-purple'
    )} />
    <div className={cn(
      'absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-t-transparent blur-md opacity-50',
      accentColor === 'green' && 'border-accent-green',
      accentColor === 'blue' && 'border-accent-blue',
      accentColor === 'purple' && 'border-accent-purple'
    )} />
  </div>

  <p className="text-text-secondary text-lg text-center">
    Generating your photo evidence...
  </p>
</div>
```

### Image Loaded State

**Framer Motion Wrapper**:
```typescript
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
      accentColor === 'green' && 'hover:shadow-accent-green/30 focus:ring-accent-green',
      accentColor === 'blue' && 'hover:shadow-accent-blue/30 focus:ring-accent-blue',
      accentColor === 'purple' && 'hover:shadow-accent-purple/30 focus:ring-accent-purple'
    )}
    aria-label="Download image"
    title="Download image"
  >
    <Download className="w-5 h-5" />
  </button>
</motion.div>
```

**Subtle Glow Effect on Container** (based on excuse type):
```typescript
className={cn(
  'relative w-full rounded-card bg-background-card overflow-hidden',
  accentColor === 'green' && 'shadow-lg shadow-accent-green/10',
  accentColor === 'blue' && 'shadow-lg shadow-accent-blue/10',
  accentColor === 'purple' && 'shadow-lg shadow-accent-purple/10'
)}
```

### Error State

```typescript
<div className="flex flex-col items-center justify-center h-full px-6 py-12">
  <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
  <p className="text-text-primary font-medium mb-2">
    Image generation failed
  </p>
  <p className="text-text-secondary text-sm text-center">
    {errorMessage}
  </p>
</div>
```

---

## Component 3: PhotoEvidence

### Purpose
Container component that orchestrates headshot upload, image generation trigger, and image display.

### Section Container

```typescript
<section className="w-full max-w-4xl mx-auto px-mobile md:px-desktop py-8 md:py-12">
  {/* Content */}
</section>
```

### Section Header

**Matches Hero component heading style**:
```typescript
<div className="mb-8">
  <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
    Photo Evidence
  </h2>
  <p className="text-text-secondary text-lg">
    Optional: Add your photo for personalised evidence
  </p>
</div>
```

### Generate Button

**MUST match ExcuseForm submit button exactly**:
```typescript
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
  whileTap={
    !isGenerating && excuseText
      ? { scale: 0.98 }
      : {}
  }
  className={cn(
    'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
    'bg-accent-green text-background',
    'shadow-lg shadow-accent-green/20',
    'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
    (isGenerating || !excuseText) && 'opacity-50 cursor-not-allowed'
  )}
  aria-busy={isGenerating}
>
  {isGenerating ? 'Generating...' : 'Generate Photo Evidence'}
</motion.button>
```

**Button Text Variants** (based on context):
- Default: "Generate Photo Evidence"
- With excuse type: `Generate Photo Evidence for ${excuseTypeLabel}`
- Loading: "Generating..."

**Excuse Type Labels**:
- `technical` → "Technical Excuse"
- `believable` → "Believable Excuse"
- `outrageous` → "Outrageous Excuse"

### Layout Spacing

```typescript
<section className="w-full max-w-4xl mx-auto px-mobile md:px-desktop py-8 md:py-12">
  {/* Header */}
  <div className="mb-8">
    <h2>Photo Evidence</h2>
    <p>Optional: Add your photo...</p>
  </div>

  {/* Headshot Upload */}
  <div className="mb-6">
    <HeadshotUpload />
  </div>

  {/* Generate Button */}
  <div className="mb-6">
    <motion.button>Generate Photo Evidence</motion.button>
  </div>

  {/* Image Display */}
  <div>
    <ImageDisplay />
  </div>
</section>
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- Padding: `px-mobile` (24px)
- Headshot preview: 80px × 80px
- Smaller text sizes: `text-base` → `text-sm` for secondary text
- Full-width buttons

### Desktop (≥ 768px)
- Padding: `px-desktop` (48px)
- Headshot preview: 96px × 96px
- Larger text sizes: `text-lg` for headers
- Max width: 896px (matches ExcuseCards container)

---

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators must be visible and clear (using `focus:ring-2`)
- Logical tab order

### ARIA Attributes
- `aria-label` for icon-only buttons
- `aria-busy` for loading states
- `aria-describedby` for error messages
- `alt` text for images

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal text)
- Focus indicators must be visible against all backgrounds
- Error states use red-400 (#f87171) for sufficient contrast

### Screen Readers
- Descriptive button labels ("Remove photo", "Download image")
- Status updates for loading states
- Error messages properly associated with inputs

---

## Animation Patterns

### Entrance Animations
```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}
```

### Hover Animations
```typescript
whileHover={{ scale: 1.01 }}
transition={{ duration: 0.2 }}
```

### Button Interactions
```typescript
whileHover={{
  scale: 1.02,
  boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)"
}}
whileTap={{ scale: 0.98 }}
```

### Loading Spinner
- Use double-layered spinner (solid + blurred layer)
- Continuous rotation with `animate-spin`
- Glow effect matches excuse type accent color

---

## Import Requirements

### Required Imports
```typescript
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Camera,
  X,
  Download,
  AlertCircle,
  Check
} from 'lucide-react';
```

### Icon Sizing Guide
- Large icons (empty states): `w-16 h-16`
- Medium icons (empty states): `w-12 h-12`
- Small icons (buttons): `w-5 h-5`
- Tiny icons (inline feedback): `w-4 h-4`

---

## Color Variant Logic

### Accent Color Mapping
```typescript
const accentColorClasses = {
  blue: {
    border: 'border-accent-blue',
    glow: 'shadow-lg shadow-accent-blue/20',
    spinner: 'border-accent-blue',
    hoverShadow: '0 12px 40px rgba(0, 217, 255, 0.3)',
  },
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/20',
    spinner: 'border-accent-purple',
    hoverShadow: '0 12px 40px rgba(181, 123, 255, 0.3)',
  },
  green: {
    border: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/20',
    spinner: 'border-accent-green',
    hoverShadow: '0 12px 40px rgba(0, 255, 136, 0.3)',
  },
};
```

### Usage Pattern
```typescript
const colorClasses = accentColorClasses[accentColor];

<div className={cn(
  'base-classes',
  colorClasses.border,
  colorClasses.glow
)} />
```

---

## File Size Formatting

### Example Helper Function
```typescript
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

---

## Validation Rules

### Headshot Upload
- **Allowed formats**: JPEG, PNG
- **Max size**: 5MB
- **Recommended dimensions**: 512×512 or larger (square preferred)
- **Error messages** (British English):
  - "Please upload a JPG or PNG file"
  - "File size must be under 5MB"
  - "Failed to upload image. Please try again"

### Image Generation
- **Required**: At least one excuse must be generated before image generation
- **Optional**: Headshot upload is optional
- **Error messages**:
  - "Please generate excuses first"
  - "Image generation failed. Please try again"
  - "Unable to connect to image service"

---

## Integration with Existing Components

### Props from Parent (App.tsx)
```typescript
interface PhotoEvidenceProps {
  excuseText: string;        // Currently selected excuse text
  excuseType: 'technical' | 'believable' | 'outrageous';
  accentColor: 'blue' | 'purple' | 'green';
  isVisible: boolean;        // Only show after excuses are generated
}
```

### When to Show PhotoEvidence
- Only render after `ExcusesResponse` exists
- Position: Below `ExcuseCards` component
- Spacing: `mt-12` (matches spacing between sections)

---

## Testing Checklist

Before finalizing components, verify:

- [ ] All Tailwind classes exist in custom theme
- [ ] Hover states work smoothly on desktop
- [ ] Focus indicators are visible for keyboard navigation
- [ ] Mobile layout works at 375px width
- [ ] Dark theme contrast is sufficient
- [ ] Animations don't feel janky (60fps)
- [ ] Error states display correctly
- [ ] Loading states provide clear feedback
- [ ] File upload accepts correct formats
- [ ] File size validation works
- [ ] Image download functionality works
- [ ] Accent colors match excuse types
- [ ] Button text matches context
- [ ] British English spelling ("personalised" not "personalized")
- [ ] All icons imported from lucide-react
- [ ] cn() utility used for all className management
- [ ] ARIA labels provide context for screen readers

---

## Example Full Component Structure

### PhotoEvidence.tsx
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

  if (!isVisible) return null;

  const excuseTypeLabels = {
    technical: 'Technical Excuse',
    believable: 'Believable Excuse',
    outrageous: 'Outrageous Excuse',
  };

  const handleGenerate = async () => {
    // Implementation
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-mobile md:px-desktop py-8 md:py-12">
      {/* Header */}
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

This specification ensures perfect design consistency with the existing "Not My Fault" application. All styling decisions are based on actual patterns from ExcuseForm, ExcuseCards, ExcuseCard, and LoadingAnimation components.
