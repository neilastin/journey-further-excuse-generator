# Design Consistency Checklist

Quick reference for ensuring new image components match existing design patterns exactly.

---

## Color Usage Patterns

### From Existing Components

#### ExcuseForm.tsx - Input Fields
```typescript
// Textarea/Select base styling
className={cn(
  'w-full px-4 py-3 bg-background-input text-text-primary rounded-input border border-background-input',
  'placeholder:text-text-muted',
  'focus:outline-none',
  'input-glow',  // Custom utility in index.css
  formErrors.scenario && 'border-red-400',
  (isLoading || disabled) && 'opacity-50 cursor-not-allowed'
)}
```

#### ExcuseForm.tsx - Submit Button
```typescript
// Primary action button (GREEN - always green for primary actions)
className={cn(
  'w-full py-4 px-8 rounded-input font-bold text-lg transition-all duration-200',
  'bg-accent-green text-background',  // Green background, black text
  'shadow-lg shadow-accent-green/20',
  'focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background',
  (!isFormValid || isLoading || disabled) && 'opacity-50 cursor-not-allowed'
)}

// Framer Motion hover states
whileHover={
  isFormValid && !isLoading && !disabled
    ? {
        scale: 1.02,
        boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)",  // Green glow
      }
    : {}
}
whileTap={
  isFormValid && !isLoading && !disabled
    ? { scale: 0.98 }
    : {}
}
```

#### ExcuseCard.tsx - Secondary Buttons
```typescript
// Copy button (icon-only, subtle)
className={cn(
  'absolute top-4 right-4 p-2 rounded-lg transition-all duration-200',
  'bg-background-input/50 hover:bg-background-input',  // Semi-transparent to full opacity
  'text-text-secondary hover:text-text-primary',
  'focus:outline-none focus:ring-2 focus:ring-accent-green'
)}
```

#### ExcuseCard.tsx - Accent Color System
```typescript
const accentColorClasses = {
  blue: {
    border: 'border-accent-blue',
    glow: 'shadow-lg shadow-accent-blue/20',
    badge: 'bg-accent-blue/20 text-accent-blue',
    hoverShadow: '0 12px 40px rgba(0, 217, 255, 0.3)',
  },
  purple: {
    border: 'border-accent-purple',
    glow: 'shadow-lg shadow-accent-purple/20',
    badge: 'bg-accent-purple/20 text-accent-purple',
    hoverShadow: '0 12px 40px rgba(181, 123, 255, 0.3)',
  },
  green: {
    border: 'border-accent-green',
    glow: 'shadow-lg shadow-accent-green/20',
    badge: 'bg-accent-green/20 text-accent-green',
    hoverShadow: '0 12px 40px rgba(0, 255, 136, 0.3)',
  },
};

// Usage
const colorClasses = accentColorClasses[accentColor];

<motion.div
  className={cn(
    'relative bg-background-card rounded-card p-6 md:p-8 border-2',
    colorClasses.border,
    colorClasses.glow
  )}
>
```

---

## Animation Patterns

### From Existing Components

#### ExcuseCard.tsx - Card Entrance + Hover
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{
    y: -4,  // Subtle lift on hover
    boxShadow: colorClasses.hoverShadow,
  }}
  transition={{
    duration: 0.4,
    delay: index * CARD_STAGGER_DELAY,  // 0.1s stagger
    ease: "easeOut"
  }}
>
```

#### ExcuseCards.tsx - Tab Switching Animation
```typescript
<motion.div
  key={activeTab}  // Re-mount on tab change
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: -20 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 25,
  }}
>
```

#### LoadingAnimation.tsx - Spinner
```typescript
{/* Double-layer spinner with glow */}
<div className="relative">
  {/* Solid spinner */}
  <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-green border-t-transparent" />

  {/* Blurred glow layer */}
  <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-accent-green border-t-transparent blur-md opacity-50" />
</div>
```

#### LoadingAnimation.tsx - Text Rotation
```typescript
<AnimatePresence mode="wait">
  <motion.p
    key={messageIndex}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="mt-6 text-text-secondary text-lg text-center max-w-md font-medium"
  >
    {LOADING_MESSAGES[messageIndex]}
  </motion.p>
</AnimatePresence>
```

---

## Layout & Spacing Patterns

### From Existing Components

#### ExcuseCards.tsx - Section Container
```typescript
<section className="mt-12">  {/* Consistent vertical spacing between sections */}
  <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
    Your Excuses
  </h2>

  {/* Tab navigation */}
  <div className="flex justify-center gap-2 mb-8 max-w-2xl mx-auto">
    {/* Tabs */}
  </div>

  {/* Content */}
  <div className="max-w-3xl mx-auto">
    {/* ExcuseCard */}
  </div>
</section>
```

#### ExcuseForm.tsx - Form Structure
```typescript
<form className="space-y-6 bg-background-card p-6 md:p-8 rounded-card shadow-lg">
  {/* space-y-6 = 24px vertical spacing between form elements */}

  <div className="space-y-2">  {/* Label to input spacing */}
    <label className="text-text-primary font-medium mb-2 block">
      {variation.formLabels.situation}
    </label>
    <textarea />
    {formErrors.scenario && (
      <p className="text-red-400 text-sm mt-1">  {/* Error message spacing */}
        {formErrors.scenario}
      </p>
    )}
  </div>
