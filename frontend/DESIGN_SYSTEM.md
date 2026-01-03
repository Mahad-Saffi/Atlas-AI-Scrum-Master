# Ideal Assistant - Design System Documentation

## Overview

This document outlines the design system and styling guidelines for the Ideal Assistant application.

## 🎨 Color Palette

### Background Colors

- **Primary Background**: `#0a0a0f` - Main dark background
- **Glass Morphism**: `rgba(17, 17, 24, 0.7)` - Semi-transparent cards with blur
- **Card Background**: `rgba(17, 17, 24, 0.95)` - Solid cards

### Brand Colors

- **Primary Red**: `#dc2626` - Main accent color (used for "Assistant" text)
- **Dark Red**: `#991b1b` - Gradient end, hover states
- **Red Gradient**: `linear-gradient(135deg, #dc2626, #991b1b)`

### Text Colors

- **Primary Text**: `#f1f5f9` - Main text, "Ideal" text
- **Secondary Text**: `#94a3b8` - Descriptions, labels
- **Tertiary Text**: `#64748b` - Muted text
- **White**: `#ffffff` - Pure white for emphasis

### Status Colors

- **Success/Done**: `#22c55e` (Green)
- **Warning/In Progress**: `#f59e0b` (Orange)
- **Error/High Risk**: `#ef4444` (Red)
- **Info/Medium**: `#3b82f6` (Blue)
- **Neutral/Low**: `#64748b` (Gray)

## 📐 Spacing System

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  12px  (0.75rem)
lg:  16px  (1rem)
xl:  20px  (1.25rem)
2xl: 24px  (1.5rem)
3xl: 32px  (2rem)
4xl: 48px  (3rem)
5xl: 64px  (4rem)
```

## 🔤 Typography

### Font Family

- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Monospace**: `'Fira Code', 'Courier New', monospace`

### Font Sizes

```
xs:   12px  (0.75rem)
sm:   14px  (0.875rem)
base: 15px  (0.9375rem)
md:   16px  (1rem)
lg:   18px  (1.125rem)
xl:   20px  (1.25rem)
2xl:  24px  (1.5rem)
3xl:  28px  (1.75rem)
4xl:  36px  (2.25rem)
```

### Font Weights

- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## 🎯 Component Styles

### Buttons

#### Primary Button (Red Gradient)

```css
background: linear-gradient(135deg, #dc2626, #991b1b)
color: #ffffff
padding: 0.75rem 1.5rem
border-radius: 12px
font-size: 0.9375rem
font-weight: 600
box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4)
```

#### Secondary Button

```css
background: rgba(255, 255, 255, 0.05)
color: #f1f5f9
padding: 0.75rem 1.25rem
border-radius: 12px
border: 1px solid rgba(255, 255, 255, 0.1)
```

#### Back Button

```css
background: rgba(220, 38, 38, 0.15)
color: #dc2626
padding: 0.75rem 1.25rem
border-radius: 12px
border: 1px solid rgba(220, 38, 38, 0.3)
```

### Cards

#### Glass Morphism Card

```css
background: rgba(17, 17, 24, 0.7)
backdrop-filter: blur(16px)
border: 1px solid rgba(255, 255, 255, 0.08)
border-radius: 20px
padding: 2rem
```

#### Solid Card

```css
background: rgba(17, 17, 24, 0.95)
backdrop-filter: blur(16px)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 20px
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
```

### Header

```css
background: rgba(17, 17, 24, 0.85)
backdrop-filter: blur(20px)
border-bottom: 1px solid rgba(255, 255, 255, 0.08)
padding: 1.25rem 2rem
position: sticky
top: 0
z-index: 100
```

### Input Fields

```css
background: rgba(255, 255, 255, 0.05)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 12px
color: #f1f5f9
padding: 0.875rem 1rem
font-size: 0.9375rem
```

### Select Dropdown

```css
background: rgba(17, 17, 24, 0.95)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 12px
color: #f1f5f9
padding: 0.75rem 1.25rem
```

## 🎭 Effects

### Backdrop Blur

- **Small**: `blur(10px)`
- **Medium**: `blur(16px)`
- **Large**: `blur(20px)`

### Transitions

- **Fast**: `all 0.15s ease`
- **Normal**: `all 0.2s ease`
- **Slow**: `all 0.3s ease`

### Shadows

```css
sm:  0 2px 8px rgba(0, 0, 0, 0.2)
md:  0 4px 16px rgba(0, 0, 0, 0.3)
lg:  0 8px 32px rgba(0, 0, 0, 0.4)
xl:  0 12px 40px rgba(0, 0, 0, 0.5)
red: 0 4px 16px rgba(220, 38, 38, 0.4)
```

### Grid Pattern Background

```css
background-image:
  linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
background-size: 50px 50px
```

## 🎨 Branding

### Logo Text

- **"Ideal"**: White (`#f1f5f9`)
- **"Assistant"**: Red (`#dc2626`)

### Usage Example

```tsx
<span style={{ color: "#f1f5f9" }}>Ideal</span>{" "}
<span style={{ color: "#dc2626" }}>Assistant</span>
```

## 📊 Status & Risk Indicators

### Task Status

- **To Do**: Gray (`#64748b`)
- **In Progress**: Orange (`#f59e0b`)
- **Done**: Green (`#22c55e`)

### Risk Levels

- **High**: Red (`#ef4444`)
- **Medium**: Orange (`#f59e0b`)
- **Low**: Green (`#22c55e`)

## 🔧 Border Radius

```
sm:   8px
md:   12px
lg:   16px
xl:   20px
2xl:  24px
full: 50%
```

## 📱 Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1400px
```

## 🎯 Z-Index Scale

```
background: 0
content:    1
dropdown:   10
sticky:     100
modal:      1000
tooltip:    2000
```

## 💡 Usage Guidelines

### Do's ✅

- Use glass morphism effects for cards and overlays
- Apply red accent (`#dc2626`) for primary actions and branding
- Use consistent spacing from the spacing system
- Apply backdrop blur for depth and hierarchy
- Use Inter font family throughout
- Maintain consistent border radius (12px for buttons, 20px for cards)

### Don'ts ❌

- Don't use emojis - use Heroicons instead
- Don't mix different shades of red outside the defined palette
- Don't use arbitrary spacing values
- Don't create cards without glass morphism effects
- Don't use different font families
- Don't use sharp corners (0px border radius)

## 🎨 Icon System

- **Library**: Heroicons (24px solid)
- **Size**: 16px-24px depending on context
- **Color**: Inherit from parent or use theme colors

## 📦 Implementation

Import the theme configuration:

```typescript
import theme from "@/styles/theme";
```

Use theme values:

```typescript
const buttonStyle = {
  background: theme.colors.brand.redGradient,
  color: theme.colors.text.white,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.md,
};
```

## 🔄 Updates

Last updated: December 2024
Version: 1.0.0
