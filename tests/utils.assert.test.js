const assert = require("node:assert");
const test = require("node:test");

const { sleep } = require("../src/utils/sleep/sleep");
const { retry } = require("../src/utils/retry/retry");
const { withTimeout } = require("../src/utils/with-timeout/withTimeout");
const { mapLimit, mapLimitStrict } = require("../src/utils/map-limit/mapLimit");

test("sleep resolves after approximately the given delay", async () => {
  const start = Date.now();
  await sleep(50);
  const elapsed = Date.now() - start;
  assert.ok(elapsed >= 40, `expected elapsed (${elapsed}ms) to be >= 40ms`);
});

test("retry returns the result on first success", async () => {
  let calls = 0;
  const result = await retry(async () => {
    calls++;
    return "ok";
  });
  assert.strictEqual(result, "ok");
  assert.strictEqual(calls, 1);
});

test("retry retries until success and reports attempts via onRetry", async () => {
  let calls = 0;
  const retriedAttempts = [];
  const result = await retry(
    async () => {
      calls++;
      if (calls < 3) throw new Error("fail");
      return "recovered";
    },
    {
      delay: 1,
      onRetry: (error, attempt) => retriedAttempts.push(attempt),
    }
  );
  assert.strictEqual(result, "recovered");
  assert.strictEqual(calls, 3);
  assert.deepStrictEqual(retriedAttempts, [1, 2]);
});

test("retry throws the last error once maxRetries is exhausted", async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      retry(
        async () => {
          calls++;
          throw new Error("always fails");
        },
        { maxRetries: 2, delay: 1 }
      ),
    /always fails/
  );
  assert.strictEqual(calls, 3);
});

test("withTimeout resolves when the promise settles before the timeout", async () => {
  const result = await withTimeout(sleep(10).then(() => "done"), 100);
  assert.strictEqual(result, "done");
});

test("withTimeout rejects with the timeout message when too slow", async () => {
  await assert.rejects(
    () => withTimeout(sleep(100), 10, "too slow"),
    /too slow/
  );
});

test("mapLimit maps items while preserving order", async () => {
  const results = await mapLimit([1, 2, 3, 4], 2, async (item) => item * 2);
  assert.deepStrictEqual(results, [2, 4, 6, 8]);
});

test("mapLimit throws when limit is not positive", async () => {
  await assert.rejects(
    () => mapLimit([1, 2], 0, async (item) => item),
    /Limit must be positive/
  );
});

test("mapLimit propagates the first error encountered", async () => {
  await assert.rejects(
    () =>
      mapLimit([1, 2, 3], 2, async (item) => {
        if (item === 2) throw new Error("item failed");
        return item;
      }),
    /item failed/
  );
});

test("mapLimitStrict maps items while preserving order", async () => {
  const results = await mapLimitStrict([1, 2, 3, 4], 2, async (item) => item + 1);
  assert.deepStrictEqual(results, [2, 3, 4, 5]);
});

test("mapLimitStrict throws when limit is not positive", async () => {
  await assert.rejects(
    () => mapLimitStrict([1, 2], 0, async (item) => item),
    /Limit must be positive/
  );
});
