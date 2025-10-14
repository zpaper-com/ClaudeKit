# Bun v1.3 Release Notes

> Release date: [Date from announcement]
>
> **Major milestone**: Bun evolves from a JavaScript runtime into a full-stack development platform

## Overview

Bun 1.3 represents a major evolution, transforming from a fast JavaScript runtime into a comprehensive full-stack platform with first-class frontend development support, unified database APIs, and extensive package management improvements.

---

## 🎨 Frontend Development

### HTML Support
- **Direct HTML execution**: Run HTML files directly with `bun run`
- **Automatic transpilation**: Native JavaScript and CSS processing
- **Hot Module Replacement (HMR)**: Live reload during development
- **React Fast Refresh**: Component-level updates without losing state

### Production Builds
```bash
bun build --production
```
- Optimized production bundles
- Automatic minification and tree-shaking
- CSS bundling and optimization

### Project Scaffolding
```bash
bun init --react
```
- Instant React project setup
- Pre-configured development environment
- Ready-to-use build pipeline

---

## 🚀 Full-Stack Development

### Unified Routing System
- **Parameterized routes**: `/users/:id`
- **Catch-all routes**: `/docs/**`
- **Type-safe routing**: Full TypeScript support
- **Built-in middleware**: CORS, authentication, etc.

### Seamless Integration
- **No CORS issues**: Frontend and backend run in same process
- **Shared code**: Reuse utilities between client and server
- **Single build output**: Compile to standalone executable

### Standalone Executables
```bash
bun build --compile
```
- Bundle frontend + backend into single binary
- Zero dependencies required for deployment
- Cross-platform compilation support

---

## 💾 Database Support

### Unified SQL API
One consistent API for multiple databases:
- **MySQL** / **MariaDB**
- **PostgreSQL**
- **SQLite**

```typescript
import { Database } from 'bun:sql';

const db = new Database('postgresql://localhost/mydb');
const users = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### Built-in Redis Client
- **7.9x faster** than ioredis
- Native protocol implementation
- Connection pooling included
- Pub/sub support

### PostgreSQL Enhancements
- **Simple query protocol**: Faster queries for simple operations
- **Unix socket support**: Better local performance
- **Array type support**: Native PostgreSQL array handling
- **Better error messages**: Clearer debugging information

### SQLite Improvements
- **Deserialization options**: Control how data is parsed
- **Column type introspection**: Runtime type information
- **Performance optimizations**: Faster queries and inserts
- **Better transaction handling**: Improved ACID guarantees

---

## 📦 Package Management

### Dependency Catalogs
Synchronize versions across monorepo workspaces:

```json
{
  "catalogs": {
    "react": "18.2.0",
    "typescript": "5.3.3"
  },
  "dependencies": {
    "react": "catalog:",
    "typescript": "catalog:"
  }
}
```

### Isolated Installs
- **Default for workspaces**: Prevents dependency conflicts
- **Faster installs**: Parallel package resolution
- **Smaller node_modules**: Deduplication improvements

### Lockfile Migration
```bash
bun install --migrate
```
- Import from `pnpm-lock.yaml`
- Import from `yarn.lock`
- Automatic conversion to `bun.lockb`

### Security Scanner API
```typescript
import { vulnerabilities } from 'bun';

const issues = await vulnerabilities.scan();
for (const vuln of issues) {
  console.log(`${vuln.package}: ${vuln.severity}`);
}
```

### Supply Chain Protection
```json
{
  "bunfig": {
    "minReleaseAge": "7d"
  }
}
```
- Prevent installing packages released in last N days
- Protect against compromised packages
- Configurable per-project or globally

### New Commands
- **`bun why <package>`**: Show why package is installed
- **`bun update --interactive`**: Choose which packages to update
- **`bun info <package>`**: Display package metadata
- **`bun audit`**: Security vulnerability scanning

---

## 🧪 Testing & Debugging

### Async Stack Traces
Complete call chains across async operations:
```typescript
Error: Failed to fetch
    at fetchUser (user.ts:10)
    at handleRequest (api.ts:25)
    at processQueue (queue.ts:42)
```

### VS Code Test Explorer Integration
- Run tests from sidebar
- Debug individual tests
- View test results inline
- Watch mode support

### Concurrent Testing
```typescript
import { test } from 'bun:test';

test.concurrent('test 1', async () => {
  // Runs in parallel
});

test.concurrent('test 2', async () => {
  // Runs in parallel
});
```

### Test Randomization
```bash
bun test --randomize
```
- Detect test order dependencies
- Find flaky tests
- Improve test reliability

### Type Testing
```typescript
import { expectTypeOf } from 'bun:test';

