# Implementation Plan: UI Design System Compliance

## Overview

This implementation plan outlines the tasks required to update the Atlas AI Scrum Master frontend to achieve full compliance with the established design system. The approach follows a bottom-up strategy, updating shared components first, then page components, ensuring consistent application of Heroicons and design system tokens throughout.

## Tasks

- [x] 1. Install Heroicons and create icon mapping configuration

  - Install @heroicons/react package
  - Create icon mapping configuration file at `Frontend/src/config/iconMap.ts`
  - Export all required Heroicon components
  - _Requirements: 1.1, 1.2_

- [x] 2. Update NotificationBell component

  - [x] 2.1 Replace emoji 🔔 with BellIcon from Heroicons

    - Import BellIcon from @heroicons/react/24/solid
    - Replace emoji character with BellIcon component
    - Apply consistent sizing (20px)
    - _Requirements: 1.3_

  - [x] 2.2 Replace emoji 📭 with InboxIcon

    - Import InboxIcon for empty state
    - Replace emoji character with InboxIcon component
    - _Requirements: 1.1_

  - [x] 2.3 Replace emoji ✕ with XMarkIcon

    - Import XMarkIcon for delete button
    - Replace emoji character with XMarkIcon component
    - _Requirements: 1.1_

  - [x] 2.4 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update background colors to use theme.colors.background
    - Update text colors to use theme.colors.text
    - Update border colors to use theme.colors.border
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 2.5 Apply design system spacing

    - Replace hardcoded padding/margin values with theme.spacing
    - Update gap values to use theme.spacing
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.6 Apply design system border radius
    - Update border-radius values to use theme.borderRadius
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Update ErrorBoundary component

  - [x] 3.1 Replace emoji 😵 with ExclamationTriangleIcon

    - Import ExclamationTriangleIcon from Heroicons
    - Replace emoji character with icon component
    - Apply consistent sizing (64px)
    - _Requirements: 1.6_

  - [x] 3.2 Apply design system colors and typography

    - Update colors to use theme tokens
    - Update font family to use theme.typography.fontFamily.primary
    - Update font sizes to use theme.typography.fontSize
    - _Requirements: 2.1, 3.1, 3.2_

  - [x] 3.3 Apply design system effects
    - Update box-shadow to use theme.shadows
    - Update border-radius to use theme.borderRadius
    - _Requirements: 6.2, 7.3_

- [x] 4. Update ChatPanel and EnhancedChatPanel components

  - [x] 4.1 Replace emoji 📤 with PaperAirplaneIcon

    - Import PaperAirplaneIcon from Heroicons
    - Replace emoji character in send button
    - Apply consistent sizing (20px)
    - _Requirements: 1.5_

  - [x] 4.2 Replace emoji 📢 with MegaphoneIcon

    - Import MegaphoneIcon for channels button
    - Replace emoji character with icon component
    - _Requirements: 1.1_

  - [x] 4.3 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update button styles to use theme.components.button
    - _Requirements: 2.1, 2.2, 5.1, 5.2_

  - [x] 4.4 Apply design system spacing and typography
    - Update spacing values to use theme.spacing
    - Update font sizes to use theme.typography.fontSize
    - _Requirements: 3.2, 3.3, 4.1, 4.2_

- [x] 5. Update ChatInterface component

  - [x] 5.1 Replace emoji 👋 and 😅 in default messages

    - Remove emoji characters from AI messages
    - Use text-only messages or add appropriate icons
    - _Requirements: 1.1_

  - [x] 5.2 Replace emoji 📤 with PaperAirplaneIcon

    - Import PaperAirplaneIcon for send button
    - Replace emoji character with icon component
    - _Requirements: 1.5_

  - [x] 5.3 Apply design system styles
    - Update colors to use theme tokens
    - Update spacing to use theme.spacing
    - Update typography to use theme.typography
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1_

- [x] 6. Update UserProfile component

  - [x] 6.1 Replace emoji 🚀 with RocketLaunchIcon

    - Import RocketLaunchIcon from Heroicons
    - Replace emoji in "Create Your First Project" button
    - Apply consistent sizing (20px)
    - _Requirements: 1.1_

  - [x] 6.2 Replace emoji 📁 with FolderIcon

    - Import FolderIcon for project cards
    - Replace emoji character with icon component
    - Apply consistent sizing (24px)
    - _Requirements: 1.4_

  - [x] 6.3 Replace text abbreviations with icons

    - Replace "#" with appropriate icon (HashtagIcon or NumberIcon)
    - Replace "OK" with CheckCircleIcon
    - Replace "IP" with ClockIcon or ArrowPathIcon
    - _Requirements: 1.1_

  - [x] 6.4 Apply design system colors

    - Update all hardcoded colors to use theme.colors
    - Update brand colors to use theme.colors.brand
    - Update status colors to use theme.colors.status
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.5 Apply design system component styles

    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update header styles to use theme.components.header
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

  - [x] 6.6 Apply design system spacing and border radius
    - Update spacing values to use theme.spacing
    - Update border-radius values to use theme.borderRadius
    - _Requirements: 4.1, 4.2, 6.1, 6.2, 6.3_

