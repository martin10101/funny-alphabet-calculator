/**
 * Logic functions for the Funny Alphabet Calculator
 */

function tokenToValue(token) {
  if (!token) return 0;
  return token.trim().toUpperCase().split(/\s+/).reduce((acc, t) => {
    if (!t) return acc;
    if (t === 'A') return acc + 1;
    if (/^B+$/.test(t)) return acc + Math.pow(2, t.length);
    return acc;
  }, 0);
}

function valueToTokens(value) {
  if (value <= 0) return [];
  if (value === 1) return ['A'];
  
  // Find if it's a power of 2
  const lg = Math.log2(value);
  if (Number.isInteger(lg) && lg > 0) {
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
  
  // Split into tokens and operators
  const parts = raw.split(/(\+|-)/).map(p => p.trim()).filter(p => p.length > 0);
  
  if (parts.length < 3) {
    return { ok: false, error: "LOGIC ERROR: Insufficient operands for consolidation. Two or more components required." };
  }

  // Validate values (parts at even indices: 0, 2, 4...)
  for (let i = 0; i < parts.length; i += 2) {
    const valStr = parts[i];
    const tokens = valStr.split(/\s+/);
    for (const t of tokens) {
      if (t !== 'A' && !/^B+$/i.test(t)) {
        return { ok: false, error: `SYSTEM ALERT: Unauthorized character sequence detected: "${t}". Use valid components only (A, B+).` };
      }
    }
  }

  return { ok: true, parts };
}

function compute(expr) {
  const parsed = parseExpression(expr);
  if (!parsed.ok) return parsed;
  
  const { parts } = parsed;
  let totalValue = tokenToValue(parts[0]);

  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const operand = parts[i+1];
    if (!operand) break;
    
    const val = tokenToValue(operand);
    if (op === '+') {
      totalValue += val;
    } else if (op === '-') {
      totalValue -= val;
    }
  }

  if (totalValue <= 0) {
    return { ok: false, error: "ALGORITHM FAILURE: Calculation resulted in a null or negative logical state." };
  }
  
  const resultTokens = valueToTokens(totalValue);
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
    if (key === "+" || key === "-") {
      const v = exprInput.value.trimEnd();
      if (!v) return;
      if (v.endsWith('+') || v.endsWith('-')) return;
      exprInput.value = v + " " + key + " ";
      return;
    }
    if (key === "A" || key === "B") {
      const v = exprInput.value;
      // If last char is a letter, maybe we want a space if it's a different letter? 
      // The user manual says B A = 3. 
      // For now, let's just append. User can add spaces if they want, 
      // but usually calculators append to the current operand.
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

if (typeof document !== 'undefined') {
  main();
}

if (typeof module !== 'undefined') {
  module.exports = { 
    tokenToValue, 
    valueToTokens, 
    parseExpression,
    compute,
    sumValues: (tokens) => tokens.reduce((acc, t) => acc + tokenToValue(t), 0) 
  };
}