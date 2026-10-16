const { sleep } = require("./sleep");

async function checkSleep() {
  console.log("Testing sleep...");

  const start = Date.now();
  await sleep(100);
  const elapsed = Date.now() - start;

  // Should be at least 100ms (allowing small margin for timer inaccuracy)
  console.assert(elapsed >= 95, `Expected >= 95ms, got ${elapsed}ms`);
  console.assert(elapsed < 200, `Expected < 200ms, got ${elapsed}ms`);

  console.log("✓ sleep passed");
}

if (require.main === module) {
  checkSleep().catch(console.error);
}

module.exports = { checkSleep };
