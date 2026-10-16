// ============================================================
// Async Control Flow Utilities
// Implementations now live in src/utils/; this file re-exports
// them and runs their self-checks when executed directly.
// ============================================================

const { sleep } = require("./sleep/sleep");
const { retry } = require("./retry/retry");
const { withTimeout } = require("./with-timeout/withTimeout");
const { mapLimit, mapLimitStrict } = require("./map-limit/mapLimit");

const { checkSleep } = require("./sleep/sleep.test");
const { checkRetry } = require("./retry/retry.test");
const { checkWithTimeout } = require("./with-timeout/withTimeout.test");
const { checkMapLimit } = require("./map-limit/mapLimit.test");

async function runAllChecks() {
  console.log("=".repeat(50));
  console.log("Running Self-Checks");
  console.log("=".repeat(50));

  await checkSleep();
  await checkRetry();
  await checkWithTimeout();
  await checkMapLimit();

  console.log("=".repeat(50));
  console.log("All checks passed! ✓");
  console.log("=".repeat(50));
}

// Run if this file is executed directly
if (require.main === module) {
  runAllChecks().catch(console.error);
}

module.exports = { sleep, retry, withTimeout, mapLimit, mapLimitStrict };
