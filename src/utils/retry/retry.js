const { sleep } = require("../sleep/sleep");

/**
 * Retries an async function until it succeeds or max retries reached
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Options object
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.delay - Initial delay in ms (default: 100)
 * @param {Function} options.onRetry - Callback on retry (error, attemptNumber) => void
 * @returns {Promise<any>} - Result of fn
 */
async function retry(fn, options = {}) {
  const { maxRetries = 3, delay = 100, onRetry } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(error, attempt + 1);
      }

      // Exponential backoff: delay * 2^attempt
      const backoffDelay = delay * Math.pow(2, attempt);
      await sleep(backoffDelay);
    }
  }

  throw lastError;
}

module.exports = { retry };
