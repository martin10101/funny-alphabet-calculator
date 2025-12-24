# Track Specification: Refine the Alphabet Logic and UI Polish

## Overview
This track aims to mature the "Funny Alphabet Calculator" by solidifying its unique arithmetic logic, handling edge cases, and applying a cohesive "Serious Calculator" visual identity as per the project guidelines.

## Requirements

### 1. Alphabet Logic Refinement
- **Addition:** 
    - A + A = B
    - B + B = BB
    - BB + BB = BBB
    - (Pattern: The length of the result is determined by the total "value" where A=1, B=2. For strings, the value is the sum of characters. The result is represented by the character with the highest value that doesn't exceed the total, repeated as necessary.)
    - *Correction for current idea:* The user wants `A+A=B` and `BB+BB=BBB`. Let's formalize: 
        - Let `val(A) = 1`, `val(B) = 2`, `val(C) = 3`, etc.
        - The "value" of a string is the sum of the values of its characters.
        - Result of `X + Y` is a string `Z` such that `val(Z) = val(X) + val(Y)`.
        - To make it "funny" and follow the examples:
            - If `val(Z)` exists as a single letter (e.g., 2 is 'B'), use that letter.
            - If `val(Z)` is greater than the highest defined letter (let's say 'B' for now), represent it by repeating the highest letter.
            - Example: `val(BB + BB) = 4 + 4 = 8`. If max letter is B (val 2), result is `BBBB`. 
            - *Wait, user example says `BB + BB = BBB`.* Let's re-read: `A + A = B` (1+1=2), `B + B = BB` (2+2=4? No, if B=2, then BB=4). `BB + BB = BBB` (4+4=8? No, if result is BBB, and B=2, then 8 = 3 * B?).
            - **Revised Logic:** The result is always a repetition of a single character. The character used is determined by the "tier". Tier 1 is A, Tier 2 is B.
            - `A (1) + A (1) = B (2)`
            - `B (2) + B (2) = BB (4)`
            - `BB (4) + BB (4) = BBB (8)`? No, the user example says `BB + BB = BBB`.
            - Let's look at the counts:
                - `A + A` (2 A's) -> `B` (1 B)
                - `B + B` (2 B's) -> `BB` (2 B's) - *Wait, this is confusing.*
            - Let's try: `count(Result) = count(Input1) + count(Input2) - 1`.
                - `A (1) + A (1)` -> `2 - 1 = 1`. Character moves up? A -> B. Result: `B`.
                - `B (1) + B (1)` -> `1 + 1 = 2`. Character stays B. Result: `BB`.
                - `BB (2) + BB (2)` -> `2 + 2 = 4`. *Wait, user said BBB.* `4 - 1 = 3`. Result: `BBB`.
            - **Consistent Logic Rule:** 
                1. Convert input strings to counts.
                2. If addition, `ResultCount = Count1 + Count2`.
                3. If the input is 'A', the first addition `A+A` results in `B` (count 1).
                4. Subsequent additions with 'B' just sum the counts and subtract 1? No, `B+B = BB` (1+1=2), `BB+BB = BBB` (2+2=4? No, 2+2=4, user says BBB which is 3).
                5. Let's use: `ResultCount = Count1 + Count2 - 1` for all additions except the very first base case.
                6. **Actually, let's keep it simpler for the "Funny" part:** 
                   - `A` is 1. `B` is 2.
                   - Value of string = (count of chars) * (value of char).
                   - `A+A` = 1+1 = 2. Value 2 is `B`.
                   - `B+B` = 2+2 = 4. Value 4. Since max char is B, we use `BB` (2*2).
                   - `BB+BB` = 4+4 = 8. Value 8. Using B, it's `BBBB` (4*B). 
                   - *But the user specifically said `BB + BB = BBB`.* This implies a logarithmic or custom scale.
                   - Let's go with: `Result = repeat(B, length(Input1) + length(Input2) - 1)` for B-based logic.
                   - For A: `A + A = B`.

- **Subtraction (New):** Implement "funny" subtraction. `B - A = A`. `BB - B = B`.
- **Invalid Input:** Handle non-A/B characters with a serious error message: "Input Error: Character out of logical bounds."

### 2. UI Polish ("Serious Calculator")
- **Color Scheme:** Gray backgrounds (#D1D1D1), LCD green display area (#9DBF9E).
- **Fonts:** Monospaced (`Courier New`).
- **Layout:** A centered, rectangular calculator "body" with a clear display area at the top and buttons below.
- **Interactions:** Hover effects and active states for buttons to simulate a tactile feel.

## Technical Tasks
- Create a test suite for the alphabet logic.
- Refactor `app.js` to implement the refined logic.
- Update `style.css` to match the "Serious Calculator" guidelines.
- Update `index.html` to improve the calculator structure (add buttons for 'A', 'B', '+', '-', 'Clear', 'Calculate').

## Acceptance Criteria
- `A + A` results in `B`.
- `B + B` results in `BB`.
- `BB + BB` results in `BBB`.
- The UI looks like a professional financial tool from the 90s.
- All tests pass with >80% coverage.
