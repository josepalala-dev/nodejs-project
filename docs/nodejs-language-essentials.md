# Node.js Language Essentials — Cheat Sheet

Practical syntax reference for Node.js async concepts and core modules. Code first, minimal prose. Inspired by the structure of [devhints.io/nodejs](https://devhints.io/nodejs).

## Promises

```js
// Creating a promise
const task = new Promise((resolve, reject) => {
  const ok = true
  if (ok) resolve('done')
  else reject(new Error('failed'))
})

// Consuming
task
  .then(result => console.log(result))
  .catch(err => console.error(err))
  .finally(() => console.log('cleanup'))

// Chaining
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err))

// Wrapping a callback-based API
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
```

### Promise combinators

```js
Promise.all([p1, p2, p3])        // all resolve, or rejects on first failure
Promise.allSettled([p1, p2, p3]) // waits for all, never short-circuits
Promise.race([p1, p2, p3])       // settles with the first to settle
Promise.any([p1, p2, p3])        // resolves with first fulfilled, ignores rejections
```

```js
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
])
```

## async/await

```js
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Error handling
async function main() {
  try {
    const user = await getUser(1)
    console.log(user)
  } catch (err) {
    console.error('Failed:', err.message)
  }
}

// Sequential vs parallel awaits
for (const id of ids) {
  await process(id) // sequential — one at a time
}

await Promise.all(ids.map(id => process(id))) // parallel

// Async arrow functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const run = async () => {
  await delay(1000)
  console.log('tick')
}

// Top-level await (ESM only)
const data = await readFile('./config.json', 'utf8')
```

## File I/O — `fs/promises`

```js
import { readFile, writeFile, appendFile, mkdir, rm, readdir, stat } from 'node:fs/promises'

// Read
const text = await readFile('./file.txt', 'utf8')
const buf = await readFile('./file.bin') // Buffer, no encoding

// Write (overwrites)
await writeFile('./out.txt', 'hello world', 'utf8')

// Append
await appendFile('./log.txt', 'new line\n')

// Directories
await mkdir('./tmp', { recursive: true })
await rm('./tmp', { recursive: true, force: true })
const entries = await readdir('./src')

// Metadata
const info = await stat('./file.txt')
info.isFile()
info.isDirectory()
info.size

// Pattern: read, transform, write
async function upperCaseFile(path) {
  const content = await readFile(path, 'utf8')
  await writeFile(path, content.toUpperCase())
}
```

### Streams (for large files)

```js
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

await pipeline(
  createReadStream('./big-input.txt'),
  createWriteStream('./big-output.txt')
)
```

## Event Emitters

```js
import { EventEmitter } from 'node:events'

class Orders extends EventEmitter {}
const orders = new Orders()

// Subscribe
orders.on('created', (order) => {
  console.log('Order created:', order.id)
})

// One-time listener
orders.once('created', () => console.log('fires only once'))

// Emit
orders.emit('created', { id: 42 })

// Remove listener
function handler(order) { console.log(order) }
orders.on('created', handler)
orders.off('created', handler)

// Error events (special — throws if unhandled)
orders.on('error', (err) => console.error('Caught:', err.message))
orders.emit('error', new Error('boom'))

// Async pattern with emitters + promises
function waitForEvent(emitter, eventName) {
  return new Promise(resolve => emitter.once(eventName, resolve))
}
const order = await waitForEvent(orders, 'created')
```

## Quick Reference — when to use what

| Need | Use |
|---|---|
| Run multiple async tasks, fail fast | `Promise.all` |
| Run multiple async tasks, want all results regardless of failure | `Promise.allSettled` |
| First result wins | `Promise.race` / `Promise.any` |
| Sequential async steps | `await` in a loop or chained `.then()` |
| Small file read/write | `fs/promises` |
| Large file read/write | `fs.createReadStream` / `createWriteStream` + `pipeline` |
| Decoupled pub/sub within a process | `EventEmitter` |

## From devhints.io/nodejs

The devhints.io/nodejs page itself is a thin top-level sheet (it mostly links out to dedicated Node.js cheatsheets). Its actual content:

```js
// Globals
__filename
__dirname
```

```js
// child_process.exec
var exec = require('child_process').exec

var child = exec('cat *.js bad_file | wc -l',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
```

```js
// Snippets
info = require('../package.json')
info.version

process.stdout.write(util.inspect(objekt, false, Infinity, true) + '\n');
```

```js
// child_process.spawn — passthru the in/out
var spawn = require('child_process').spawn;
var proc = spawn(bin, argv, { stdio: 'inherit' });
proc.on('error', function(err) {
  if (err.code == "ENOENT") { "does not exist" }
  if (err.code == "EACCES") { "not executable" }
});
proc.on('exit', function(code) { ... });

// also { stdio: ['pipe', 'pipe', process.stdout] }
// also { stdio: [process.stdin, process.stderr, process.stdout] }

proc.stdout.on('data', function (data) {
});
proc.stderr.on('data', function (data) {
});
```

Related devhints.io cheatsheets worth checking for deeper dives: `nodejs-fs`, `nodejs-stream`, `nodejs-process`, `nodejs-path`, `nodejs-assert`, `package-json`.

## Sources

- [devhints.io/nodejs](https://devhints.io/nodejs) — Node.js cheatsheet (primary syntax reference)
- Node.js official docs: `fs/promises`, `events`, `stream/promises` modules
