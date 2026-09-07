---
name: Stemawy 2.0 Academic Hub
colors:
  surface: '#faf8ff'
  surface-dim: '#dad9e1'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3fa'
  surface-container: '#eeedf4'
  surface-container-high: '#e9e7ef'
  surface-container-highest: '#e3e1e9'
  on-surface: '#1a1b21'
  on-surface-variant: '#444651'
  inverse-surface: '#2f3036'
  inverse-on-surface: '#f1f0f7'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#00311f'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a31'
  on-tertiary-container: '#27c38a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#1a1b21'
  surface-variant: '#e3e1e9'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is rooted in **Corporate Modernism** with a focus on high-performance academic empowerment. It avoids traditional "institutional" aesthetics in favor of a sleek, tech-forward platform that treats high school students as focused young professionals.

The visual language communicates reliability and clarity through heavy whitespace, structured layouts, and precise typography. The emotional response is one of organized ambition—reducing the cognitive load of a complex curriculum through layered surfaces and a sophisticated, confidence-inspiring color palette.

Key stylistic markers include:
- **Depth through layering:** Utilizing distinct surface tiers rather than heavy borders.
- **Micro-precision:** Small, thoughtful interactions that signify a high-quality engineering standard.
- **Focus-centricity:** Minimalist aesthetics that prioritize content and progress tracking over decorative elements.

## Colors

The palette is anchored by "Academic Deep Blue," providing an authoritative foundation, while "Vibrant Sapphire" is used for primary actions and focus states. 

**Functional Color Application:**
- **Primary (#1E3A8A):** Navigation, headers, and primary brand moments.
- **Action (#3B82F6):** Buttons, active links, and interactive elements.
- **Success/Progress (#10B981):** Completed modules, passing grades, and "Soft Mint" achievement indicators.
- **Alert/Opportunity (#F59E0B):** Deadlines, upcoming exams, and system notifications.

**Neutral & Dark Mode:**
The default state uses a light-blue tinted background (`#F8FAFC`) with pure white surfaces. Dark mode should transition to a Deep Navy background (`#0F172A`) with layered Slate surfaces (`#1E293B`) to maintain high contrast and legibility during late-night study sessions.

## Typography

This design system utilizes a dual-font strategy to balance character and readability. **Montserrat** is used for headings to provide a confident, geometric structure. **Inter** is the workhorse for body text and UI labels, selected for its exceptional legibility in data-dense academic environments.

**Arabic Support:**
For Arabic locales, replace Montserrat with **Cairo** (SemiBold/Bold) for headings and Inter with **IBM Plex Sans Arabic** for body text. Ensure line-heights are increased by 15-20% for Arabic script to prevent crowding of diacritics.

**Hierarchy Rules:**
- Use `display-lg` exclusively for dashboard greetings and landing page heros.
- Use `label-sm` in all caps for overlines or category tags.
- All body text should maintain a minimum contrast ratio of 4.5:1 against its background.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The system is built on a strict 8px rhythmic scale to ensure mathematical harmony across all components.

**Breakpoint Behavior:**
- **Desktop (1280px+):** Max-width container of 1200px, centered. Gutters at 24px.
- **Tablet (768px - 1279px):** Adaptive margins (32px). Cards stack or become 2-column.
- **Mobile (Up to 767px):** Single column layout. Side margins reduced to 16px.

**Density:**
Maintain generous vertical rhythm (`spacing.lg`) between major sections to prevent student burnout. Use `spacing.sm` for internal component padding to maintain a "tight," professional feel.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Ambient Shadows**. This creates a physical sense of "stacks" where the most important interactive content sits closest to the user.

- **Level 0 (Background):** `#F8FAFC` - The canvas.
- **Level 1 (Cards/Surface):** `#FFFFFF` - Used for content modules. Uses a soft, wide-dispersion shadow: `0px 4px 20px rgba(30, 58, 138, 0.05)`.
- **Level 2 (Hover/Active):** An elevated state for cards. The shadow tightens and deepens: `0px 8px 30px rgba(30, 58, 138, 0.12)`.
- **Level 3 (Modals/Popovers):** Floating elements with a distinct directional shadow to imply significant height: `0px 20px 50px rgba(0, 0, 0, 0.1)`.

Use Backdrop Blurs (12px) on fixed navigation bars to maintain context of the content scrolling beneath.

## Shapes

The shape language is "Softly Geometric." The primary corner radius is set to **12px** for standard components (cards, inputs) and **16px** for larger containers.

- **Standard (`rounded`):** 8px - Small buttons, tags, checkboxes.
- **Large (`rounded-lg`):** 12px - Default for cards, input fields, and modals.
- **Extra Large (`rounded-xl`):** 24px - Section wrappers or featured promotional banners.

Interactive elements (buttons) may use a **Pill** shape when they are standalone "floating" actions, such as a "Start Quiz" button.

## Components

**Buttons:**
- **Primary:** Solid Sapphire (#3B82F6) with white text. Subtle scale-up (1.02x) on hover.
- **Secondary:** Outlined Academic Blue (#1E3A8A) with 1.5px border.
- **Ghost:** No background, Academic Blue text. Used for "Cancel" or less frequent actions.

**Inputs & Forms:**
- Use a 1px border (#E2E8F0) that transitions to Sapphire (#3B82F6) on focus.
- Labels must always be visible (no placeholder-only labels) using `label-md`.

**Cards:**
- White background, 12px border-radius, Level 1 shadow.
- Header area of the card should have a 1px bottom border (#F1F5F9).

**Progress Indicators:**
- Use Soft Mint (#10B981) for progress bars. 
- Animation: Fill from 0% to X% over 600ms with an `ease-out` curve upon section entrance.

**Motion & Feedback:**
- **Skeletons:** Use a shimmer effect moving from left to right with a 2-second loop.
- **Transitions:** All state changes (hover, focus, toggle) should use a `200ms cubic-bezier(0.4, 0, 0.2, 1)` transition.
- **Dashboard Entrances:** Staggered fade-in with a slight Y-axis slide (20px) for dashboard widgets to create a sense of the platform "building" itself for the user.