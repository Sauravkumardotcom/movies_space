# Modern UI/UX Design Guide - MovieSpace

## 🎨 Visual Design System

### Color Palette

#### Primary Colors
```
Blue:   #3B82F6 - Primary actions, highlights
Cyan:   #06B6D4 - Secondary accents, complementary
```

#### Action Colors
```
Red:    #EF4444 - Favorites, danger, emphasis
Purple: #A855F7 - Premium actions, trailers
Yellow: #FBBF24 - IMDb links, highlights
```

#### Neutral Colors
```
Black:   #000000 - Primary background
Gray900: #111827 - Secondary surface
Gray800: #1F2937 - Tertiary surface
White:   #FFFFFF - Text, primary contrast
```

#### Semantic Colors
```
Success: #10B981 (Emerald) - Green badges
Warning: #F59E0B (Amber) - Yellow highlights
Error:   #EF4444 (Red) - Red states
Info:    #3B82F6 (Blue) - Information
```

### Typography

#### Font Stack
```
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
```

#### Sizing Scale
```
h1: 36px (text-4xl)  - Page titles
h2: 30px (text-3xl)  - Section titles
h3: 24px (text-2xl)  - Subsection titles
body: 16px (text-base) - Regular text
small: 14px (text-sm)  - Secondary text
tiny: 12px (text-xs)   - Caption text
```

#### Weight Scale
```
Regular: 400  - Body text
Medium:  500  - Default
Semibold: 600 - Emphasis
Bold: 700     - Headings
Black: 900    - Major headings
```

### Spacing System

```
1px (0.25rem)   - xs
8px (0.5rem)    - sm
12px (0.75rem)  - md
16px (1rem)     - lg
24px (1.5rem)   - xl
32px (2rem)     - 2xl
48px (3rem)     - 3xl
64px (4rem)     - 4xl
```

### Border Radius

```
4px (0.25rem)  - rounded (minimal)
8px (0.5rem)   - rounded-lg
12px (0.75rem) - rounded-xl (standard)
16px (1rem)    - rounded-2xl
9999px         - rounded-full (pills)
```

### Shadow System

```
sm:     0 1px 2px 0 rgba(0, 0, 0, 0.05)
base:   0 1px 3px 0 rgba(0, 0, 0, 0.1)
md:     0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg:     0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl:     0 20px 25px -5px rgba(0, 0, 0, 0.1)
2xl:    0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Opacity Scale

```
10%   - /10   - Very subtle backgrounds
20%   - /20   - Shadow tints, soft overlays
50%   - /50   - Medium overlays, borders
80%   - /80   - Dark overlays, strong effects
90%   - /90   - Very dark, near opaque
95%   - /95   - Nearly opaque
```

---

## 🎬 Component Examples

### Header Navigation
```jsx
// Premium styling:
bg-black/80 backdrop-blur-xl border-b border-white/5

// Search input:
bg-white/5 hover:bg-white/10 focus:ring-2 ring-blue-500/50

// Button styles:
bg-blue-600/80 hover:bg-blue-600
bg-red-600/80 hover:bg-red-600
bg-purple-600/80 hover:bg-purple-600
```

### MovieCard
```jsx
// Poster container:
rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20

// Rating badge:
bg-gradient-to-br from-emerald-500 to-teal-600  // >= 8.0
bg-gradient-to-br from-blue-500 to-cyan-600     // >= 7.0
bg-gradient-to-br from-orange-500 to-red-600    // < 7.0

// Overlay:
bg-gradient-to-t from-black via-black/40 to-transparent
```

### Buttons

#### Primary Button
```jsx
bg-blue-600 hover:bg-blue-700 text-white
px-4 py-2 rounded-lg font-semibold
transition-all duration-200
whileHover={{ scale: 1.05 }}
```

#### Secondary Button
```jsx
bg-gray-800/80 hover:bg-gray-700/90
text-white border border-white/20
px-4 py-2 rounded-lg font-semibold
```

#### Icon Button
```jsx
p-2 hover:bg-white/10 rounded-full
text-gray-400 hover:text-white
transition-colors duration-200
```

### Loading States (Skeleton)
```jsx
// Shimmer animation:
from-gray-800/50 via-gray-700/50 to-gray-800/50
duration: 2.5s // Premium slower animation

