# Track Plan: Refine Alphabet Logic & UI Polish (Refined)

## Overview
This track delivers the core value proposition of the Alphabetical Arithmetic Engine. It moves beyond a simple script to a robust, tested, and aesthetically distinct application.

## Phase 1: Core Mathematical Engine (TDD)
**Goal**: Establish an immutable, high-performance logic core.

- [x] **Task 1.1: Test Harness Setup**
  - **Action**: Configure `logic.test.js` to support both Node.js environment and browser-compatible exports.
  - **Success Criteria**: `npm test` runs and fails initially (Red).
- [x] **Task 1.2: Normalization Logic Implementation**
  - **Action**: Implement `valueToTokens` using bitwise operations or greedy log-based decomposition.
  - **Success Criteria**: Passes tests for powers of 2 up to $2^{52}$.
- [x] **Task 1.3: Robust Parser Development**
  - **Action**: Implement a non-recursive descent parser with strict token validation.
  - **Success Criteria**: Correctly handles "A B + BBB", case-insensitivity, and extra whitespace.
- [x] **Task 1.4: Error Handling & Result Pattern**
  - **Action**: Standardize the return type of `compute()` to include error codes and messages.

## Phase 2: "Serious Business" UI System
**Goal**: Implement a high-fidelity, industrial design system.

- [x] **Task 2.1: Design Token System**
  - **Action**: Define CSS variables for the palette, spacing, and typography in `style.css`.
- [x] **Task 2.2: Responsive Grid Layout**
  - **Action**: Build the `<main>` container with a mobile-first CSS Grid layout for the display and keypad.
- [x] **Task 2.3: Semantic Keypad & Event Delegation**
  - **Action**: Use a single event listener on the keypad container to handle all button interactions.
  - **Success Criteria**: No individual event listeners on buttons.

## Phase 3: Advanced UX & Interaction
**Goal**: Polish interactions and add generative features.

- [x] **Task 3.1: Physical Keyboard Integration**
  - **Action**: Map `keydown` events to calculator actions (Enter -> Compute, Backspace -> Delete).
- [x] **Task 3.2: Generative "Surprise" Engine**
  - **Action**: Implement logic to generate valid, increasingly complex random expressions.
- [x] **Task 3.3: Animated State Transitions**
  - **Action**: Add subtle CSS transitions for button states and error banner visibility.

## Phase 4: Verification & Release
**Goal**: Final QA and documentation.

- [x] **Task 4.1: Cross-Platform Audit**
  - **Action**: Test on mobile (Chrome/Safari) and desktop.
- [x] **Task 4.2: Track Closure**
  - **Action**: Final review of `spec.md` and synchronization of project state.

## Risk Assessment & Mitigation
| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| Precision Loss | Medium | Use `BigInt` if values exceed $2^{53}-1$ (Deferred for this track). |
| CSS Incompatibility | Low | Use standard CSS Grid; provide flexbox fallbacks if necessary. |
| Logic Errors | High | 100% unit test coverage for `valueToTokens` and `tokenToValue`. |

## Definition of Done (DoD)
1. All unit tests in `logic.test.js` pass.
2. UI matches "Serious Business" design specification.
3. No console errors during standard operation.
4. Accessibility audit passes (no critical violations).