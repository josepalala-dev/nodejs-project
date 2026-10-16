/**
 * Maps over an array with limited concurrency
 * @param {Array} array - Array to map over
 * @param {number} limit - Maximum concurrent operations
 * @param {Function} fn - Async mapper function (item, index) => Promise
 * @returns {Promise<Array>} - Array of results in original order
 */
async function mapLimit(array, limit, fn) {
  if (limit <= 0) {
    throw new Error("Limit must be positive");
  }

  const results = new Array(array.length);
  const executing = new Set();

  for (let i = 0; i < array.length; i++) {
    const promise = (async () => {
      try {
        results[i] = await fn(array[i], i);
      } catch (error) {
        results[i] = { error, index: i, item: array[i] };
      }
    })();

    executing.add(promise);

    // When we hit the limit, wait for at least one to complete
    if (executing.size >= limit) {
      await Promise.race(executing);
    }

    // Clean up completed promises
    promise.then(() => executing.delete(promise)).catch(() => executing.delete(promise));
  }

  // Wait for remaining promises
  await Promise.all(executing);

  // Check for errors and throw the first one
  const firstError = results.find(r => r && r.error);
  if (firstError) {
    throw firstError.error;
  }

  return results;
}

// Alternative: simpler version that throws immediately on error
async function mapLimitStrict(array, limit, fn) {
  if (limit <= 0) {
    throw new Error("Limit must be positive");
  }

  const results = new Array(array.length);

  // Process in chunks
  for (let i = 0; i < array.length; i += limit) {
    const chunk = array.slice(i, i + limit);
    const chunkResults = await Promise.all(
      chunk.map((item, idx) => fn(item, i + idx))
    );
    chunkResults.forEach((r, idx) => {
      results[i + idx] = r;
    });
  }

  return results;
}

module.exports = { mapLimit, mapLimitStrict };
