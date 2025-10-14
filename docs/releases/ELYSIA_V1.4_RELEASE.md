# Elysia v1.4 "Supersymmetry" Release Notes

> **Elysia 1.4** - Supersymmetry
>
> A major release focused on type safety, schema flexibility, and developer experience improvements

## Overview

Elysia 1.4 introduces support for multiple schema validators through the Standard Schema specification, significantly enhanced macro capabilities, complete type soundness across lifecycle events, and improved type inference performance.

---

## 🎯 Standard Schema Support

### Multiple Validator Support

Elysia now supports **multiple schema validators** through the [Standard Schema](https://github.com/standard-schema/standard-schema) specification, allowing you to use your favorite validation library:

- **Zod**
- **Valibot**
- **Effect Schema**
- **ArkType**
- **Joi**
- **TypeBox** (default)
- And more...

### Usage Example

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

new Elysia()
  .get('/user/:id', ({ params }) => {
    return { id: params.id }
  }, {
    params: z.object({
      id: z.string().uuid()
    })
  })
```

### Switch Validators Seamlessly

```typescript
import { Elysia } from 'elysia'
import * as v from 'valibot'

new Elysia()
  .post('/signup', ({ body }) => {
    return { email: body.email }
  }, {
    body: v.object({
      email: v.pipe(v.string(), v.email()),
      password: v.pipe(v.string(), v.minLength(8))
    })
  })
```

### Benefits

- **Use your preferred validator** - No need to learn TypeBox if you prefer Zod or Valibot
- **Interchangeable schemas** - Mix and match validators across different routes
- **Consistent API** - Same Elysia interface regardless of validator choice
- **Full type inference** - TypeScript types work seamlessly with all validators

---

## 🔧 Enhanced Macro System

### Schema Support in Macros

Macros now support **schema definitions**, enabling custom validation directly within macro implementations:

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
  .macro(({ onBeforeHandle }) => ({
    role(role: 'user' | 'admin') {
      onBeforeHandle(({ error, headers }) => {
        const userRole = headers['x-role']

        if (userRole !== role) {
          return error(403, 'Insufficient permissions')
        }
      })
    }
  }))

const app = new Elysia()
  .use(plugin)
  .get('/admin', () => 'Admin only', {
    role: 'admin'
  })
```

### Macro Extensions

Build upon existing macros **recursively** with automatic deduplication:

```typescript
const authPlugin = new Elysia()
  .macro(() => ({
    isAuth(enabled: boolean) {
      // Authentication logic
    }
  }))

const rolePlugin = new Elysia()
  .use(authPlugin)
  .macro(() => ({
    role(role: string) {
      // Extends isAuth macro
      return {
        isAuth: true,
        checkRole: role
      }
    }
  }))
```

**Features:**
- Automatic deduplication prevents duplicate execution
- Stack limit of 16 to prevent infinite loops
- Type-safe composition of macro behaviors

---

## 📐 Lifecycle Type Soundness

### Complete Type Inference

Through refactoring **over 3,000 lines of type code**, Elysia now provides:

- **Complete type inference** for all lifecycle events
- **Accurate documentation** of all possible return types
- **Type-safe macros** with full IntelliSense support

### Before (1.3)

```typescript
app.get('/user', ({ set }) => {
  // set.status had limited type inference
  set.status = 200
})
```

### After (1.4)

```typescript
app.get('/user', ({ set }) => {
  // Full type inference for all possible status codes
  set.status = 200 // ✓
  set.status = 404 // ✓
  set.status = 'OK' // ✗ Type error
})
```

### Benefits

- **Better IDE support** - Accurate autocomplete and error detection
- **Improved documentation** - Types serve as living documentation
- **Fewer runtime errors** - Catch issues at compile time

---

## 📦 Group Standalone Schema

### Coexisting Schemas

Schema definitions in groups now **coexist with route schemas** rather than overwriting them:

### Before (1.3)

```typescript
app.group('/api', (app) =>
  app
    .guard({
      headers: t.Object({
        authorization: t.String()
      })
    })
    .get('/users', () => users, {
      // Had to manually include existing schemas
      headers: t.Object({
        authorization: t.String(), // Duplicate!
        'x-api-key': t.String()
      })
    })
)
```

### After (1.4)

```typescript
app.group('/api', (app) =>
  app
    .guard({
      headers: t.Object({
        authorization: t.String()
      })
    })
    .get('/users', () => users, {
      // Group schema is automatically included
      headers: t.Object({
        'x-api-key': t.String()
      })
    })
)
```

**Benefits:**
- No more schema duplication
- Cleaner, more maintainable code
- Schemas compose naturally

---

## ⚡ Performance Improvements

### Type Inference Performance

- **9-11% faster** type inference
- **11.57% reduction** in type instantiation
- Achieved despite significant increases in type complexity

### Impact

- Faster IDE response times
- Quicker TypeScript compilation
- Better developer experience with large codebases

---

## 🔨 Breaking Changes

### 1. Removed Macro v1

**Reason:** Lack of type soundness

```typescript
// ❌ No longer supported (Macro v1)
app.macro((instance) => {
  // Old macro API
})

// ✅ Use Macro v2
app.macro(({ onBeforeHandle }) => ({
  myMacro(value: string) {
    onBeforeHandle(() => {
      // Implementation
    })
  }
}))
```

### 2. Removed `error` Function

**Reason:** Use `status` for consistency

```typescript
// ❌ Removed
app.get('/user', ({ error }) => {
  return error(404, 'Not found')
})

// ✅ Use status instead
app.get('/user', ({ set }) => {
  set.status = 404
  return 'Not found'
})
```

### 3. Deprecated `response` in Lifecycle Hooks

**Use `responseValue` instead**

```typescript
// ❌ Deprecated
app
  .mapResponse(({ response }) => {
    return response
  })

// ✅ Use responseValue
app
  .mapResponse(({ responseValue }) => {
    return responseValue
  })
```

---

## ✨ Notable Enhancements

### 1. Automatic HEAD Method Generation

Elysia now automatically generates HEAD method handlers for GET routes:

```typescript
app.get('/users', () => users)

// Automatically available:
// HEAD /users
```

### 2. NoValidate Support in Reference Models

Skip validation for reference models when needed:

```typescript
app
  .model({
    user: t.Object({
      id: t.String(),
      email: t.String()
    })
  })
  .get('/user', ({ query }) => query, {
    query: 'user',
    noValidate: true // Skip validation
  })
```

### 3. Dynamic JSON Parsing for Cookies

Automatically parse JSON values in cookies:

```typescript
app.get('/preferences', ({ cookie }) => {
  // Automatically parsed if valid JSON
  return cookie.settings
})
```

### 4. Exported `fileType` for External Validation

```typescript
import { Elysia, fileType } from 'elysia'

const isImage = (file: File) => {
  return fileType(file, ['image/jpeg', 'image/png'])
}
```

---

## 📚 Migration Guide

### From Elysia 1.3 to 1.4

#### 1. Update Error Handling

```typescript
// Before
app.get('/user/:id', ({ params, error }) => {
  if (!exists(params.id)) {
    return error(404, 'User not found')
  }
})

// After
app.get('/user/:id', ({ params, set }) => {
  if (!exists(params.id)) {
    set.status = 404
    return 'User not found'
  }
})
```

#### 2. Update Macro Definitions

```typescript
// Before (Macro v1)
app.macro((instance) => {
  return {
    myMacro() {
      // Implementation
    }
  }
})

// After (Macro v2)
app.macro(({ onBeforeHandle }) => ({
  myMacro(config) {
    onBeforeHandle(() => {
      // Implementation
    })
  }
}))
```

#### 3. Update Lifecycle Hooks

```typescript
// Before
app.mapResponse(({ response }) => {
  return response
})

// After
app.mapResponse(({ responseValue }) => {
  return responseValue
})
```

#### 4. Simplify Group Schemas

```typescript
// Before - Manual duplication
app.group('/api', {
  headers: authHeader
}, (app) =>
  app.get('/users', () => users, {
    headers: t.Composite([
      authHeader,
      apiKeyHeader
    ])
  })
)

// After - Automatic composition
app.group('/api', {
  headers: authHeader
}, (app) =>
  app.get('/users', () => users, {
    headers: apiKeyHeader // authHeader automatically included
  })
)
```

---

## 🎨 Standard Schema Examples

### Using Zod

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  .post('/signup', ({ body }) => {
    return { success: true, user: body }
  }, {
    body: z.object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8)
    })
  })
