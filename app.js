/**
 * Logic functions for the Funny Alphabet Calculator
 */

function tokenToValue(token) {
  const t = token.trim().toUpperCase();
  if (!t) return 0;
  if (t === 'A') return 1;
  if (/^B+$/.test(t)) {
    return Math.pow(2, t.length);
  }
  return 0;
}

function valueToTokens(value) {
  if (value <= 0) return [];
  if (value === 1) return ['A'];
  
  // Find if it's a power of 2
  const lg = Math.log2(value);
  if (Number.isInteger(lg)) {
    return ['B'.repeat(lg)];
  }

  // Binary decomposition (highest to lowest)
  const result = [];
  let remaining = value;
  let power = Math.floor(Math.log2(remaining));
  
  while (remaining > 0 && power >= 0) {
    const v = Math.pow(2, power);
    if (remaining >= v) {
      if (power === 0) {
        result.push('A');
      } else {
        result.push('B'.repeat(power));
      }
      remaining -= v;
    }
    power--;
  }
  return result;
}

function parseExpression(expr) {
  const raw = (expr || "").trim();
  if (!raw) {
    return { ok: false, error: "CRITICAL: No input detected in buffer. Specify operation (e.g., BB + BB)." };
  }
  
  // Split by '+' and filter empty
  const tokens = raw.split('+').map(t => t.trim()).filter(t => t.length > 0);
  
  if (tokens.length < 2) {
    return { ok: false, error: "LOGIC ERROR: Insufficient operands for consolidation. Two or more components required." };
  }

  // Validate tokens
  for (const t of tokens) {
    if (t !== 'A' && !/^B+$/i.test(t)) {
      return { ok: false, error: `SYSTEM ALERT: Unauthorized character sequence detected: "${t}". Use valid components only (A, B+).` };
    }
  }

  return { ok: true, tokens };
}

function compute(expr) {
  const parsed = parseExpression(expr);
  if (!parsed.ok) return parsed;
  
  const sum = parsed.tokens.reduce((acc, t) => acc + tokenToValue(t), 0);
  const resultTokens = valueToTokens(sum);
  
  if (resultTokens.length === 0) {
    return { ok: false, error: "ALGORITHM FAILURE: Calculation resulted in a null or negative logical state." };
  }
  
  return { ok: true, result: resultTokens.join(' ') };
}

function renderResult(result) {
  const out = document.getElementById("result");
  const err = document.getElementById("error");

  if (result.ok) {
    out.textContent = result.result;
    err.hidden = true;
    err.textContent = "";
    return;
  }

  out.textContent = "?";
  err.hidden = false;
  err.textContent = result.error || "Something went wrong.";
}

function generateChain(lines) {
  const n = Math.max(1, Math.min(50, Number(lines) || 10));
  const parts = [];
  let term = "A"; // Value is 1
  
  for (let i = 0; i < n; i++) {
    const val = tokenToValue(term);
    const sum = val + val;
    const nextTokens = valueToTokens(sum);
    const next = nextTokens.join(' ');
    
    parts.push(`${term} + ${term} = ${next}`);
    term = next;
  }
  return parts.join("\n");
}

function main() {
  const exprInput = document.getElementById("expr");
  const calcBtn = document.getElementById("calcBtn");
  const chainBtn = document.getElementById("chainBtn");
  const stepsInput = document.getElementById("steps");
  const chainOutput = document.getElementById("chain");
  const keypad = document.querySelector(".keypad");

  function doCalc() {
    renderResult(compute(exprInput.value));
  }

  function backspace() {
    exprInput.value = exprInput.value.trimEnd().slice(0, -1);
  }

  function insertKey(key) {
    if (key === "clear") {
      exprInput.value = "";
      renderResult({ ok: false, error: "BUFFER PURGED: Please initialize new computation string." });
      return;
    }
    if (key === "bksp") {
      backspace();
      return;
    }
    if (key === "=") {
      doCalc();
      return;
    }
    if (key === "+") {
      const v = exprInput.value.trimEnd();
      if (!v) return;
      if (v.endsWith('+')) return;
      exprInput.value = v + " + ";
      return;
    }
    if (key === "A" || key === "B") {
      // If last char was space (from +), just append.
      // Otherwise if it's a different letter, maybe add space? 
      // No, let's keep it simple.
      exprInput.value += key;
      return;
    }
  }

  calcBtn.addEventListener("click", doCalc);
  exprInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doCalc();
  });

  if (keypad) {
    keypad.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-key]");
      if (!btn) return;
      insertKey(btn.getAttribute("data-key"));
    });
  }

  chainBtn.addEventListener("click", () => {
    chainOutput.textContent = generateChain(stepsInput.value);
  });

  // Initial calculation
  doCalc();
  chainOutput.textContent = generateChain(stepsInput.value);
}

main();