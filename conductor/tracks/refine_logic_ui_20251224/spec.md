# Track Specification: Refine Alphabet Logic & UI Polish

## 1. Executive Summary
This track transitions the Alphabetical Arithmetic Engine (AAE) from a proof-of-concept to a robust, production-grade utility. It focuses on two pillars: a mathematically rigorous implementation of binary-weighted tokenization and a "Serious Business" user interface designed to contrast with the inherent absurdity of the logic.

## 2. Mathematical & Logical Specification
The AAE operates on a base-2 positional system where value is determined by the length of "B" tokens and the presence of "A".

### 2.1 Token-to-Value Mapping
| Token | Type | Value ($V$) | Formula |
| :--- | :--- | :--- | :--- |
| `A` | Unit | 1 | $2^0$ |
| `B` | Base | 2 | $2^1$ |
| `BB` | Compound | 4 | $2^2$ |
| `B` $\times n$ | General | $2^n$ | $2^n$ |

### 2.2 Re-tokenization Algorithm (Normalization)
Post-calculation, values must be normalized into the "Greedy Canonical Form":
1. Decompose the integer sum into powers of 2 (binary representation).
2. Map each $2^n$ where $n > 0$ to a single token of $n$ "B"s.
3. Map $2^0$ to token "A".
4. Order tokens by descending value (largest first).

**Complexity Requirement**: The algorithm must operate in $O(\log_2 V)$ time.

## 3. Technical Requirements

### 3.1 Architectural Constraints
- **Separation of Concerns**: Logic (`app.js`) must be completely decoupled from the DOM. All mathematical functions must be pure and exportable for Node.js-based unit testing.
- **Integer Safety**: Support calculations up to `Number.MAX_SAFE_INTEGER`. Implement checks to prevent precision loss.

### 3.2 Parser Specification
- **Robustness**: The parser must handle arbitrary whitespace and be case-insensitive.
- **Validation**: Implement a strict whitelist. Any character outside `[A, B, +, \s]` must trigger a specific `ValidationError`.
- **Error States**: Errors must return a structured object: `{ ok: false, error: string, code: string }`.

### 3.3 UI/UX Design System ("Serious Business")
- **Visual Identity**: High-contrast, monochromatic palette with industrial blue accents (`#1e293b`, `#3b82f6`).
- **Typography**: Monospaced fonts for output (`JetBrains Mono`, `Courier New`) to emphasize the "data processing" nature.
- **Interaction Model**:
    - Physical keyboard support (Map Enter to `=`, Backspace to DELETE).
    - Haptic/Visual feedback on virtual button clicks.
- **Accessibility**: ARIA labels for the keypad and results display. Ensure 4:1 contrast ratios.

## 4. Quality Assurance Strategy

### 4.1 Automated Testing (TDD)
- **Unit Tests**:
    - `tokenToValue`: Verify correct conversion for tokens up to $B^{20}$.
    - `valueToTokens`: Verify canonical sorting and power-of-2 decomposition.
    - `compute`: Test complex expressions like `A + B + BB + BBB`.
- **Edge Cases**: Zero values, very large tokens, malformed strings (e.g., `+ A`, `A ++ B`).

### 4.2 Manual Verification
- **Cross-Browser**: Chrome, Firefox, Safari (iOS).
- **Responsiveness**: Verify keypad usability on 320px width devices.

## 5. Acceptance Criteria
- [ ] Logic: `compute("A + A")` returns `B`.
- [ ] Logic: `compute("B + B")` returns `BB`.
- [ ] Parser: Inputting "C" returns a clear error message.
- [ ] UI: Calculator matches the "Serious Business" aesthetic defined in Section 3.3.
- [ ] UI: "Stochastic" button generates valid expressions that evaluate correctly.
- [ ] UX: Backspace correctly handles multi-character tokens and operator spacing.