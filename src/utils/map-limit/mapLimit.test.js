const { mapLimit } = require("./mapLimit");
const { sleep } = require("../sleep/sleep");

async function checkMapLimit() {
  console.log("Testing mapLimit...");

  // Test 1: Basic functionality
  const items = [1, 2, 3, 4, 5];
  const results1 = await mapLimit(items, 2, async (n) => n * 2);
  console.assert(JSON.stringify(results1) === "[2,4,6,8,10]", "Should double all values");

  // Test 2: Concurrency limit is respected
  let concurrent = 0;
  let maxConcurrent = 0;

  const trackedResults = await mapLimit([1, 2, 3, 4], 2, async (n) => {
    concurrent++;
    maxConcurrent = Math.max(maxConcurrent, concurrent);
    await sleep(50);
    concurrent--;
    return n;
  });

  console.assert(maxConcurrent <= 2, `Max concurrent should be <= 2, was ${maxConcurrent}`);
  console.assert(trackedResults.length === 4, "Should return all results");

  // Test 3: Maintains order
  const delays = [100, 10, 50, 20];
  const orderedResults = await mapLimit(delays, 2, async (ms, i) => {
    await sleep(ms);
    return i;
  });
  console.assert(JSON.stringify(orderedResults) === "[0,1,2,3]", "Should maintain order");

  // Test 4: Error handling
  try {
    await mapLimit([1, 2, 3], 2, async (n) => {
      if (n === 2) throw new Error("Fail on 2");
      return n * 10;
    });
    console.assert(false, "Should have thrown");
  } catch (e) {
    console.assert(e.message === "Fail on 2", "Should propagate error");
  }

  // Test 5: Invalid limit
  try {
    await mapLimit([1], 0, async (n) => n);
    console.assert(false, "Should reject limit 0");
  } catch (e) {
    console.assert(e.message.includes("positive"), "Should reject non-positive limit");
  }

  console.log("✓ mapLimit passed");
}

if (require.main === module) {
  checkMapLimit().catch(console.error);
}

module.exports = { checkMapLimit };
