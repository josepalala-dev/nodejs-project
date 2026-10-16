const { withTimeout } = require("./withTimeout");
const { sleep } = require("../sleep/sleep");

async function checkWithTimeout() {
  console.log("Testing withTimeout...");

  // Test 1: Resolves before timeout
  const fastPromise = sleep(50).then(() => "fast result");
  const result1 = await withTimeout(fastPromise, 100);
  console.assert(result1 === "fast result", "Should return resolved value");

  // Test 2: Times out
  const slowPromise = sleep(200);
  try {
    await withTimeout(slowPromise, 50);
    console.assert(false, "Should have timed out");
  } catch (e) {
    console.assert(e.message === "Operation timed out", "Should throw timeout error");
  }

  // Test 3: Custom timeout message
  const anotherSlowPromise = sleep(200);
  try {
    await withTimeout(anotherSlowPromise, 50, "Custom timeout message");
    console.assert(false, "Should have timed out");
  } catch (e) {
    console.assert(e.message === "Custom timeout message", "Should use custom message");
  }

  // Test 4: Original promise still completes (no resource leak)
  let completed = false;
  const longPromise = sleep(100).then(() => { completed = true; });
  await withTimeout(longPromise, 50).catch(() => {});
  await sleep(150); // Wait for original to finish
  console.assert(completed, "Original promise should still complete");

  console.log("✓ withTimeout passed");
}

if (require.main === module) {
  checkWithTimeout().catch(console.error);
}

module.exports = { checkWithTimeout };
