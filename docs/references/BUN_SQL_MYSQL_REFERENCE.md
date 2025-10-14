# Bun.SQL MySQL Reference Guide

## Overview
Bun.SQL is Bun's native, high-performance MySQL client. It uses tagged template literals for safe, SQL-injection-proof queries.

**Key Performance:** Up to 9x faster than mysql2 on Node.js.

## Critical Rules

### MUST DO
- ✅ Always use tagged template literals: `mysql\`SELECT * FROM users\``
- ✅ Use `mysql(object)` helper for inserts/updates with objects
- ✅ Use `mysql([array])` for WHERE IN clauses
- ✅ Handle transaction errors with try/catch or rely on auto-rollback
- ✅ Type your query results manually with TypeScript
- ✅ Use `mysql()` helper (not `sql()`) to match the connection variable name

### NEVER DO
- ❌ Never concatenate user input into SQL strings
- ❌ Never use `mysql.unsafe()` unless explicitly requested
- ❌ Don't use `localStorage` or `sessionStorage` (not supported in Bun context)
- ❌ Don't forget to close connections with `mysql.close()` when done

## Connection Setup

```typescript
import { SQL } from "bun";

// Using connection string (recommended)
const mysql = new SQL("mysql://user:password@127.0.0.1:3306/database");

// Using options object
const mysql = new SQL({
  adapter: "mysql",
  hostname: "127.0.0.1",
  port: 3306,
  username: "user",
  password: "password",
  database: "mydb",

  // Optional pool settings
  max: 20,              // Max concurrent connections
  idleTimeout: 30,      // Close idle connections after 30s
  maxLifetime: 3600,    // Max connection lifetime (seconds)
  connectionTimeout: 10 // Connection timeout (seconds)
});

// Environment variables (auto-detected)
// DATABASE_URL=mysql://user:password@localhost:3306/mydb
const mysql = new SQL(process.env.DATABASE_URL);
```

## Query Patterns

### SELECT Queries

```typescript
// Basic select with parameters
const users = await mysql`
  SELECT * FROM users
  WHERE active = ${true}
  AND age >= ${18}
`;

// Single row
const [user] = await mysql`
  SELECT * FROM users
  WHERE id = ${userId}
  LIMIT 1
`;

// With JOIN
const posts = await mysql`
  SELECT posts.*, users.name as author_name
  FROM posts
  JOIN users ON posts.user_id = users.id
  WHERE posts.published = ${true}
`;

// WHERE IN with array
const userIds = [1, 2, 3];
const users = await mysql`
  SELECT * FROM users
  WHERE id IN ${mysql(userIds)}
`;

// WHERE IN with object array (pick specific key)
const userObjects = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
const results = await mysql`
  SELECT * FROM users
  WHERE id IN ${mysql(userObjects, "id")}
`;

// ON DUPLICATE KEY UPDATE (MySQL-specific)
await mysql`
  INSERT INTO users ${mysql(userData)}
  ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = NOW()
`;
```

### INSERT Queries

```typescript
// Single insert with object
const userData = {
  name: "Alice",
  email: "alice@example.com",
  age: 25
};

// MySQL doesn't support RETURNING, use LAST_INSERT_ID()
await mysql`INSERT INTO users ${mysql(userData)}`;
const [result] = await mysql`SELECT LAST_INSERT_ID() as id`;
const newUserId = result.id;

// Or in one query
const [insertResult] = await mysql`
  INSERT INTO users ${mysql(userData)}
`;
// Access insertId from result object properties

// Bulk insert
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" }
];
await mysql`INSERT INTO users ${mysql(users)}`;

// Pick specific columns
const user = { name: "Alice", email: "alice@example.com", password: "secret" };
await mysql`
  INSERT INTO users ${mysql(user, "name", "email")}
`;

// Insert with defaults
await mysql`
  INSERT INTO users (name, email)
  VALUES (${name}, ${email})
`;
```

### UPDATE Queries

