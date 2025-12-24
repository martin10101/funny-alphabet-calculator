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
  
  const lg = Math.log2(value);
  if (Number.isInteger(lg) && lg > 0) {
    return ['B'.repeat(lg)];
  }

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
    return { ok: false, error: "Error: Input buffer is empty. Please provide an expression." };
  }
  
  // Only handle '+' now
  const parts = raw.split(/(\+)/).map(p => p.trim()).filter(p => p.length > 0);
  
  if (parts.length < 3) {
    return { ok: false, error: "Error: Incomplete expression. Operator and operand required." };
  }

  for (let i = 0; i < parts.length; i += 2) {
    const valStr = parts[i];
    const tokens = valStr.split(/\s+/);
    for (const t of tokens) {
      if (t !== 'A' && !/^B+$/i.test(t)) {
        return { ok: false, error: `Error: Invalid token detected: \"${t}\". Only 'A' and 'B' variants are permitted.` };
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
    }
  }

  if (totalValue <= 0) {
    return { ok: false, error: "Error: Computation resulted in a null or negative value." };
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

  out.textContent = "SIGNAL LOST";
  err.hidden = false;
  err.textContent = result.error || "Error: Unknown system failure.";
}

function generateChain(lines) {
  const n = Math.max(1, Math.min(50, Number(lines) || 10));
  const parts = [];
  let term = "A"; 
  
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

const LogManager = {
  STORAGE_KEY: 'AAE_AUDIT_LOG',
  
  getLog() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Critical: Failed to retrieve audit log from storage.", e);
      return [];
    }
  },
  
  addEntry(expression, result) {
    const log = this.getLog();
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      expression,
      result
    };
    log.unshift(entry); 
    const trimmedLog = log.slice(0, 100);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedLog));
    return entry;
  },
  
  clearLog() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

function main() {
  const exprInput = document.getElementById("expr");
  const calcBtn = document.getElementById("calcBtn");
  const chainBtn = document.getElementById("chainBtn");
  const stepsInput = document.getElementById("steps");
  const chainOutput = document.getElementById("chain");
  const keypad = document.querySelector(".keypad");
  const auditEntries = document.getElementById("auditEntries");
  const clearLogBtn = document.getElementById("clearLogBtn");
  const printBtn = document.getElementById("printBtn");

  function renderAuditLog() {
    const log = LogManager.getLog();
    auditEntries.innerHTML = log.map(entry => `
      <tr>
        <td>${entry.timestamp.split('T')[1].split('.')[0]}</td>
        <td>${entry.expression}</td>
        <td>${entry.result}</td>
      </tr>
    `).join('');
  }

  function doCalc() {
    const res = compute(exprInput.value);
    renderResult(res);
    if (res.ok) {
      LogManager.addEntry(exprInput.value, res.result);
      renderAuditLog();
    }
  }

  function backspace() {
    let v = exprInput.value.trimEnd();
    if (v.endsWith('+')) {
      exprInput.value = v.slice(0, -1).trimEnd();
    } else {
      exprInput.value = v.slice(0, -1);
    }
  }

  function insertKey(key) {
    if (key === "clear") {
      exprInput.value = "";
      renderResult({ ok: false, error: "System Reset: Input buffer cleared." });
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
    if (key === "surprise") {
      const options = ["A + A", "B + B", "BB + BB", "A + B + BB", "B + A + B", "AAAAA"];
      exprInput.value = options[Math.floor(Math.random() * options.length)];
      doCalc();
      return;
    }
    if (key === "+") {
      const v = exprInput.value.trimEnd();
      if (!v) return;
      if (v.endsWith("+")) return;
      exprInput.value = v + " + ";
      return;
    }
    if (key === "A" || key === "B") {
      const v = exprInput.value;
      const lastChar = v.trim().slice(-1).toUpperCase();
      
      if (key === "A" && lastChar === "A") {
        exprInput.value = v.trimEnd() + " " + key;
      } else {
        exprInput.value += key;
      }
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

  clearLogBtn.addEventListener("click", () => {
    LogManager.clearLog();
    renderAuditLog();
  });

  printBtn.addEventListener("click", () => {
    window.print();
  });

  // Initial setup
  doCalc();
  renderAuditLog();
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
