# Mobile-First Responsive Design Quick Reference

## Breakpoint Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TAILWIND BREAKPOINTS IN USE                         │
├─────────────────────────────────────────────────────────────────────────┤
│ DEFAULT  │ < 640px  │ Mobile phones, compact displays                  │
│ SM       │ ≥ 640px  │ Small tablets, landscape phones                  │
│ MD       │ ≥ 768px  │ Tablets, medium screens                          │
│ LG       │ ≥ 1024px │ Laptops, desktop screens                         │
│ XL       │ ≥ 1280px │ Large desktops, wide monitors                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsive Behavior

### HEADER
```
MOBILE (< 1024px)          │ DESKTOP (≥ 1024px)
───────────────────────    │ ──────────────────────────────
Logo + Icons (top)         │ Logo | Search | Tabs | Icon
Full-width Search          │ (All horizontal)
Tab icons only             │ Tab full labels
Horizontal scroll          │ Static tabs
Stacked layout             │ Flex layout
```

### MOVIE GRID
```
360px      640px      1024px      1280px+
─────      ─────      ──────      ────────
1 col  →  2 cols  →  3-4 cols  →  4-5 cols
(w-full) (sm:grid-cols-2) (md:grid-cols-3) (lg:grid-cols-4)
```

### MOVIE CARD
```
MOBILE (360px)          │ DESKTOP (1024px+)
─────────────────       │ ─────────────────
Aspect 1:1              │ Aspect 2:3
Overlay always on       │ Overlay on hover
Title below             │ Title in overlay
Touch feedback          │ Scale animation
Tap to select           │ Hover + tap
```

### SEARCH BAR
```
MOBILE                  │ DESKTOP
──────────              │ ────────
Full width              │ Constrained width
Larger padding          │ Responsive padding
Responsive icons        │ Standard icons
Touch-friendly buttons  │ Hover states
```

### MODAL
```
MOBILE (< 1024px)       │ DESKTOP (≥ 1024px)
──────────────────      │ ──────────────────
Fullscreen (h-screen)   │ Centered modal
Stacked layout          │ Side-by-side
Top close button        │ Top-right close
Safe zone padding       │ Standard padding
Full viewport scroll    │ Internal scroll
```

---

## Responsive CSS Patterns Used

### Pattern 1: Hide/Show by Breakpoint
```jsx
{/* Show on mobile only */}
<div className="sm:hidden">Mobile content</div>

{/* Show on desktop only */}
<div className="hidden sm:block">Desktop content</div>

{/* Different layouts */}
<div className="flex-col sm:flex-row">Content</div>
```

### Pattern 2: Responsive Sizing
```jsx
{/* Scales with breakpoints */}
<h1 className="text-2xl sm:text-3xl md:text-4xl">Title</h1>

{/* Responsive padding */}
<div className="p-4 sm:p-6 md:p-8">Content</div>

{/* Responsive gaps */}
<div className="gap-2 sm:gap-4 md:gap-6">Items</div>
```

### Pattern 3: Conditional Display
```jsx
{/* Mobile: 1 column, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-3">Cards</div>

{/* Mobile: stacked, Desktop: horizontal */}
<div className="flex flex-col md:flex-row">Items</div>
```

### Pattern 4: Aspect Ratios
```jsx
{/* Mobile: square, Desktop: 2:3 poster */}
<div className="aspect-square sm:aspect-[2/3]">Image</div>

{/* Responsive text size */}
<p className="text-xs sm:text-sm md:text-base">Text</p>
```

---

## Component Grid Layout

### SkeletonGrid Responsive
```
Mobile  (360px)     Tablet  (768px)     Desktop (1024px+)
1 column           2 columns           3-4 columns
```

**Tailwind Classes**:
```jsx
grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
```

### Movie Grid Responsive
```
360px:  1 col
640px:  2 cols
1024px: 3-4 cols
1280px: 4-5 cols
```

**Tailwind Classes**:
```jsx
grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
```

---

## Touch-Friendly Sizing

All interactive elements follow WCAG guidelines:

```
┌──────────────────────────────────────┐
│  TOUCH TARGET SIZES (Recommended)    │
├──────────────────────────────────────┤
│ Button/Icon: 44px × 44px (minimum)   │
│ Used in: Search buttons, close btn    │
│                                      │
│ Text links: 44px height (minimum)    │
│ Used in: Recent search buttons       │
│                                      │
│ Input field: 44px height (minimum)   │
│ Used in: Search input                │
└──────────────────────────────────────┘
```

**Implementation**:
```jsx
// Button with touch-friendly padding
<button className="p-2.5 sm:p-3">  {/* 40px-44px when padded */}
  Icon
</button>

// Input with proper height
<input className="py-2.5 sm:py-3" />  {/* 40px-44px height */}
```

---

## Spacing System

### Mobile First Spacing
```
Property         Mobile  Tablet  Desktop
────────────────────────────────────────
Header padding   p-3     p-4     p-6
Content padding  p-4     p-6     p-8
Card gap         gap-2   gap-3   gap-4
Section gap      gap-4   gap-6   gap-8
```