```

### Using Valibot

```typescript
import { Elysia } from 'elysia'
import * as v from 'valibot'

const app = new Elysia()
  .get('/user/:id', ({ params }) => {
    return { id: params.id }
  }, {
    params: v.object({
      id: v.pipe(v.string(), v.uuid())
    })
  })
```

### Using Effect Schema

```typescript
import { Elysia } from 'elysia'
import { Schema as S } from '@effect/schema'

const app = new Elysia()
  .post('/product', ({ body }) => {
    return { created: body }
  }, {
    body: S.struct({
      name: S.string,
      price: S.number,
      tags: S.array(S.string)
    })
  })
```

### Mixing Validators

```typescript
import { Elysia, t } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  .post('/user', ({ body, query }) => {
    return { body, query }
  }, {
    body: z.object({
      name: z.string()
    }),
    query: t.Object({
      page: t.Number()
    })
  })
```

---

## 🚀 Getting Started

### Installation

```bash
# Install or upgrade Elysia
bun add elysia@latest

# With Zod
bun add zod

# With Valibot
bun add valibot

# With Effect Schema
bun add @effect/schema
```

### Verify Installation

```typescript
import { Elysia } from 'elysia'

console.log(Elysia.version) // Should be 1.4.x
```

### Quick Start

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  .get('/', () => 'Hello Elysia 1.4!')
  .post('/user', ({ body }) => body, {
    body: z.object({
      name: z.string(),
      email: z.string().email()
    })
  })
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:3000`)
```

---

## 📖 Resources

- **Official Blog**: https://elysiajs.com/blog/elysia-14.html
- **Documentation**: https://elysiajs.com/docs
- **GitHub**: https://github.com/elysiajs/elysia
- **Discord**: https://discord.gg/elysia
- **Twitter**: [@elysiajs](https://twitter.com/elysiajs)

---

## 🙏 Community & Contributing

- **Standard Schema Spec**: https://github.com/standard-schema/standard-schema
- **Contributors**: Thanks to all contributors who made this release possible
- **Sponsor**: Support Elysia development on GitHub Sponsors

---

## What's Next?

The Elysia team is working on:
- Additional Standard Schema validator support
- Enhanced plugin ecosystem
- Performance optimizations
- Better debugging tools
- Extended documentation and examples

Stay tuned for future releases! 🦊