// Rounded:
rounded-xl  // Modern appearance
```

### Empty States
```jsx
// Icon:
text-6xl mb-6

// Title:
text-3xl font-bold text-white

// Description:
text-gray-400 text-lg

// CTA Button:
bg-blue-600 hover:bg-blue-700 text-white
px-6 py-3 rounded-lg font-semibold
```

---

## ✨ Animation Patterns

### Entrance Animation
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, delay: 0.1 }}
```

### Hover Effects
```jsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.2 }}
```

### Stagger Children
```jsx
variants={{
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
}}
```

### Smooth Transitions
```jsx
transition={{
  type: "spring",
  stiffness: 400,
  damping: 30
}}

// Or for standard timing:
transition={{
  duration: 0.3,
  ease: "easeOut"
}}
```

---

## 📱 Responsive Breakpoints

```
Mobile:     360px - 480px   (1 col)
Tablet:     481px - 768px   (2-3 cols)
Desktop:    769px - 1024px  (4 cols)
Large:      1025px - 1280px (5 cols)
XL:         1281px+         (5+ cols)
```

### Media Query Prefixes
```jsx
// Tailwind responsive prefixes:
sm:   @media (min-width: 640px)
md:   @media (min-width: 768px)
lg:   @media (min-width: 1024px)
xl:   @media (min-width: 1280px)
2xl:  @media (min-width: 1536px)
```

---

## 🎯 Design Principles

### 1. **Hierarchy**
- Largest element: Page title
- Secondary: Section headings
- Tertiary: Card titles
- Support: Descriptions, metadata
- Minimal: Captions, hints

### 2. **Contrast**
- White text on black background (WCAG AAA)
- Colored buttons stand out from background
- Hover states provide visual feedback
- Focus states clearly visible

### 3. **Consistency**
- Same button styles throughout
- Consistent spacing rhythm
- Uniform border radius
- Standard animation durations

### 4. **Accessibility**
- Touch targets >= 48px
- Color not only information carrier
- Sufficient contrast ratios
- Keyboard navigation support
- ARIA labels on interactive elements

### 5. **Performance**
- GPU-accelerated animations
- Smooth 60fps interactions
- Optimized images and assets
- Minimal layout shifts

---

## 🚀 Implementation Tips

### Do's ✅
```jsx
// ✅ Use theme colors
<div className="bg-blue-600">

// ✅ Consistent spacing
<div className="px-4 py-6 sm:px-6 md:px-8">

// ✅ Rounded corners for modern feel
className="rounded-xl"

// ✅ Smooth transitions
className="transition-all duration-200"

// ✅ Proper hierarchy
<h1 className="text-4xl font-bold">
<h2 className="text-3xl font-bold">
<p className="text-base">
```

### Don'ts ❌
```jsx
// ❌ Random colors
className="bg-orange-300"

// ❌ Inconsistent spacing
className="p-2 md:p-10"

// ❌ Sharp corners
className="rounded-none"

// ❌ No transitions
// (add transition for interactivity)

// ❌ Poor hierarchy
<p className="text-xs">Main Title</p>
```

---

## 🎨 Quick Reference

### Gradient Combinations
```jsx
// Premium Blue-Cyan
from-blue-600 to-cyan-600

// Warm Gold-Orange
from-yellow-400 to-orange-500

// Cool Purple-Pink
from-purple-600 to-pink-600

// Dark-to-darker
from-gray-900 via-black to-gray-900
```

### Common Class Combinations
```jsx
// Premium container:
rounded-xl bg-white/5 border border-white/10 p-6

// Modern button:
rounded-lg font-semibold transition-all duration-200 shadow-lg

// Smooth card:
rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300

// Premium overlay:
bg-gradient-to-b from-transparent via-black/50 to-black backdrop-blur-sm
```

---

## 📊 Design Tokens

### Defined in Tailwind
```js
// Colors: All standard Tailwind colors + opacity modifiers
// Spacing: 4px increments
// Border radius: 4px increments
// Shadows: Built-in shadow system
// Opacity: 5%, 10%, 20%, 25%, 50%, 75%, 80%, 90%, 95%
// Transitions: duration-100 to duration-1000
```

---

**Last Updated**: February 1, 2026  
**Version**: 1.0 - Modern Premium Design  
**Status**: ✅ Production Ready
