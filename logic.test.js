const { tokenToValue, valueToTokens, parseExpression, compute } = require('./app.js');

function test() {
  console.log("--- Running Arithmetic Tests ---");
  const arithmeticCases = [
    { input: ['A', 'A'], op: '+', expected: 'B' },
    { input: ['B', 'B'], op: '+', expected: 'BB' },
    { input: ['BB', 'BB'], op: '+', expected: 'BBB' },
    { input: ['A', 'B'], op: '+', expected: 'B A' },
    { input: ['A', 'A', 'B'], op: '+', expected: 'BB' },
    { input: ['BB', 'B', 'A'], op: '+', expected: 'BB B A' },
    { input: ['BBB', 'BBB'], op: '+', expected: 'BBBB' },
  ];

  let passed = 0;
  arithmeticCases.forEach(({ input, op, expected }) => {
    let resultVal = input.reduce((acc, t) => acc + tokenToValue(t), 0);
    const result = valueToTokens(resultVal).join(' ');
    if (result === expected) {
      console.log(`PASS: ${input.join(' ' + op + ' ')} = ${result}`);
      passed++;
    } else {
      console.error(`FAIL: ${input.join(' ' + op + ' ')} = ${result} (expected ${expected})`);
    }
  });

  console.log("\n--- Running Parser & Compute Tests ---");
  const computeCases = [
    { expr: "A + A", expected: "B", ok: true },
    { expr: "B + B", expected: "BB", ok: true },
    { expr: "BB + BB", expected: "BBB", ok: true },
    { expr: "A + B", expected: "B A", ok: true },
    { expr: "", ok: false, error: "Error: Input buffer is empty." },
    { expr: "A", ok: false, error: "Error: Incomplete expression." },
    { expr: "A + C", ok: false, error: "Error: Invalid token detected" },
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