```typescript
// Update with object (all keys)
const updates = { name: "Alice Smith", age: 26 };
await mysql`
  UPDATE users
  SET ${mysql(updates)}
  WHERE id = ${userId}
`;

// Update with specific columns only
await mysql`
  UPDATE users
  SET ${mysql(user, "name", "email")}
  WHERE id = ${user.id}
`;

// Manual update
await mysql`
  UPDATE users
  SET name = ${newName}, updated_at = NOW()
  WHERE id = ${userId}
`;

// Update with JOIN
await mysql`
  UPDATE users u
  JOIN accounts a ON u.id = a.user_id
  SET u.status = ${"premium"}
  WHERE a.balance > ${1000}
`;
```

### DELETE Queries

```typescript
// Simple delete
await mysql`
  DELETE FROM users
  WHERE id = ${userId}
`;

// Delete with condition
await mysql`
  DELETE FROM users
  WHERE created_at < ${cutoffDate}
  AND status = ${"inactive"}
`;

// Delete with JOIN (MySQL-specific syntax)
await mysql`
  DELETE u FROM users u
  JOIN accounts a ON u.id = a.user_id
  WHERE a.balance = 0
`;
```

## Dynamic Queries

```typescript
// Conditional WHERE clauses
const filters = {
  minAge: 21,
  status: "active",
  includeAge: true
};

const ageFilter = filters.includeAge
  ? mysql`AND age >= ${filters.minAge}`
  : mysql``;

const users = await mysql`
  SELECT * FROM users
  WHERE status = ${filters.status}
  ${ageFilter}
`;

// Dynamic table names (safe escaping)
const tableName = "users";
await mysql`SELECT * FROM ${mysql(tableName)}`;

// Dynamic column selection (be careful with user input!)
const columns = ["id", "name", "email"];
const columnList = columns.join(", ");
await mysql`SELECT ${mysql.unsafe(columnList)} FROM users`;
```

## Transactions

```typescript
// Basic transaction (auto-commit/rollback)
await mysql.begin(async tx => {
  await tx`INSERT INTO users (name) VALUES (${"Alice"})`;
  await tx`UPDATE accounts SET balance = balance - 100 WHERE user_id = 1`;
  // Auto-commits if no errors
  // Auto-rolls back if any error is thrown
});

// Transaction with manual error handling
try {
  await mysql.begin(async tx => {
    await tx`INSERT INTO orders (user_id, total) VALUES (${userId}, ${total})`;
    await tx`UPDATE inventory SET stock = stock - 1 WHERE product_id = ${productId}`;

    if (someCondition) {
      throw new Error("Order validation failed");
    }
  });
} catch (error) {
  console.error("Transaction failed:", error);
  // Already rolled back automatically
}

// Savepoints (nested transactions)
await mysql.begin(async tx => {
  await tx`INSERT INTO users (name) VALUES (${"Alice"})`;

  try {
    await tx.savepoint(async sp => {
      await sp`UPDATE users SET status = 'active'`;
      if (validationFails) {
        throw new Error("Rollback savepoint");
      }
    });
  } catch (error) {
    // Savepoint rolled back, but transaction continues
  }

  await tx`INSERT INTO audit_log (action) VALUES ('user_created')`;
});

// Pipelined transactions (better performance)
await mysql.begin(async tx => {
  return [
    tx`INSERT INTO users (name) VALUES (${"Alice"})`,
    tx`UPDATE accounts SET balance = balance - 100 WHERE user_id = 1`
  ];
});
```

## Query Result Formats

```typescript
// Default: array of objects
const users = await mysql`SELECT id, name, email FROM users`;
// Result: [{ id: 1, name: "Alice", email: "alice@..." }, ...]

// As arrays (useful for duplicate column names)
const rows = await mysql`SELECT name, email FROM users`.values();
// Result: [["Alice", "alice@..."], ["Bob", "bob@..."]]

// As raw buffers
const raw = await mysql`SELECT * FROM users`.raw();
// Result: [[Buffer, Buffer], [Buffer, Buffer]]
```

