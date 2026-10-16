const { retry } = require("./retry");

async function checkRetry() {
  console.log("Testing retry...");

  // Test 1: Success on first try
  let callCount = 0;
  const successFn = async () => {
    callCount++;
    return "success";
  };

  const result1 = await retry(successFn);
  console.assert(result1 === "success", "Should return success");
  console.assert(callCount === 1, "Should call once on success");

  // Test 2: Success after failures
  callCount = 0;
  const flakyFn = async () => {
    callCount++;
    if (callCount < 3) {
      throw new Error(`Attempt ${callCount} failed`);
    }
    return "eventually succeeded";
  };

  const result2 = await retry(flakyFn, { maxRetries: 5 });
  console.assert(result2 === "eventually succeeded", "Should eventually succeed");
  console.assert(callCount === 3, "Should retry until success");

  // Test 3: Failure after max retries
  callCount = 0;
  const alwaysFailFn = async () => {
    callCount++;
    throw new Error("Always fails");
  };

  try {
    await retry(alwaysFailFn, { maxRetries: 2, delay: 10 });
    console.assert(false, "Should have thrown");
  } catch (e) {
    console.assert(e.message === "Always fails", "Should throw last error");
    console.assert(callCount === 3, "Should try initial + 2 retries = 3 times");
  }

  // Test 4: onRetry callback
  let retryCalls = [];
  const fnWithRetryCallback = async () => {
    throw new Error("fail");
  };

  try {
    await retry(fnWithRetryCallback, {
      maxRetries: 2,
      delay: 10,
      onRetry: (err, attempt) => {
        retryCalls.push({ error: err.message, attempt });
      }
    });
  } catch (e) {
    // expected
  }

  console.assert(retryCalls.length === 2, "Should call onRetry for each retry");
  console.assert(retryCalls[0].attempt === 1, "First retry is attempt 1");
  console.assert(retryCalls[1].attempt === 2, "Second retry is attempt 2");

  console.log("✓ retry passed");
}

if (require.main === module) {
  checkRetry().catch(console.error);
}

module.exports = { checkRetry };
