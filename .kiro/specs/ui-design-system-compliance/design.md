# Design Document

## Overview

This design document outlines the approach for updating the Atlas AI Scrum Master frontend to achieve full compliance with the established design system. The implementation will systematically replace all emoji usage with Heroicons and ensure consistent application of design tokens (colors, typography, spacing, effects) across all components and pages.

The design system is centralized in `Frontend/src/styles/theme.ts` and documented in `Frontend/DESIGN_SYSTEM.md`. This update will improve visual consistency, professionalism, and maintainability of the codebase.

## Architecture

### Component Update Strategy

The implementation follows a bottom-up approach:

1. **Shared Components First**: Update reusable components (NotificationBell, ErrorBoundary, ChatPanel, etc.)
2. **Page Components Second**: Update page-level components that consume shared components
3. **Verification**: Visual testing to ensure consistency across all pages

### Icon System Integration

**Current State**: Emojis are used throughout the application for visual communication
**Target State**: Heroicons (24px solid) from `@heroicons/react/24/solid`

**Icon Mapping Strategy**:

- Create a centralized icon mapping configuration
- Import Heroicons at the component level
- Replace emoji characters with React icon components
- Maintain consistent sizing (16px-24px based on context)

### Theme Integration Pattern

**Import Pattern**:

```typescript
import theme from "@/styles/theme";
import { glassStyle } from "@/styles/theme";
```

**Usage Pattern**:

```typescript
// Instead of hardcoded values
background: "#0a0a0f";
color: "#f1f5f9";

// Use theme tokens
background: theme.colors.background.primary;
color: theme.colors.text.primary;
```

## Components and Interfaces

### Icon Component Wrapper (Optional Enhancement)

```typescript
// Frontend/src/components/common/Icon.tsx
interface IconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, size = "md", className, style }) => {
  const sizeMap = {
    sm: "16px",
    md: "20px",
    lg: "24px",
  };

  const IconComponent = iconMap[name];

  return (
    <IconComponent
      style={{ width: sizeMap[size], height: sizeMap[size], ...style }}
      className={className}
    />
  );
};
```

### Icon Mapping Configuration

```typescript
// Frontend/src/config/iconMap.ts
import {
  BellIcon,
  FolderIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LockClosedIcon,
  KeyIcon,
  UserIcon,
  RocketLaunchIcon,
  TrashIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  // ... other icons
} from "@heroicons/react/24/solid";

export const iconMap = {
  bell: BellIcon,
  folder: FolderIcon,
  send: PaperAirplaneIcon,
  error: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  lock: LockClosedIcon,
  key: KeyIcon,
  user: UserIcon,
  rocket: RocketLaunchIcon,
  trash: TrashIcon,
  close: XMarkIcon,
  chat: ChatBubbleLeftRightIcon,
  search: MagnifyingGlassIcon,
  // ... other mappings
};
```

## Data Models

### Emoji to Icon Mapping

| Current Emoji | Heroicon Component      | Usage Context          |
| ------------- | ----------------------- | ---------------------- |
| 🔔            | BellIcon                | Notifications          |
| 📁            | FolderIcon              | Projects               |
| 📤            | PaperAirplaneIcon       | Send actions           |
| 😵            | ExclamationTriangleIcon | Error states           |
| ✅            | CheckCircleIcon         | Success states         |
| 🔐            | LockClosedIcon          | Authentication         |
| 🎫            | KeyIcon                 | Token/credentials      |
| 👤            | UserIcon                | User profile           |
| 🚀            | RocketLaunchIcon        | Create/launch actions  |
| 📭            | InboxIcon               | Empty notifications    |
| 💡            | LightBulbIcon           | Tips/suggestions       |
| 🗑️            | TrashIcon               | Delete actions         |
| ✕             | XMarkIcon               | Close/dismiss          |
| 📢            | MegaphoneIcon           | Announcements/channels |
| 🔍            | MagnifyingGlassIcon     | Search/debug           |
| 🧪            | BeakerIcon              | Testing/experiments    |

### Theme Token Usage Patterns

**Background Colors**:

```typescript
// Main backgrounds
background: theme.colors.background.primary; // #0a0a0f
background: theme.colors.background.secondary; // rgba(17, 17, 24, 0.7)
background: theme.colors.background.card; // rgba(17, 17, 24, 0.95)
```

**Text Colors**:

```typescript
// Text hierarchy
color: theme.colors.text.primary; // #f1f5f9
color: theme.colors.text.secondary; // #94a3b8
color: theme.colors.text.tertiary; // #64748b
color: theme.colors.text.muted; // #475569
```

**Brand Colors**:

