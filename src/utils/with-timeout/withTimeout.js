/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @param {string|Error} [message] - Custom timeout message
 * @returns {Promise<any>} - Resolves with promise result or rejects on timeout
 */
function withTimeout(promise, ms, message = "Operation timed out") {
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message));
    }, ms);

    // Clean up timer if original promise resolves first
    promise.finally(() => clearTimeout(timer));
  });

  return Promise.race([promise, timeoutPromise]);
}

module.exports = { withTimeout };