## Type Safety with TypeScript

```typescript
// Define result types
interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

// Type the query result
const users = await mysql`
  SELECT * FROM users
  WHERE active = ${true}
` as User[];

// For single results
const [user] = await mysql`
  SELECT * FROM users
  WHERE id = ${userId}
` as User[];

// Optional: use type assertion for cleaner code
type QueryResult<T> = Promise<T[]>;

const getUsers = async (): QueryResult<User> => {
  return mysql`SELECT * FROM users` as any;
};
```

## Connection Pool Management

```typescript
// Connection pool is automatic
const mysql = new SQL({
  adapter: "mysql",
  hostname: "localhost",
  username: "root",
  password: "password",
  database: "mydb",
  max: 20,              // Max 20 concurrent connections
  idleTimeout: 30,      // Close idle connections after 30s
  maxLifetime: 3600,    // Max connection lifetime
  connectionTimeout: 10 // Timeout for new connections
});

// No connection until first query
await mysql`SELECT 1`; // Pool starts here

// Reserve a dedicated connection
const reserved = await mysql.reserve();
try {
  await reserved`INSERT INTO users (name) VALUES (${"Alice"})`;
  await reserved`SELECT LAST_INSERT_ID()`;
} finally {
  reserved.release(); // IMPORTANT: Always release
}

// Or use Symbol.dispose (Bun/TypeScript 5.2+)
{
  using reserved = await mysql.reserve();
  await reserved`SELECT 1`;
} // Automatically released

// Close all connections
await mysql.close();

// Close with timeout
await mysql.close({ timeout: 5 }); // Wait max 5 seconds

// Close immediately (force)
await mysql.close({ timeout: 0 });
```

## MySQL-Specific Features

```typescript
// Call stored procedures
const results = await mysql`CALL GetUserStats(${userId}, @total_orders)`;
const [outParam] = await mysql`SELECT @total_orders as total`;

// MySQL system commands
await mysql`SET @user_id = ${userId}`;
await mysql`SHOW TABLES`;
await mysql`DESCRIBE users`;
await mysql`EXPLAIN SELECT * FROM users WHERE id = ${id}`;

// Use indexes (MySQL hint)
const users = await mysql`
  SELECT * FROM users USE INDEX (idx_email)
  WHERE email = ${email}
`;

// Lock tables
await mysql`LOCK TABLES users WRITE`;
await mysql`INSERT INTO users (name) VALUES (${"Alice"})`;
await mysql`UNLOCK TABLES`;
```

## Error Handling

```typescript
// Query errors
try {
  await mysql`SELECT * FROM nonexistent_table`;
} catch (error) {
  if (error.code === 'ER_NO_SUCH_TABLE') {
    console.error("Table doesn't exist");
  }
}

// Connection errors
try {
  const mysql = new SQL("mysql://wrong:credentials@localhost/db");
  await mysql`SELECT 1`;
} catch (error) {
  console.error("Connection failed:", error.message);
}

// Transaction errors
try {
  await mysql.begin(async tx => {
    await tx`INSERT INTO users (name) VALUES (${"Alice"})`;
    throw new Error("Force rollback");
  });
} catch (error) {
  // Transaction automatically rolled back
  console.error("Transaction failed:", error);
}
```

## Best Practices

### DO
1. **Use connection pooling** - It's automatic, just configure `max` connections
2. **Type your results** - Use TypeScript interfaces for type safety
3. **Use transactions** - For operations that must succeed/fail together
4. **Close connections** - Call `mysql.close()` when shutting down
5. **Handle errors** - Wrap queries in try/catch blocks
6. **Use parameterized queries** - Always use template literals, never concatenate

### DON'T
1. **Don't use `mysql.unsafe()`** unless absolutely necessary
2. **Don't forget to release reserved connections**
3. **Don't manually manage connections** - let the pool handle it
4. **Don't use string concatenation** for queries
5. **Don't ignore transaction errors** - they auto-rollback but you should log them

## Complete CRUD Example

