const { tokenToValue, valueToTokens, parseExpression, compute } = require('./app.js');

function test() {
  console.log("--- Running Arithmetic Tests ---");
  const arithmeticCases = [
    { input: ['A', 'A'], expected: 'B' },
    { input: ['B', 'B'], expected: 'BB' },
    { input: ['BB', 'BB'], expected: 'BBB' },
    { input: ['A', 'B'], expected: 'B A' },
    { input: ['A', 'A', 'B'], expected: 'BB' },
    { input: ['BB', 'B', 'A'], expected: 'BB B A' },
    { input: ['BBB', 'BBB'], expected: 'BBBB' },
  ];

  let passed = 0;
  arithmeticCases.forEach(({ input, expected }) => {
    const sum = input.reduce((acc, t) => acc + tokenToValue(t), 0);
    const result = valueToTokens(sum).join(' ');
    if (result === expected) {
      console.log(`PASS: ${input.join(' + ')} = ${result}`);
      passed++;
    } else {
      console.error(`FAIL: ${input.join(' + ')} = ${result} (expected ${expected})`);
    }
  });

  console.log("\n--- Running Parser & Compute Tests ---");
  const computeCases = [
    { expr: "A + A", expected: "B", ok: true },
    { expr: "B + B", expected: "BB", ok: true },
    { expr: "BB + BB", expected: "BBB", ok: true },
    { expr: "A + B", expected: "B A", ok: true },
    { expr: "", ok: false, error: "CRITICAL: No input detected" },
    { expr: "A", ok: false, error: "LOGIC ERROR: Insufficient operands" },
    { expr: "A + C", ok: false, error: "SYSTEM ALERT: Unauthorized character" },
  ];

  computeCases.forEach(({ expr, expected, ok, error }) => {
    const result = compute(expr);
    if (result.ok === ok) {
      if (ok) {
        if (result.result === expected) {
          console.log(`PASS: compute("${expr}") = ${result.result}`);
          passed++;
        } else {
          console.error(`FAIL: compute("${expr}") = ${result.result} (expected ${expected})`);
        }
      } else {
        if (result.error.includes(error)) {
          console.log(`PASS: compute("${expr}") correctly failed with: ${result.error}`);
          passed++;
        } else {
          console.error(`FAIL: compute("${expr}") failed with wrong error: ${result.error} (expected to include: ${error})`);
        }
      }
    } else {
      console.error(`FAIL: compute("${expr}") ok=${result.ok} (expected ${ok})`);
    }
  });

  const total = arithmeticCases.length + computeCases.length;
  console.log(`\nTests: ${passed}/${total} passed`);
  if (passed !== total) process.exit(1);
}

test();