</form>
```

#### ExcuseCard.tsx - Card Padding
```typescript
<div className="relative bg-background-card rounded-card p-6 md:p-8 border-2">
  {/* Mobile: 24px padding (p-6) */}
  {/* Desktop: 32px padding (p-8) */}
</div>
```

---

## Typography Patterns

### From Existing Components

#### Section Headings (Hero.tsx, ExcuseCards.tsx)
```typescript
// Main page title
<h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
  Not My Fault
</h1>

// Section headings
<h2 className="text-3xl font-bold text-text-primary text-center mb-8">
  Your Excuses
</h2>

// Subsection headings (for new components)
<h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
  Photo Evidence
</h2>
```

#### Body Text
```typescript
// Primary body text
<p className="text-text-primary text-base leading-relaxed whitespace-pre-line">
  {text}
</p>

// Secondary body text
<p className="text-text-secondary text-lg">
  Optional: Add your photo for personalised evidence
</p>

// Muted/helper text
<p className="text-text-muted text-sm">
  JPG or PNG, max 5MB
</p>
```

#### Badge/Label Text
```typescript
<span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-accent-blue/20 text-accent-blue">
  The Quantum Explanation
</span>
```

---

## Border & Shadow Patterns

### From Existing Components

#### Card Borders
```typescript
// Solid border with glow
<div className="border-2 border-accent-purple shadow-lg shadow-accent-purple/20" />

// Dashed border (for upload zones)
<div className="border-2 border-dashed border-text-muted/30" />

// Hover state
<div className="hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/20" />
```

#### Button Shadows
```typescript
// Resting state
'shadow-lg shadow-accent-green/20'

// Hover state (via Framer Motion)
boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)"

// Focus ring
'focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background'
```

---

## State Patterns

### From Existing Components

#### Disabled State
```typescript
className={cn(
  'base-classes',
  (isLoading || disabled) && 'opacity-50 cursor-not-allowed'
)}

disabled={!isFormValid || isLoading || disabled}
```

#### Error State
```typescript
// Input border
formErrors.scenario && 'border-red-400'

// Error message
{formErrors.scenario && (
  <p id="scenario-error" className="text-red-400 text-sm mt-1">
    {formErrors.scenario}
  </p>
)}

// Error container
<div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
  {errorMessage}
</div>
```

#### Success State
```typescript
// Copy success feedback (ExcuseCard.tsx)
{isCopied && (
  <p className="text-accent-green text-sm font-medium mt-2 flex items-center gap-1">
    <Check className="w-4 h-4" />
    Copied to clipboard!
  </p>
)}
```

#### Loading State
```typescript
aria-busy={isLoading}

{isLoading ? 'Generating...' : 'Generate Excuses'}
```

---

## Icon Patterns

### From Existing Components

#### Icon Sizes
```typescript
// Large (empty states)
<Camera className="w-16 h-16 text-text-muted" />

// Medium (empty states)
<Camera className="w-12 h-12 text-text-muted" />

// Small (buttons)
<Copy className="w-5 h-5" />

// Tiny (inline feedback)
<Check className="w-4 h-4" />
```

#### Icon Colors
```typescript
// Muted (empty states)
className="text-text-muted"

// Secondary (buttons, default)
className="text-text-secondary hover:text-text-primary"

// Accent (success states)
className="text-accent-green"

// Error
className="text-red-400"
```

---

## Responsive Patterns

### From Existing Components

#### Padding
```typescript
// Mobile: 24px, Desktop: 32px
className="p-6 md:p-8"

// Mobile: 24px, Desktop: 48px (section padding)
className="px-mobile md:px-desktop"  // Custom values from @theme

// Vertical spacing
className="py-8 md:py-12"
```

#### Text Sizing
```typescript
// Headings scale up on desktop
className="text-3xl md:text-4xl"
className="text-4xl md:text-6xl"

// Body text usually stays consistent
className="text-base"
className="text-lg"
```

#### Image/Component Sizing
```typescript
// Headshot preview (example for new components)
className="w-20 h-20 md:w-24 md:h-24"  // 80px mobile, 96px desktop
```

#### Container Max Widths
```typescript
// Form container
className="max-w-3xl mx-auto"  // 768px

// Section container
className="max-w-4xl mx-auto"  // 896px (for PhotoEvidence)

// Content container
className="max-w-7xl mx-auto"  // 1280px (full page)
```

---

## Accessibility Patterns

### From Existing Components

#### ARIA Attributes
```typescript
// Required state
required
aria-invalid={!!formErrors.scenario}
aria-describedby={formErrors.scenario ? 'scenario-error' : undefined}

// Loading state
aria-busy={isLoading}

// Button labels
aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}

