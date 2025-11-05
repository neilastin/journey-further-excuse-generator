# Visual Style Comparison Guide

Quick visual reference showing how new components match existing design patterns.

---

## Side-by-Side Pattern Comparison

### PRIMARY BUTTON PATTERN

**Existing: ExcuseForm Submit Button**
```typescript
<motion.button
  className="
    w-full py-4 px-8 rounded-input font-bold text-lg
    bg-accent-green text-background
    shadow-lg shadow-accent-green/20
    focus:outline-none focus:ring-2 focus:ring-accent-green
    focus:ring-offset-2 focus:ring-offset-background
  "
  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)" }}
  whileTap={{ scale: 0.98 }}
>
  Generate Excuses
</motion.button>
```

**New: PhotoEvidence Generate Button**
```typescript
<motion.button
  className="
    w-full py-4 px-8 rounded-input font-bold text-lg
    bg-accent-green text-background
    shadow-lg shadow-accent-green/20
    focus:outline-none focus:ring-2 focus:ring-accent-green
    focus:ring-offset-2 focus:ring-offset-background
  "
  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)" }}
  whileTap={{ scale: 0.98 }}
>
  Generate Photo Evidence
</motion.button>
```

✓ **Match**: 100% identical styling

---

### CARD CONTAINER PATTERN

**Existing: ExcuseCard Component**
```typescript
<motion.div
  className="
    relative bg-background-card rounded-card
    p-6 md:p-8
    border-2 border-accent-purple
    shadow-lg shadow-accent-purple/20
  "
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(181, 123, 255, 0.3)' }}
/>
```

**New: HeadshotUpload with File**
```typescript
<motion.div
  className="
    relative bg-background-card rounded-card
    p-8
    border-2 border-solid border-accent-purple
    shadow-lg shadow-accent-purple/20
  "
  whileHover={{ scale: 1.01 }}
  transition={{ duration: 0.2 }}
/>
```

✓ **Match**: Same colors, radius, padding, shadows
⚠ **Difference**: Hover animation (scale vs lift) - intentional for upload UX

---

### ICON BUTTON PATTERN

**Existing: ExcuseCard Copy Button**
```typescript
<button
  className="
    absolute top-4 right-4 p-2 rounded-lg
    bg-background-input/50 hover:bg-background-input
    text-text-secondary hover:text-text-primary
    focus:outline-none focus:ring-2 focus:ring-accent-green
    transition-all duration-200
  "
>
  <Copy className="w-5 h-5" />
</button>
```

**New: ImageDisplay Download Button**
```typescript
<button
  className="
    absolute top-4 right-4 p-3 rounded-lg
    bg-background-card/80 backdrop-blur-sm
    text-text-secondary hover:text-text-primary
    focus:outline-none focus:ring-2 focus:ring-accent-green
    shadow-lg
    transition-all duration-200
  "
>
  <Download className="w-5 h-5" />
</button>
```

✓ **Match**: Same position, size, focus ring, icon size
⚠ **Difference**: Background (transparent vs blurred) - intentional for image overlay

---

### LOADING SPINNER PATTERN

**Existing: LoadingAnimation Component**
```typescript
<div className="relative">
  <div className="
    animate-spin rounded-full h-16 w-16
    border-4 border-accent-green border-t-transparent
  " />
  <div className="
    absolute inset-0
    animate-spin rounded-full h-16 w-16
    border-4 border-accent-green border-t-transparent
    blur-md opacity-50
  " />
</div>
```

**New: ImageDisplay Loading State**
```typescript
<div className="relative">
  <div className="
    animate-spin rounded-full h-16 w-16
    border-4 border-accent-blue border-t-transparent
  " />
  <div className="
    absolute inset-0
    animate-spin rounded-full h-16 w-16
    border-4 border-accent-blue border-t-transparent
    blur-md opacity-50
  " />
</div>
```

✓ **Match**: 100% identical structure
⚠ **Difference**: Color varies by excuse type (blue/purple/green) - intentional feature

---

### EMPTY STATE PATTERN

**Existing: (New pattern for upload components)**
```typescript
<div className="
  flex flex-col items-center justify-center
  border-2 border-dashed border-text-muted/30
  px-6 py-12
">
  <Camera className="w-12 h-12 text-text-muted mb-3" />
  <p className="text-text-primary text-lg font-medium">
    Drag & drop your photo or click to browse
  </p>
  <p className="text-text-secondary text-sm">
    JPG or PNG, max 5MB
  </p>
</div>
```

**New: ImageDisplay Empty State**
```typescript
<div className="
  flex flex-col items-center justify-center h-full
  border-2 border-dashed border-text-muted/30
  px-6 py-12
">
  <Camera className="w-16 h-16 text-text-muted mb-4" />
  <p className="text-text-secondary text-lg text-center">
    Your photo evidence will appear here
  </p>
</div>
```

