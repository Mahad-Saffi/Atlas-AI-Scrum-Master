# Atlas AI - Hand-Drawn Design System

## 🎨 Design Philosophy
A minimal, hand-drawn aesthetic that makes AI interaction feel friendly, approachable, and fun. Think of it as a digital sketchbook where ideas come to life.

## 📐 Core Principles

### 1. Simplicity
- Clean white backgrounds
- Minimal color palette
- Focus on content, not decoration

### 2. Playfulness
- Hand-drawn borders and shadows
- Emoji icons for personality
- Friendly, conversational tone

### 3. Clarity
- High contrast (black on white)
- Clear visual hierarchy
- Readable typography

## 🎨 Color System

```css
/* Primary Colors */
--paper-white: #fefefe;    /* Main background - clean paper */
--ink-black: #1a1a1a;      /* Text and borders - pen ink */

/* Secondary Colors */
--sketch-gray: #4a4a4a;    /* Secondary text - pencil */
--light-gray: #f5f5f5;     /* Secondary backgrounds - light paper */

/* Accent Colors */
--accent-blue: #2563eb;    /* Focus states - highlighter */
```

## ✏️ Typography

### Font Stack
```css
font-family: "Segoe Print", "Comic Sans MS", "Bradley Hand", cursive, sans-serif;
```

### Type Scale
```css
/* Headers */
--text-6xl: 56px;  /* Page titles */
--text-5xl: 48px;  /* Section headers */
--text-4xl: 42px;  /* Sub-headers */
--text-3xl: 32px;  /* Card titles */
--text-2xl: 28px;  /* Large text */
--text-xl: 24px;   /* Medium headers */

/* Body */
--text-lg: 18px;   /* Large body */
--text-base: 16px; /* Body text */
--text-sm: 14px;   /* Small text */
--text-xs: 12px;   /* Tiny text */
```

## 📦 Components

### Buttons
```css
/* Hand-drawn button */
.hand-drawn-btn {
  background: white;
  border: 2-3px solid #1a1a1a;
  padding: 12px 24px;
  font-weight: bold;
  box-shadow: 4px 4px 0 #1a1a1a;
  transition: all 0.2s ease;
}

.hand-drawn-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1a1a1a;
}

.hand-drawn-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1a1a1a;
}
```

### Cards
```css
/* Hand-drawn card */
.hand-drawn-card {
  background: white;
  border: 3px solid #1a1a1a;
  box-shadow: 6-8px 6-8px 0 #1a1a1a;
  padding: 20-40px;
}

/* With corner decorations */
.card-corner {
  position: absolute;
  width: 20-30px;
  height: 20-30px;
  border: 3px solid #1a1a1a;
  background: #fefefe;
}
```

### Inputs
```css
/* Hand-drawn input */
.hand-drawn-input {
  border: 2px solid #1a1a1a;
  background: white;
  padding: 12px 16px;
  box-shadow: 2px 2px 0 #4a4a4a;
}

.hand-drawn-input:focus {
  border-color: #2563eb;
  box-shadow: 3px 3px 0 #2563eb;
  outline: none;
}
```

### Chat Bubbles
```css
/* Speech bubble */
.chat-bubble {
  padding: 14px 18px;
  border: 2px solid #1a1a1a;
  background: white;
  box-shadow: 4px 4px 0 #1a1a1a;
  position: relative;
}

/* User message */
.chat-bubble.user {
  background: #f5f5f5;
  margin-left: auto;
}

/* AI message */
.chat-bubble.ai {
  background: white;
  margin-right: auto;
}
```

## 🎭 Decorative Elements

### SVG Lines
```jsx
/* Hand-drawn decorative line */
<svg width="200" height="20">
  <path
    d="M 10 10 Q 50 5, 100 10 T 190 10"
    stroke="#1a1a1a"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
  />
</svg>
```

### Corner Decorations
```jsx
/* Top-left corner */
<div style={{
  position: 'absolute',
  top: '-3px',
  left: '-3px',
  width: '30px',
  height: '30px',
  border: '3px solid #1a1a1a',
  borderRight: 'none',
  borderBottom: 'none',
  backgroundColor: '#fefefe',
}} />
```

### Dashed Borders
```css
/* For secondary elements */
border: 2px dashed #1a1a1a;
```

## 🎬 Animations

### Slide In
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Bounce In
```css
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Spin
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 😊 Emoji System

### Navigation & Actions
- ✨ Create/New
- 📋 Tasks/Board
- 🎉 Success/Celebration
- 🔄 Refresh/Reload
- ← Back/Return

### Status Indicators
- 📝 To Do
- ⚡ In Progress
- ✅ Done/Complete
- ⏳ Loading/Processing
- 📭 Empty

### User & AI
- 👤 User
- 🤖 AI/Bot
- 👋 Welcome/Greeting

### Communication
- 📤 Send
- 💬 Message
- 💡 Tip/Idea

### System
- 🔍 Search/Debug
- 🎫 Token/Ticket
- 🗑️ Delete/Clear
- 🔐 Authentication
- 🧪 Test/Experiment
- ▶️ Run/Execute

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack columns */
  /* Reduce padding */
  /* Smaller fonts */
}

/* Tablet */
@media (max-width: 1024px) {
  /* Adjust grid layouts */
  /* Medium padding */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full layouts */
  /* Maximum widths */
}
```

## ♿ Accessibility

### Contrast Ratios
- Text on white: 13.5:1 (AAA)
- Gray text on white: 9.5:1 (AAA)

### Focus States
- Visible focus indicators
- Blue accent for focus (#2563eb)
- Keyboard navigation support

### Semantic HTML
- Proper heading hierarchy
- ARIA labels where needed
- Alt text for images

## 🎯 Usage Guidelines

### DO ✅
- Use consistent spacing (multiples of 4px)
- Keep borders 2-3px thick
- Use offset shadows (4-8px)
- Add emoji for personality
- Maintain high contrast
- Use playful, friendly copy

### DON'T ❌
- Use rounded corners (keep sharp)
- Use gradients or complex effects
- Overuse animations
- Use too many colors
- Make text too small
- Use formal, corporate language

## 📦 Component Library

### Button Variants
1. **Primary**: White bg, black border, shadow
2. **Disabled**: 50% opacity, no hover
3. **Loading**: Spinning icon, disabled state

### Card Variants
1. **Standard**: 3px border, 6px shadow
2. **Large**: 3px border, 8px shadow, corners
3. **Dashed**: 2px dashed border, no shadow

### Input Variants
1. **Default**: 2px border, 2px shadow
2. **Focus**: Blue border, 3px blue shadow
3. **Error**: Red border, red shadow

## 🚀 Performance

### Optimization Tips
- Use system fonts (no web fonts)
- Minimize animations
- Use CSS transforms (GPU accelerated)
- Avoid complex shadows
- Keep DOM simple

## 📚 Resources

### Inspiration
- Hand-drawn UI kits
- Sketch-style design systems
- Playful SaaS products

### Tools
- Figma for mockups
- CSS for implementation
- SVG for decorative elements

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Status**: ✅ Complete