### Usage Examples
```jsx
// Responsive padding
<div className="p-4 sm:p-6 md:p-8">Content</div>

// Responsive gap
<div className="gap-2 sm:gap-4">Items</div>

// Responsive margin
<div className="mt-2 sm:mt-4 md:mt-6">Item</div>
```

---

## Typography Scaling

### Responsive Font Sizes
```
Element       Mobile      Tablet      Desktop
──────────────────────────────────────────────
H1 (Title)    text-2xl    text-3xl    text-4xl
H2 (Section)  text-xl     text-2xl    text-3xl
Body text     text-base   text-base   text-base
Small text    text-xs     text-sm     text-sm
Hint text     text-xs     text-xs     text-sm
```

### Implementation
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl">Title</h1>
<p className="text-sm sm:text-base">Body</p>
<span className="text-xs">Small</span>
```

---

## Color System

### Dark Mode Support
```
Light Mode          Dark Mode
──────────────────────────────────
bg-white       →    dark:bg-gray-900
text-gray-900  →    dark:text-white
border-gray-200→    dark:border-gray-800
bg-gray-100    →    dark:bg-gray-800
```

### Usage
```jsx
<div className="bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-white
                border border-gray-200 dark:border-gray-800">
  Content
</div>
```

---

## Animation Guidelines

### Responsive Animations
```
MOBILE                  DESKTOP
──────────              ────────
Subtle                  Pronounced
500ms-600ms             300ms-400ms
Reduced motion aware    Full effects
Tap feedback            Hover + tap
```

### Implementations
```jsx
// Responsive hover (desktop only)
<div className="hover:sm:scale-110">Desktop hover</div>

// Always available tap animation
<motion.button whileTap={{ scale: 0.95 }}>
  Tap me
</motion.button>
```

---

## Testing Checklist

### Breakpoint Testing
- [ ] 360px (iPhone SE)
- [ ] 640px (iPhone 14)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro / Laptop)
- [ ] 1440px (Desktop)

### Feature Testing per Breakpoint
```
┌─────────────────────────────────────────────┐
│         FEATURE VERIFICATION                │
├──────┬──────┬──────┬────────┬──────────────┤
│ 360  │ 640  │ 768  │ 1024   │ 1440+        │
├──────┼──────┼──────┼────────┼──────────────┤
│ ✓    │ ✓    │ ✓    │ ✓      │ ✓ Search     │
│ ✓    │ ✓    │ ✓    │ ✓      │ ✓ Grid       │
│ ✓    │ ✓    │ ✓    │ ✓      │ ✓ Modal      │
│ ✓    │ ✓    │ ✓    │ ✓      │ ✓ Header     │
│ ✓    │ ✓    │ ✓    │ ✓      │ ✓ Cards      │
└──────┴──────┴──────┴────────┴──────────────┘
```

### Mobile Specific
- [ ] No horizontal scroll
- [ ] Touch targets 44px+
- [ ] Modal fullscreen
- [ ] Header stacked
- [ ] Readable font (≥16px)

### Desktop Specific
- [ ] Hover animations work
- [ ] Modal centered
- [ ] Header horizontal
- [ ] Full labels visible
- [ ] Proper whitespace

---

## Device Size Reference

```
DEVICE CATEGORY       WIDTH    BREAKPOINT
──────────────────────────────────────────
iPhone SE (2022)      375px    default
iPhone 12/13/14       390-430px default
iPhone 14 Pro         430px    default
iPad (5th gen)        768px    md
iPad Air              820px    md/lg
iPad Pro 11"          1024px   lg
iPad Pro 12.9"        1366px   xl
MacBook Air 13"       1440px   xl
MacBook Pro 14"       1512px   xl
27" Monitor           2560px   2xl (custom)
```

---

## Performance Notes

✅ **Optimized for Mobile**
- Minimal CSS for breakpoints
- Efficient Tailwind purging
- No unused styles shipped
- Responsive images load appropriately sized
- Lazy loading enabled

✅ **No Layout Shift**
- Consistent spacing at breakpoints
- Proper aspect ratios
- Reserved space for content

✅ **Touch Optimized**
- 44px+ touch targets
- Tap feedback animations
- No hover-only content on mobile

---

## Common Responsive Patterns

### 1. Column to Row Transition
```jsx
// Mobile: column (stacked), Desktop: row (horizontal)
<div className="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

### 2. Hide/Show Elements
```jsx
// Show only on mobile
<div className="md:hidden">Mobile menu</div>

// Show only on desktop
<div className="hidden md:block">Desktop nav</div>
```

### 3. Responsive Grid
```jsx
// 1 col mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

### 4. Responsive Sizing
```jsx
// Size scales with viewport
<img className="w-full md:w-1/3" src={poster} />

// Text size scales
<h1 className="text-2xl md:text-4xl">Title</h1>
```

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs/responsive-design
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Mobile-First Design**: https://www.smashingmagazine.com/2009/04/designing-a-print-based-website/
- **Touch Targets**: https://www.smashingmagazine.com/2012/02/finger-friendly-design-ideal-mobile-touchscreen-target-sizes/

---

**Last Updated**: December 2024  
**Status**: Production Ready ✅
