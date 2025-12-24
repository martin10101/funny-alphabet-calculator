# Implementation Handoff

## What I built
A tiny, dependency-free web page that implements the requested silly alphabet rules and shows a generated chain.

## Files
- `index.html` (UI)
- `style.css` (styling)
- `app.js` (logic)
- `README.md` (usage for non-devs)

## Behavior
- Accepts expressions of the form `X + X` (same token on both sides)
- Supported tokens:
  - `A` (so `A + A = B`)
  - Any string of `B` (so `BB + BB = BBB`, etc.)

## How to run
Open `index.html` in a browser.