// Tab buttons
aria-pressed={isActive}
aria-label={`Show ${label} excuse`}
```

#### Focus Management
```typescript
// Focus outline (always include)
'focus:outline-none focus:ring-2 focus:ring-accent-green'

// Focus offset for better visibility
'focus:ring-offset-2 focus:ring-offset-background'

// Container focus
'focus-within:outline-none'
```

---

## Constants & Values

### Animation Timing (from lib/constants.ts)
```typescript
export const COPY_SUCCESS_DURATION = 2000;  // 2s
export const CARD_STAGGER_DELAY = 0.1;      // 100ms
export const LOADING_MESSAGE_INTERVAL = 2000;  // 2s
```

### Usage in Components
```typescript
// Copy button success timeout
setTimeout(() => {
  setIsCopied(false);
}, COPY_SUCCESS_DURATION);

// Card entrance stagger
transition={{
  delay: index * CARD_STAGGER_DELAY,
}}
```

---

## Quick Reference: New Components

### HeadshotUpload
✓ Use dashed border like inputs: `border-2 border-dashed border-text-muted/30`
✓ Hover changes to green: `hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/20`
✓ With file: purple accent `border-accent-purple shadow-lg shadow-accent-purple/20`
✓ Disabled: `opacity-50 cursor-not-allowed`
✓ Icon: `Camera` from lucide-react, `w-12 h-12 text-text-muted`

### ImageDisplay
✓ 16:9 aspect ratio container: `style={{ aspectRatio: '16/9' }}`
✓ Empty state: dashed border matching HeadshotUpload
✓ Loading: double-layer spinner matching LoadingAnimation
✓ Accent color based on excuse type (blue/purple/green)
✓ Download button: matches ExcuseCard copy button pattern

### PhotoEvidence
✓ Section spacing: `mt-12` (matches ExcuseCards)
✓ Max width: `max-w-4xl` (896px)
✓ Heading: `text-3xl md:text-4xl font-bold`
✓ Generate button: EXACT match to ExcuseForm submit button
✓ Component spacing: 24px between elements (`mb-6`)

---

## Common Mistakes to Avoid

❌ **Don't** use `bg-accent-green` for card backgrounds (too bright)
✓ **Do** use `bg-accent-green/20` for badges/subtle backgrounds

❌ **Don't** use arbitrary shadow values
✓ **Do** use consistent pattern: `shadow-lg shadow-accent-green/20`

❌ **Don't** forget hover states on interactive elements
✓ **Do** add `hover:` variants for all buttons, cards, links

❌ **Don't** use different animation durations randomly
✓ **Do** use `duration-200` (0.2s) for hovers, `duration-300` (0.3s) for fades

❌ **Don't** use hardcoded colors like `#00ff88`
✓ **Do** use Tailwind variables: `accent-green`, `text-primary`, etc.

❌ **Don't** forget disabled states
✓ **Do** add `opacity-50 cursor-not-allowed` for disabled elements

❌ **Don't** skip focus indicators
✓ **Do** use `focus:ring-2 focus:ring-accent-green` pattern

❌ **Don't** forget mobile responsiveness
✓ **Do** test at 375px width and use responsive classes

❌ **Don't** use American English
✓ **Do** use British spelling: "personalised", "colour", "whilst"

---

## Final Verification

Before considering components complete, verify:

1. **Color Consistency**
   - [ ] All colors use Tailwind theme variables
   - [ ] Accent colors match excuse types (blue/purple/green)
   - [ ] Primary actions always use green
   - [ ] Text contrast meets WCAG AA

2. **Animation Consistency**
   - [ ] Hover animations use 0.2s duration
   - [ ] Fade animations use 0.3s duration
   - [ ] Framer Motion springs use default physics
   - [ ] No janky or slow animations

3. **Layout Consistency**
   - [ ] Section spacing uses `mt-12`
   - [ ] Component spacing uses `mb-6`
   - [ ] Card padding: `p-6 md:p-8`
   - [ ] Max widths match existing components

4. **Typography Consistency**
   - [ ] Headings use `font-bold`
   - [ ] Body text uses `text-base` or `text-lg`
   - [ ] Helper text uses `text-sm`
   - [ ] Line height uses `leading-relaxed`

5. **Accessibility**
   - [ ] All buttons have labels
   - [ ] All images have alt text
   - [ ] Focus indicators visible
   - [ ] Keyboard navigation works
   - [ ] ARIA attributes correct

6. **Responsive Design**
   - [ ] Works at 375px width (iPhone SE)
   - [ ] Works at 768px (tablet)
   - [ ] Works at 1440px (desktop)
   - [ ] Touch targets ≥ 44px on mobile

7. **State Management**
   - [ ] Disabled states styled correctly
   - [ ] Error states use red-400
   - [ ] Success states use accent-green
   - [ ] Loading states provide feedback

8. **British English**
   - [ ] All text uses British spelling
   - [ ] Tone matches existing components
   - [ ] Labels use formal language

---

This checklist is derived from actual component code in the "Not My Fault" application. Use it as a reference when implementing the new image generation components to ensure perfect design consistency.