✓ **Match**: Same border style, padding, icon pattern
⚠ **Difference**: Icon size (12 vs 16) - contextual sizing for larger container

---

### ERROR MESSAGE PATTERN

**Existing: ExcuseForm Error**
```typescript
<p className="text-red-400 text-sm mt-1">
  {formErrors.scenario}
</p>
```

**New: HeadshotUpload Error**
```typescript
<div className="
  p-3 rounded-lg
  bg-red-500/10
  border border-red-500/30
">
  <p className="text-red-400 text-sm flex items-center gap-2">
    <AlertCircle className="w-4 h-4" />
    {error}
  </p>
</div>
```

✓ **Match**: Same red color (#f87171)
⚠ **Difference**: Container styling (inline vs boxed) - better visibility for upload errors

---

### SECTION HEADER PATTERN

**Existing: ExcuseCards Section**
```typescript
<h2 className="text-3xl font-bold text-text-primary text-center mb-8">
  Your Excuses
</h2>
```

**Existing: Hero Component**
```typescript
<h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
  Not My Fault
</h1>
<p className="text-xl md:text-2xl text-text-secondary mb-2">
  {tagline.line1}
</p>
```

**New: PhotoEvidence Header**
```typescript
<h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
  Photo Evidence
</h2>
<p className="text-text-secondary text-lg">
  Optional: Add your photo for personalised evidence
</p>
```

✓ **Match**: Follows Hero's two-line pattern (heading + description)
✓ **Match**: Responsive text sizing (scales up on desktop)
✓ **Match**: Text hierarchy (primary + secondary colors)

---

## Color Usage Chart

### Accent Colors by Context

| Component | State | Color | Usage |
|-----------|-------|-------|-------|
| Primary Actions | All | Green (#00ff88) | Generate buttons, focus rings |
| Technical Excuse | Content | Blue (#00d9ff) | Spinner, borders, glows |
| Believable Excuse | Content | Purple (#b57bff) | Spinner, borders, glows |
| Outrageous Excuse | Content | Green (#00ff88) | Spinner, borders, glows |
| Upload Zone | With File | Purple (#b57bff) | Border, glow (matches believable) |
| Upload Zone | Hover | Green (#00ff88) | Border, glow (matches primary) |
| Error States | All | Red (#f87171) | Text, borders, backgrounds |
| Success States | All | Green (#00ff88) | Check icons, feedback text |

### Background Colors by Element

| Element | Color | Hex | Opacity |
|---------|-------|-----|---------|
| Page background | background | #0a0a0a | 100% |
| Card background | background-card | #1a1a1a | 100% |
| Input background | background-input | #2a2a2a | 100% |
| Button overlay | background-card | #1a1a1a | 80% (with backdrop blur) |
| Badge background | accent-* | Various | 20% |
| Error background | red-500 | #ef4444 | 10% |
| Drag active | accent-green | #00ff88 | 5% |

### Text Colors by Hierarchy

| Level | Color | Hex | Use Case |
|-------|-------|-----|----------|
| Primary | text-primary | #ffffff | Headings, body text, labels |
| Secondary | text-secondary | #a0a0a0 | Descriptions, helper text |
| Muted | text-muted | #666666 | Placeholders, disabled text |
| Error | red-400 | #f87171 | Error messages |
| Success | accent-green | #00ff88 | Success feedback |

---

## Spacing Consistency

### Vertical Spacing Scale

```
Between major sections:        mt-12  (48px)
After section headers:         mb-8   (32px)
Between components in section: mb-6   (24px)
Form field groups:            space-y-6 (24px)
Label to input:               space-y-2 (8px)
Related elements:             space-y-3 (12px)
Error messages:                mt-1   (4px)
Icon to text:                  mb-3/mb-4 (12-16px)
```

### Horizontal Spacing Scale

```
Section padding (mobile):     px-mobile (24px)
Section padding (desktop):    px-desktop (48px)
Card padding (mobile):        p-6 (24px)
Card padding (desktop):       p-8 (32px)
Button padding:               px-8 py-4 (32px × 16px)
Icon button padding:          p-2 or p-3 (8px or 12px)
Empty state padding:          px-6 py-12 (24px × 48px)
```

### Container Max Widths

```
Page container:               max-w-7xl  (1280px)
Form container:               max-w-3xl  (768px)
PhotoEvidence section:        max-w-4xl  (896px)
Tab container:                max-w-2xl  (672px)
Loading message text:         max-w-md   (448px)
```

---

## Border & Shadow Patterns

### Border Styles

```typescript
// Solid accent border (cards)
"border-2 border-accent-{color}"

// Dashed muted border (empty states)
"border-2 border-dashed border-text-muted/30"

// Error border
"border border-red-500/30"
```

### Shadow Patterns

```typescript
// Resting shadow (cards, buttons)
"shadow-lg shadow-accent-{color}/20"

// Hover shadow (buttons via Framer Motion)
boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)"  // Green
boxShadow: "0 12px 40px rgba(0, 217, 255, 0.3)"  // Blue
boxShadow: "0 12px 40px rgba(181, 123, 255, 0.3)"  // Purple

// Subtle image glow
"shadow-lg shadow-accent-{color}/10"
```

### Border Radius

```typescript
"rounded-card"   // 12px - Cards, sections
"rounded-input"  // 8px - Buttons, inputs
"rounded-lg"     // 8px - Small elements
"rounded-full"   // 9999px - Badges, pills
```

---

## Typography Scale

### Headings

```typescript
// Page title (Hero)
"text-4xl md:text-6xl font-bold text-text-primary"

// Section headings
"text-3xl font-bold text-text-primary"
"text-3xl md:text-4xl font-bold text-text-primary"  // Responsive

// Card titles (badges)
"text-sm font-semibold"
```

### Body Text

```typescript
// Primary body
"text-base leading-relaxed"  // 16px, relaxed line height

// Large body
"text-lg"  // 18px

// Description text
"text-text-secondary text-lg"

// Small text
"text-sm"  // 14px

// Helper/muted text
"text-text-muted text-sm"
```

### Font Weights

```
bold = 700 (headings, buttons)
semibold = 600 (badges, labels)
medium = 500 (emphasized body text)
normal = 400 (default body text)
```

---

## Animation Timing Reference

### Durations (ms)

```typescript
200ms  // Hover transitions (buttons, cards)
300ms  // Fade-in/out animations
400ms  // Card entrance animations
2000ms // Success feedback duration
2000ms // Loading message rotation interval
```

### Easing Functions

```typescript
"ease-out"  // Card entrances
"easeOut"   // Framer Motion (same as ease-out)
Spring (stiffness: 300, damping: 25)  // Tab switching
Default spring  // Button interactions
```

### Transform Values

```typescript
scale: 1.02  // Button hover
scale: 0.98  // Button tap
scale: 1.01  // Card hover (upload zones)
y: -4        // Card lift on hover
y: 20        // Initial entrance position
```

---

## Responsive Behavior

### Breakpoint: 768px (md:)

**Below 768px (Mobile)**:
- Padding: `px-mobile` (24px), `p-6` (24px cards)
- Text: `text-3xl` headings, `text-base` body
- Images: 80px × 80px thumbnails
- Single column layouts
- Smaller spacing between sections

**Above 768px (Desktop)**:
- Padding: `px-desktop` (48px), `p-8` (32px cards)
- Text: `text-4xl` / `text-6xl` headings, `text-lg` body
- Images: 96px × 96px thumbnails
- Multi-column where appropriate
- Larger spacing for visual breathing room

---

## Visual Verification Checklist

When components are implemented, verify these visual details:

### Colors
- [ ] Green buttons match ExcuseForm submit button exactly
- [ ] Accent colors (blue/purple/green) match ExcuseCard borders
- [ ] Error red matches ExcuseForm error text
- [ ] Text colors follow hierarchy (primary > secondary > muted)

### Spacing
- [ ] Section spacing (48px) matches gap between ExcuseForm and ExcuseCards
- [ ] Card padding (24px/32px) matches ExcuseCard
- [ ] Button padding matches ExcuseForm submit button
- [ ] Icon-to-text gaps feel consistent

### Typography
- [ ] Section headings match ExcuseCards "Your Excuses"
- [ ] Body text size matches ExcuseCard text
- [ ] Font weights match (bold headings, medium/normal body)

### Borders & Shadows
- [ ] Dashed borders match opacity/color of empty states
- [ ] Solid borders match ExcuseCard accent borders
- [ ] Shadows have same blur/spread as ExcuseCard glows
- [ ] Border radius feels consistent (12px cards, 8px buttons)

### Animations
- [ ] Button hover feels same as ExcuseForm button
- [ ] Loading spinner identical to LoadingAnimation
- [ ] Fade-in timing matches ExcuseCard entrance
- [ ] No janky or slow animations (all 60fps)

### Responsive
- [ ] Padding scales correctly at 768px breakpoint
- [ ] Text sizes scale at breakpoint
- [ ] Layout doesn't break at 375px (iPhone SE)
- [ ] Works smoothly up to 1440px desktop

---

## Common Visual Issues to Avoid

❌ **Different green shades** - Always use `accent-green` (#00ff88)
❌ **Inconsistent shadows** - Use the exact shadow patterns above
❌ **Arbitrary spacing** - Use the spacing scale (multiples of 4px)
❌ **Wrong text colors** - Use theme variables, not hardcoded hex
❌ **Missing hover states** - All interactive elements need hover feedback
❌ **Slow animations** - Keep to 200-400ms, never over 500ms
❌ **Inconsistent border radius** - Use `rounded-card` or `rounded-input`
❌ **Wrong font weights** - Bold for headings, normal for body

---

This visual comparison ensures the new components will blend seamlessly with the existing "Not My Fault" design. When in doubt, reference the existing components side-by-side.
