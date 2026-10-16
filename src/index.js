const { sleep } = require("./utils/sleep/sleep");

async function main() {
  console.log("Hello, Node.js!");
  await sleep(100);
  console.log("Done after 100ms.");
}

main();
