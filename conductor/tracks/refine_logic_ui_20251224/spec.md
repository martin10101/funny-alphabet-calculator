# Track Specification: Refine Alphabet Logic & UI Polish (Refined)

## 1. Executive Summary
This track elevates the Alphabetical Arithmetic Engine (AAE) from a functional prototype to a production-grade utility. The primary objectives are to implement a mathematically rigorous binary-weighted tokenization system and a "Serious Business" industrial-grade user interface. The goal is to create a jarring contrast between the absurdity of the "Funny Alphabet" logic and the absolute precision of its implementation and presentation.

## 2. Mathematical & Logical Specification

### 2.1 Positional Number System
The AAE implements a base-2 positional system. Unlike standard binary, it uses literal token length and specific characters to denote powers of 2.

| Token | Semantic Value | Mathematical Expression | Canonical Form |
| :--- | :--- | :--- | :--- |
| `A` | Unit | $2^0$ | Always `A` |
| `B` | Base | $2^1$ | `B` |
| `BB` | Compound | $2^2$ | `BB` |
| `B` $\times n$ | General | $2^n$ | `B` repeated $n$ times |

### 2.2 Formal Grammar (EBNF)
```ebnf
expression = term { whitespace , "+" , whitespace , term } ;
term       = token { whitespace , token } ;
token      = unit | base ;
unit       = "A" | "a" ;
base       = { "B" | "b" }- ; (* one or more B/b characters *)
whitespace = { " " | "\t" | "\n" | "\r" } ;
```

### 2.3 Normalization Algorithm (Greedy Canonicalization)
All results must be output in the **Greedy Canonical Form (GCF)**:
1. **Decomposition**: Convert the integer sum $V$ into its unique binary representation.
2. **Mapping**: For each $i$ where the $i$-th bit is 1:
   - If $i=0$, map to `A`.
   - If $i>0$, map to a token consisting of $i$ `B`s.
3. **Ordering**: Tokens must be sorted in descending order of value (largest $n$ first).
4. **Serialization**: Tokens are joined by a single space.

**Complexity Requirement**: $O(\log_2 V)$ for both encoding and decoding.

## 3. Technical Requirements

### 3.1 Architectural Principles
- **Functional Core**: All mathematical logic must be implemented as pure functions (deterministic, no side effects) to facilitate exhaustive unit testing.
- **Strict Validation**: The parser must reject any input containing non-whitelisted characters or malformed token structures (e.g., `BA`).
- **Error Model**: Use a Result pattern for all fallible operations:
  ```typescript
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E; code: ErrorCode };
  ```

### 3.2 UI/UX Design System: "Serious Business"
The interface must evoke the aesthetic of high-frequency trading terminals or industrial control systems.
- **Palette**: Deep Slate (`#0f172a`), Industrial Blue (`#3b82f6`), and Warning Amber (`#f59e0b`).
- **Typography**: Primary: `Inter` (UI), Monospace: `JetBrains Mono` (Data).
- **Interactions**:
  - Zero-latency feedback on keypad input.
  - Consistent focus states for keyboard navigation.
  - High-visibility error states using the Warning Amber accent.

### 3.3 Non-Functional Requirements
- **Performance**: Computation and rendering must complete within <16ms (60fps) for expressions up to 100 tokens.
- **Accessibility**: 
  - Full WCAG 2.1 AA compliance.
  - ARIA Live regions for calculation results.
  - Keyboard-only operability.
- **Security**: No `eval()` or `new Function()`. Strict sanitization of input strings.

## 4. Quality Assurance Strategy

### 4.1 Automated Testing Matrix
| Component | Test Type | Coverage Goal |
| :--- | :--- | :--- |
| Logic Core | Unit (Jest) | 100% Path Coverage |
| Parser | Fuzzing | 1,000 random permutations |
| UI State | Integration | Keypad sequence validation |
| Layout | Snapshot | Multiple viewport widths |

### 4.2 Edge Case Handling
- **Overflow**: Input exceeding `Number.MAX_SAFE_INTEGER`.
- **Underflow**: Negative result handling (though addition-only, future-proofing required).
- **Malformed**: `A + + B`, `B A`, `?`.

## 5. Acceptance Criteria
- [x] **Logic**: `compute("B + B")` results in `BB`.
- [x] **Logic**: GCF ensures `compute("A A")` (implicit addition) or `compute("A + A")` results in `B`.
- [x] **Parser**: Rejects invalid characters with descriptive error codes.
- [x] **UI**: Keypad is fully functional and supports physical keyboard mapping.
- [x] **UX**: "Stochastic" button generates valid, parsable expressions.
- [x] **Accessibility**: Result display is announced by screen readers via `aria-live`.