expectTypeOf<string>().toBeString();
expectTypeOf<number>().not.toBeString();
expectTypeOf(myFunc).returns.toBeNumber();
```

### Expected Failures
```typescript
test.failing('known bug', () => {
  // Test that should fail
  expect(buggyFunction()).toBe(expected);
});
```

---

## 🔒 Security Features

### OS-Native Credential Storage
```typescript
import { secrets } from 'bun';

// Store securely in system keychain
await secrets.set('api-key', 'secret-value');

// Retrieve from system keychain
const apiKey = await secrets.get('api-key');
```

Supported:
- **macOS**: Keychain
- **Linux**: Secret Service API
- **Windows**: Credential Manager

### CSRF Protection
```typescript
import { CSRF } from 'bun';

const token = CSRF.generateToken();
const isValid = CSRF.verifyToken(token, request);
```

### Crypto Performance Improvements
- **DiffieHellman**: 400x faster
- **scrypt**: 6x faster
- **ECDH**: Significant improvements
- **HMAC**: Better throughput

---

## 🛠️ APIs & Standards

### YAML Support
```typescript
import { YAML } from 'bun';

const data = YAML.parse(yamlString);
const yaml = YAML.stringify(data);
```

### WebSocket Improvements
- **Automatic compression**: Per-message deflate
- **Binary frame support**: More efficient for binary data
- **Ping/pong handling**: Better connection stability
- **Backpressure management**: Handle slow clients

### Node.js Compatibility
- **95%+ compatibility**: Most npm packages work
- **Better worker_threads support**: Multi-threading improvements
- **Improved fs module**: More edge cases handled
- **Stream enhancements**: Better performance and compatibility

### Web Standards
- **Fetch API improvements**: Better error handling
- **FormData enhancements**: File upload support
- **URL improvements**: Better encoding/decoding
- **AbortController**: Cancellation support

---

## ⚡ Performance Improvements

### Startup Time
- **10-15% faster** cold starts
- **Optimized module resolution**: Faster imports
- **Better caching**: Reuse compiled code

### Runtime Performance
- **JSON parsing**: 2x faster for large payloads
- **HTTP server**: Up to 30% higher throughput
- **File I/O**: Async operations optimized
- **Memory usage**: Reduced footprint

### Build Performance
- **Incremental builds**: Only recompile changed files
- **Parallel processing**: Utilize all CPU cores
- **Better caching**: Faster subsequent builds

---

## 🐛 Bug Fixes

### Package Management
- Fixed dependency resolution edge cases
- Improved peer dependency handling
- Better error messages for conflicts
- Fixed workspace symlink issues

### Runtime
- Fixed memory leaks in long-running processes
- Better error handling in async contexts
- Fixed edge cases in module resolution
- Improved Windows compatibility

### Testing
- Fixed flaky test detection
- Better cleanup after test failures
- Improved snapshot diffing
- Fixed coverage reporting issues

---

## 📚 Documentation & Tooling

### Enhanced Documentation
- New full-stack tutorials
- Database integration guides
- Security best practices
- Migration guides from Node.js

### Developer Experience
- Better error messages
- Improved TypeScript types
- Enhanced IDE support
- More helpful warnings

---

## 🔄 Breaking Changes

⚠️ **Note**: Minimal breaking changes in this release

- Isolated installs now default for workspaces (can be disabled)
- Some internal APIs changed (unlikely to affect most users)
- Updated minimum supported platforms (check docs)

---

## 📥 Installation

### Install or upgrade to Bun 1.3:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Upgrade existing installation
bun upgrade
```

### Verify installation:
```bash
bun --version
# Should output: 1.3.x
```

---

## 🎯 Getting Started

### Create a new full-stack project:
```bash
bun init --react
cd my-app
bun run dev
```

### Try the new database API:
```bash
bun add bun:sql
```

```typescript
import { Database } from 'bun:sql';

const db = new Database('sqlite:./mydb.sqlite');
await db.query('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
```

---

## 🙏 Community & Contributing

- **Contributors**: 100+ contributors to this release
- **GitHub**: [oven-sh/bun](https://github.com/oven-sh/bun)
- **Discord**: Join the Bun community
- **Twitter**: [@bunjavascript](https://twitter.com/bunjavascript)

---

## 📖 Resources

- **Official Blog**: https://bun.com/blog/bun-v1.3
- **Documentation**: https://bun.sh/docs
- **GitHub Releases**: https://github.com/oven-sh/bun/releases
- **Examples**: https://github.com/oven-sh/bun/tree/main/examples

---

## What's Next?

The Bun team is already working on:
- Enhanced debugging tools
- More database integrations
- Improved build pipeline
- Better IDE integrations
- Extended Node.js compatibility

Stay tuned for future releases! 🚀