```typescript
import { SQL } from "bun";

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
}

const mysql = new SQL("mysql://root:password@localhost:3306/myapp");

// CREATE
async function createUser(name: string, email: string): Promise<number> {
  await mysql`INSERT INTO users ${mysql({ name, email })}`;
  const [result] = await mysql`SELECT LAST_INSERT_ID() as id`;
  return result.id;
}

// READ
async function getUser(id: number): Promise<User | null> {
  const [user] = await mysql`
    SELECT * FROM users WHERE id = ${id}
  ` as User[];
  return user || null;
}

async function getUsers(limit = 10): Promise<User[]> {
  return await mysql`
    SELECT * FROM users
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as User[];
}

// UPDATE
async function updateUser(id: number, updates: Partial<User>): Promise<void> {
  await mysql`
    UPDATE users
    SET ${mysql(updates)}
    WHERE id = ${id}
  `;
}

// DELETE
async function deleteUser(id: number): Promise<void> {
  await mysql`DELETE FROM users WHERE id = ${id}`;
}

// Usage
const userId = await createUser("Alice", "alice@example.com");
const user = await getUser(userId);
await updateUser(userId, { name: "Alice Smith" });
const allUsers = await getUsers(20);
await deleteUser(userId);

// Cleanup
await mysql.close();
```

## Common Patterns

### Pagination
```typescript
async function getPaginatedUsers(page = 1, perPage = 20) {
  const offset = (page - 1) * perPage;

  const users = await mysql`
    SELECT * FROM users
    ORDER BY created_at DESC
    LIMIT ${perPage}
    OFFSET ${offset}
  `;

  const [{ total }] = await mysql`
    SELECT COUNT(*) as total FROM users
  `;

  return {
    users,
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage)
  };
}
```

### Search with Filters
```typescript
async function searchUsers(filters: {
  search?: string;
  status?: string;
  minAge?: number;
}) {
  const searchFilter = filters.search
    ? mysql`AND (name LIKE ${`%${filters.search}%`} OR email LIKE ${`%${filters.search}%`})`
    : mysql``;

  const statusFilter = filters.status
    ? mysql`AND status = ${filters.status}`
    : mysql``;

  const ageFilter = filters.minAge
    ? mysql`AND age >= ${filters.minAge}`
    : mysql``;

  return await mysql`
    SELECT * FROM users
    WHERE 1=1
    ${searchFilter}
    ${statusFilter}
    ${ageFilter}
  `;
}
```

### Batch Operations
```typescript
async function batchUpdateUsers(updates: Array<{ id: number; name: string }>) {
  await mysql.begin(async tx => {
    for (const update of updates) {
      await tx`
        UPDATE users
        SET name = ${update.name}
        WHERE id = ${update.id}
      `;
    }
  });
}
```

## Performance Tips

1. **Use prepared statements** - Enabled by default in Bun.SQL
2. **Index your queries** - Add indexes on WHERE/JOIN columns
3. **Limit result sets** - Always use LIMIT when possible
4. **Use connection pooling** - Set `max` appropriately (typically 10-50)
5. **Batch inserts** - Use bulk insert instead of loops
6. **Use transactions** - Faster than individual commits
7. **Monitor slow queries** - Use EXPLAIN to analyze query plans

## Debugging

```typescript
// Log all queries
const mysql = new SQL({
  adapter: "mysql",
  hostname: "localhost",
  username: "root",
  database: "mydb",
  onconnect: (client) => {
    console.log("Connected to MySQL");
  },
  onclose: () => {
    console.log("Connection closed");
  }
});

// Inspect query execution
const query = mysql`SELECT * FROM users WHERE id = ${123}`;
console.log("Query:", query.toString()); // See the actual SQL

// Use EXPLAIN for query analysis
const plan = await mysql`EXPLAIN SELECT * FROM users WHERE email = ${"test@example.com"}`;
console.log(plan);
```

---

**Remember:** Bun.SQL is fast because it's native. Use it for maximum performance with MySQL!
