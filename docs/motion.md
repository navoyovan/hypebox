# Motion Guidelines


Rules for motion design to ensure a smooth, premium, and performant user experience without excessive or distracting animations.

## Core Rules

1. **Restraint Over Flamboyance**: Motion should guide user focus, not act as a visual distraction.
2. **GPU Performance First**: Only animate `opacity` and `transform`. Avoid animating properties that cause layout recalculations (e.g., `width`, `height`, `margin`, `top`, `left`).
3. **Respect Accessibility**: Always respect `prefers-reduced-motion` by disabling transitions or scaling down translation distances.

## Curves & Durations

* **Eases**:
  - Primary Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (Custom ultra-smooth deceleration curve for transitions, menus, and reveals).
  - Hover Ease: `cubic-bezier(0.25, 1, 0.5, 1)` (Gentle, responsive transition).
* **Durations**:
  - Menu Reveal / Page Routing Transitions: `400ms`
  - Hover / Light Interaction Fade: `250ms`
  - Subtle Reveal / Scroll Fade-in: `600ms`

## Stagger & Rhythm

* When rendering lists of items (e.g., project grid cards, menu links), apply a stagger delay of **`50ms`** per child.
* Keep reveal translation values minimal. Do not slide items up by more than `20px` to maintain editorial stability.