```typescript
// Primary accent
background: theme.colors.brand.redGradient;
color: theme.colors.brand.red; // #dc2626
border: theme.colors.border.red;
```

**Status Colors**:

```typescript
// Status indicators
color: theme.colors.status.success; // #22c55e
color: theme.colors.status.warning; // #f59e0b
color: theme.colors.status.error; // #ef4444
```

## Error Handling

### Missing Icon Fallback

```typescript
const IconComponent = iconMap[name];
if (!IconComponent) {
  console.warn(`Icon "${name}" not found in iconMap`);
  return <QuestionMarkCircleIcon style={{ width: size, height: size }} />;
}
```

### Theme Token Fallback

```typescript
// Provide fallback for missing theme tokens
const backgroundColor = theme.colors?.background?.primary || "#0a0a0f";
```

### Browser Compatibility

- Heroicons are SVG-based and work across all modern browsers
- Backdrop blur effects require fallback for older browsers
- Use CSS feature detection for glass morphism effects

## Testing Strategy

### Visual Regression Testing

**Manual Testing Checklist**:

1. Verify all emojis are replaced with icons
2. Check icon sizing consistency (16px-24px)
3. Verify color consistency across pages
4. Test hover states and transitions
5. Verify glass morphism effects render correctly
6. Check responsive behavior on different screen sizes

### Component-Level Testing

**Unit Tests**:

- Test icon rendering with different props
- Test theme token application
- Test fallback behavior for missing icons

**Integration Tests**:

- Test icon interactions (click, hover)
- Test theme switching (if applicable)
- Test accessibility (ARIA labels, keyboard navigation)

### Browser Testing

Test in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Accessibility Testing

- Verify all icons have appropriate ARIA labels
- Test keyboard navigation
- Test screen reader compatibility
- Verify color contrast ratios meet WCAG AA standards

## Implementation Notes

### Component Update Order

1. **Phase 1: Shared Components**

   - NotificationBell.tsx
   - ErrorBoundary.tsx
   - ChatPanel.tsx
   - EnhancedChatPanel.tsx
   - UserProfile.tsx

2. **Phase 2: Page Components**

   - ProjectDashboard.tsx
   - AIAssistant.tsx
   - IssuesPage.tsx
   - TaskBoardPage.tsx
   - ProjectCreation.tsx
   - DebugAuth.tsx

3. **Phase 3: Chat Components**
   - ChatInterface.tsx

### Code Style Guidelines

**Icon Usage**:

```typescript
// Good: Semantic icon usage
<BellIcon className="w-5 h-5" style={{ color: theme.colors.text.primary }} />

// Bad: Inline styles without theme
<BellIcon style={{ width: '20px', color: '#f1f5f9' }} />
```

**Theme Usage**:

```typescript
// Good: Use theme tokens
style={{
  background: theme.colors.background.card,
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing['2xl']
}}

// Bad: Hardcoded values
style={{
  background: 'rgba(17, 17, 24, 0.95)',
  borderRadius: '20px',
  padding: '24px'
}}
```

### Performance Considerations

- Tree-shake unused Heroicons by importing only needed icons
- Use React.memo for icon components if re-rendering is frequent
- Lazy load icon sets if bundle size becomes an issue

### Migration Strategy

**Incremental Approach**:

1. Update one component at a time
2. Test each component individually
3. Commit changes per component or logical group
4. Maintain backward compatibility during migration

**Search and Replace Patterns**:

```typescript
// Find emoji patterns
/[\u{1F300}-\u{1F9FF}]/gu

// Find hardcoded colors
/#[0-9a-fA-F]{6}/g
/rgba?\([^)]+\)/g

// Find hardcoded spacing
/padding: ['"]?\d+px/g
/margin: ['"]?\d+px/g
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: No Emoji Characters in Rendered Output

_For any_ rendered component or page, the rendered output should not contain any emoji unicode characters (U+1F300 to U+1F9FF range).

**Validates: Requirements 1.1**

### Property 2: All Icons from Heroicons Library

_For any_ component that displays icons, all icon imports should originate from the @heroicons/react library.

**Validates: Requirements 1.2**

### Property 3: Text Colors Match Theme Tokens

_For any_ text element in the application, the computed color value should match one of the values defined in theme.colors.text (primary, secondary, tertiary, muted, or white).

**Validates: Requirements 2.1**

### Property 4: Background Colors Match Theme Tokens

_For any_ element with a background color, the computed background-color value should match one of the values defined in theme.colors.background or be a valid gradient/pattern from the theme.

**Validates: Requirements 2.2**

### Property 5: Brand Elements Use Brand Colors

_For any_ element marked as a brand element (containing "Ideal", "Assistant", or brand-specific classes), the color values should match theme.colors.brand values.

**Validates: Requirements 2.3**

### Property 6: Status Indicators Use Status Colors

_For any_ status indicator element (badges, labels showing status), the color values should match theme.colors.status values (success, warning, error, info, or neutral).

**Validates: Requirements 2.4**

### Property 7: Border Colors Match Theme Tokens

_For any_ element with a border, the border-color value should match one of the values defined in theme.colors.border.

**Validates: Requirements 2.5**

### Property 8: Typography Uses Inter Font

_For any_ text element (excluding code/monospace), the computed font-family should include 'Inter' as the primary font.

**Validates: Requirements 3.1**

### Property 9: Heading Font Sizes Match Theme

_For any_ heading element (h1, h2, h3, h4, h5, h6), the computed font-size should match one of the values defined in theme.typography.fontSize.

**Validates: Requirements 3.2**

### Property 10: Body Text Uses Base Font Size

_For any_ body text element (p, span, div with text content), the computed font-size should be theme.typography.fontSize.base (0.9375rem) unless specifically styled as a heading or special element.

**Validates: Requirements 3.3**

### Property 11: Font Weights Match Theme

_For any_ text element with font-weight styling, the computed font-weight value should match one of the values defined in theme.typography.fontWeight (400, 500, 600, or 700).

**Validates: Requirements 3.4**

### Property 12: Code Elements Use Monospace Font

_For any_ code or pre element, the computed font-family should include the monospace font defined in theme.typography.fontFamily.mono.

**Validates: Requirements 3.5**

### Property 13: Spacing Values Match Theme Scale

_For any_ element with padding, margin, or gap properties, the computed values should match values from theme.spacing or be a multiple/combination of theme.spacing values.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 14: Primary Buttons Match Theme Styles

_For any_ button with the "btn-primary" class or primary button styling, the computed styles should match theme.components.button.primary (background gradient, color, padding, border-radius, font-size, font-weight, box-shadow).

**Validates: Requirements 5.1**

### Property 15: Secondary Buttons Match Theme Styles

_For any_ button with the "btn-secondary" class or secondary button styling, the computed styles should match theme.components.button.secondary (background, color, padding, border-radius, border).

**Validates: Requirements 5.2**

### Property 16: Cards Have Glass Morphism Effects

_For any_ card element (with "card", "card-glass-solid", or similar classes), the computed styles should include glass morphism effects from theme.components.card (semi-transparent background, backdrop-filter blur, border).

**Validates: Requirements 5.3**

### Property 17: Input Fields Match Theme Styles

_For any_ input or textarea element, the computed styles should match theme.components.input (background, border, border-radius, color, padding, font-size).

**Validates: Requirements 5.4**

### Property 18: Select Dropdowns Match Theme Styles

_For any_ select element, the computed styles should match theme.components.select (background, border, border-radius, color, padding, font-size, font-weight).

**Validates: Requirements 5.5**

### Property 19: Headers Match Theme Styles

_For any_ header element (with "glass-header" class or similar), the computed styles should match theme.components.header (background, backdrop-filter, border-bottom, padding, position, z-index).

**Validates: Requirements 5.6**

### Property 20: Button Border Radius Consistency

_For any_ button element, the computed border-radius should be theme.borderRadius.md (12px).

**Validates: Requirements 6.1**

### Property 21: Card Border Radius Consistency

_For any_ card element, the computed border-radius should be theme.borderRadius.xl (20px).

**Validates: Requirements 6.2**

### Property 22: Small Element Border Radius Consistency

_For any_ badge, tag, or small decorative element, the computed border-radius should be theme.borderRadius.sm (8px).

**Validates: Requirements 6.3**

### Property 23: Circular Element Border Radius

_For any_ circular element (avatars, icon containers marked as circular), the computed border-radius should be theme.borderRadius.full (50%).

**Validates: Requirements 6.4**

### Property 24: Backdrop Blur Values Match Theme

_For any_ element with backdrop-filter blur, the blur value should match one of the values defined in theme.effects.backdropBlur (sm: 10px, md: 16px, lg: 20px).

**Validates: Requirements 7.1**

### Property 25: Transition Values Match Theme

_For any_ element with CSS transitions, the transition timing should match one of the values defined in theme.effects.transition (fast: 0.15s, normal: 0.2s, slow: 0.3s).

**Validates: Requirements 7.2**

### Property 26: Shadow Values Match Theme

_For any_ element with box-shadow, the shadow value should match one of the values defined in theme.shadows.

**Validates: Requirements 7.3**