- [x] 7. Update ProjectDashboard page

  - [x] 7.1 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update text colors to use theme.colors.text
    - Update background colors to use theme.colors.background
    - Update status colors to use theme.colors.status
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 7.2 Apply design system typography

    - Update font sizes to use theme.typography.fontSize
    - Update font weights to use theme.typography.fontWeight
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 7.3 Apply design system spacing

    - Update padding/margin values to use theme.spacing
    - Update gap values to use theme.spacing
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 7.4 Apply design system component styles

    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update header styles to use theme.components.header
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

  - [x] 7.5 Apply design system border radius and effects
    - Update border-radius values to use theme.borderRadius
    - Update box-shadow values to use theme.shadows
    - Update transitions to use theme.effects.transition
    - _Requirements: 6.1, 6.2, 7.2, 7.3_

- [x] 8. Update AIAssistant page

  - [x] 8.1 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update status colors for log levels
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 8.2 Apply design system typography

    - Update font sizes to use theme.typography.fontSize
    - Update font weights to use theme.typography.fontWeight
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 8.3 Apply design system spacing and component styles

    - Update spacing values to use theme.spacing
    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update input styles to use theme.components.input
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 5.4_

  - [x] 8.4 Apply design system border radius and effects
    - Update border-radius values to use theme.borderRadius
    - Update box-shadow values to use theme.shadows
    - _Requirements: 6.1, 6.2, 7.3_

- [x] 9. Update IssuesPage

  - [x] 9.1 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update priority colors to use theme.colors.status
    - Update status colors to use theme.colors.status
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 9.2 Apply design system typography

    - Update font sizes to use theme.typography.fontSize
    - Update font weights to use theme.typography.fontWeight
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 9.3 Apply design system spacing and component styles

    - Update spacing values to use theme.spacing
    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update input/textarea styles to use theme.components.input
    - Update select styles to use theme.components.select
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 9.4 Apply design system border radius and effects
    - Update border-radius values to use theme.borderRadius
    - Update box-shadow values to use theme.shadows
    - _Requirements: 6.1, 6.2, 6.3, 7.3_

- [x] 10. Update TaskBoardPage

  - [x] 10.1 Apply design system colors

    - Replace hardcoded colors with theme.colors tokens
    - Update status colors to use theme.colors.status
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 10.2 Apply design system typography

    - Update font sizes to use theme.typography.fontSize
    - Update font weights to use theme.typography.fontWeight
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 10.3 Apply design system spacing and component styles

    - Update spacing values to use theme.spacing
    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update input styles to use theme.components.input
    - Update select styles to use theme.components.select
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 10.4 Apply design system border radius and effects
    - Update border-radius values to use theme.borderRadius
    - Update box-shadow values to use theme.shadows
    - _Requirements: 6.1, 6.2, 7.3_

- [x] 11. Update ProjectCreation page

  - [x] 11.1 Replace emoji 💡 with LightBulbIcon

    - Import LightBulbIcon from Heroicons
    - Replace emoji in tips section (if uncommented)
    - _Requirements: 1.1_

  - [x] 11.2 Apply design system colors and typography

    - Update colors to use theme.colors tokens
    - Update typography to use theme.typography
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 11.3 Apply design system component styles
    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - Update header styles to use theme.components.header
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

- [x] 12. Update DebugAuth page

  - [x] 12.1 Replace authentication emojis with Heroicons

    - Replace 🔍 with MagnifyingGlassIcon
    - Replace 🎫 with KeyIcon
    - Replace 👤 with UserIcon
    - Replace 🗑️ with TrashIcon
    - Replace 🔐 with LockClosedIcon
    - Replace 🧪 with BeakerIcon
    - _Requirements: 1.8_

  - [x] 12.2 Apply design system colors and typography

    - Update colors to use theme.colors tokens
    - Update typography to use theme.typography
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 12.3 Apply design system component styles
    - Update button styles to use theme.components.button
    - Update card styles to use theme.components.card
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 13. Checkpoint - Visual verification and testing

  - Verify all emojis are replaced with Heroicons
  - Verify color consistency across all pages
  - Verify typography consistency
  - Verify spacing consistency
  - Verify component styles match design system
  - Test responsive behavior
  - Test hover states and transitions
  - Ask the user if questions arise

- [x] 14. Update global CSS and remove hardcoded values

  - [x] 14.1 Review App.css and index.css

    - Identify hardcoded color values
    - Identify hardcoded spacing values
    - Identify hardcoded typography values
    - _Requirements: 2.1, 2.2, 3.1, 4.4_

  - [x] 14.2 Replace with CSS custom properties from theme
    - Create CSS custom properties for theme tokens
    - Update global styles to use custom properties
    - _Requirements: 2.1, 2.2, 3.1, 4.1_

- [x] 15. Final checkpoint - Comprehensive testing
  - Test all pages in different browsers (Chrome, Firefox, Safari, Edge)
  - Verify accessibility (ARIA labels, keyboard navigation, screen readers)
  - Verify color contrast ratios meet WCAG AA standards
  - Test responsive behavior on different screen sizes
  - Verify no console errors or warnings
  - Ask the user if questions arise

## Notes

- Each task builds on previous tasks to ensure incremental progress
- Components are updated before pages to ensure consistency
- Visual verification checkpoints ensure quality at each stage
- All changes reference specific requirements for traceability
- The implementation follows the design system documented in `Frontend/DESIGN_SYSTEM.md`
- Theme tokens are imported from `Frontend/src/styles/theme.ts`
