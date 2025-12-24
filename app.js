function normalizeToken(token) {
  return (token || "").trim().toUpperCase();
}

function parseExpression(expr) {
  const raw = (expr || "").trim();
  const match = raw.match(/^\s*([A-Za-z]+)\s*\+\s*([A-Za-z]+)\s*$/);
  if (!match) {
    return { ok: false, error: "Type something like: BB + BB" };
  }
  const left = normalizeToken(match[1]);
  const right = normalizeToken(match[2]);
  if (left !== right) {
    return { ok: false, error: "This calculator only accepts the SAME thing on both sides (like BB + BB)." };
  }
  return { ok: true, token: left };
}

function funnyDouble(token) {
  if (token === "A") return "B";
  if (/^B+$/.test(token)) return "B".repeat(token.length + 1);
  return null;
}

function compute(expr) {
  const parsed = parseExpression(expr);
  if (!parsed.ok) return parsed;
  const out = funnyDouble(parsed.token);
  if (out == null) {
    return {
      ok: false,
      error: "Only A and strings of B are supported for now. Try: A + A, B + B, BB + BB, ...",
    };
  }
  return { ok: true, result: out };
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
  let term = "A";
  for (let i = 0; i < n; i++) {
    const next = funnyDouble(term);
    if (next == null) {
      parts.push(`${term} + ${term} = (unsupported)`);
      break;
    }
    parts.push(`${term} + ${term} = ${next}`);
    term = next;
  }
  return parts.join("
");
}

function main() {
  const expr = document.getElementById("expr");
  const calcBtn = document.getElementById("calcBtn");
  const chainBtn = document.getElementById("chainBtn");
  const steps = document.getElementById("steps");
  const chain = document.getElementById("chain");

  function doCalc() {
    renderResult(compute(expr.value));
  }

  calcBtn.addEventListener("click", doCalc);
  expr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doCalc();
  });

  chainBtn.addEventListener("click", () => {
    chain.textContent = generateChain(steps.value);
  });

  doCalc();
  chain.textContent = generateChain(steps.value);
}

main();
