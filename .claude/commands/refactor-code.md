# Refactor Code

You are tasked with refactoring code to improve quality, maintainability, and performance while preserving functionality.

## Refactoring Goals

Improve code by addressing:
- Code duplication (DRY principle)
- Complex functions (break into smaller pieces)
- Poor naming (make intentions clear)
- Tight coupling (improve modularity)
- Missing abstractions (identify patterns)
- Code smells and anti-patterns

## Refactoring Process

### 1. Understand the Code
- Read and comprehend existing functionality
- Identify the purpose and use cases
- Note any existing tests
- Understand dependencies and side effects

### 2. Identify Issues
Look for:
- **Long functions** (>50 lines) - break into smaller functions
- **Duplicate code** - extract to shared functions
- **Magic numbers/strings** - replace with named constants
- **Deep nesting** - flatten with early returns
- **Large classes** - split by responsibility
- **Poor names** - rename for clarity
- **Comments explaining what** - make code self-documenting
- **Tightly coupled code** - introduce abstractions

### 3. Plan Refactoring
- Prioritize changes by impact
- Identify safe, incremental steps
- Ensure tests exist or create them first
- Consider backward compatibility

### 4. Execute Refactoring

**Extract Function**
```typescript
// Before
function processOrder(order) {
  // validate
  if (!order.items || order.items.length === 0) throw new Error();
  // calculate
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  // apply discount
  if (order.coupon) total *= 0.9;
  return total;
}

// After
function processOrder(order) {
  validateOrder(order);
  const subtotal = calculateSubtotal(order.items);
  return applyDiscount(subtotal, order.coupon);
}

function validateOrder(order) {
  if (!order.items?.length) {
    throw new Error('Order must have items');
  }
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(amount, coupon) {
  return coupon ? amount * 0.9 : amount;
}
```

**Extract Constant**
```typescript
// Before
if (user.age >= 18) { /* ... */ }

// After
const MINIMUM_AGE = 18;
if (user.age >= MINIMUM_AGE) { /* ... */ }
```

**Simplify Conditionals**
```typescript
// Before
if (user.isActive === true && user.role === 'admin' && user.verified === true) {
  // ...
}

// After
const isAuthorizedAdmin = user.isActive && user.role === 'admin' && user.verified;
if (isAuthorizedAdmin) {
  // ...
}
```

**Replace Nested Conditionals with Guard Clauses**
```typescript
// Before
function getDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.purchases > 10) {
        return 0.2;
      } else {
        return 0.1;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

// After
function getDiscount(user) {
  if (!user || !user.isPremium) return 0;
  return user.purchases > 10 ? 0.2 : 0.1;
}
```

**Extract Class/Module**
```typescript
// Before - everything in one class
class User {
  name: string;
  email: string;
  password: string;

  validateEmail() { /* ... */ }
  hashPassword() { /* ... */ }
  sendWelcomeEmail() { /* ... */ }
}

// After - separated concerns
class User {
  name: string;
  email: string;
  passwordHash: string;
}

class UserValidator {
  static validateEmail(email: string): boolean { /* ... */ }
}

class PasswordService {
  static hash(password: string): string { /* ... */ }
}

class EmailService {
  static sendWelcome(user: User): Promise<void> { /* ... */ }
}
```

### 5. Verify Changes
- Run existing tests
- Add new tests if needed
- Verify behavior is unchanged
- Check performance impact
- Review with code-reviewer agent if needed

## Refactoring Principles

**Boy Scout Rule**: Leave code cleaner than you found it

**Red-Green-Refactor**:
1. Red: Write failing test
2. Green: Make it pass (quick and dirty)
3. Refactor: Clean up while keeping tests green

**SOLID Principles**:
- Single Responsibility: One reason to change
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes must be substitutable
- Interface Segregation: Many specific interfaces
- Dependency Inversion: Depend on abstractions

## What NOT to Refactor

Avoid:
- Changing functionality
- Refactoring without tests
- Premature optimization
- Over-engineering simple code
- Breaking public APIs without versioning

## Output

For each refactoring:
1. Explain what was changed and why
2. Show before/after code snippets
3. Note any breaking changes
4. Recommend follow-up improvements
5. Suggest additional tests if needed

Begin by analyzing the specified code and proposing refactoring improvements.
