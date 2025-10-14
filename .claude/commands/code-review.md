# Code Review

You are tasked with performing a comprehensive code review to identify issues and suggest improvements.

## Review Objectives

Evaluate code for:
- **Correctness**: Does it work as intended?
- **Quality**: Is it well-written and maintainable?
- **Performance**: Are there efficiency concerns?
- **Security**: Are there vulnerabilities?
- **Best Practices**: Does it follow conventions?
- **Testing**: Is it adequately tested?

## Review Process

### 1. Understand Context
- What is the purpose of this code?
- What problem does it solve?
- Who will maintain it?
- What are the requirements?

### 2. Review Functionality

**Correctness**
- [ ] Logic is correct and handles edge cases
- [ ] Error handling is appropriate
- [ ] Input validation is present
- [ ] Output is as expected
- [ ] Side effects are intentional and documented

**Edge Cases to Check**
- Null/undefined values
- Empty arrays/objects/strings
- Maximum/minimum values
- Concurrent access
- Network failures
- Invalid input

### 3. Review Code Quality

**Readability**
- [ ] Variable and function names are clear and descriptive
- [ ] Code is self-documenting
- [ ] Comments explain "why", not "what"
- [ ] Consistent formatting and style
- [ ] Appropriate abstraction level

**Maintainability**
- [ ] Functions are small and focused (single responsibility)
- [ ] No code duplication
- [ ] Low coupling, high cohesion
- [ ] Easy to modify and extend
- [ ] Clear module boundaries

**Code Smells**
Look for:
- Long functions (>50 lines)
- Large classes (>300 lines)
- Long parameter lists (>3 parameters)
- Deep nesting (>3 levels)
- Duplicate code
- Magic numbers/strings
- God objects/classes
- Primitive obsession
- Feature envy

### 4. Review Architecture

**Design Patterns**
- [ ] Appropriate patterns used
- [ ] SOLID principles followed
- [ ] Dependency injection where appropriate
- [ ] Proper separation of concerns

**Structure**
- [ ] Files and folders logically organized
- [ ] Clear module boundaries
- [ ] Appropriate abstractions
- [ ] Reusable components

### 5. Review Performance

**Efficiency Concerns**
- [ ] No unnecessary loops or iterations
- [ ] Appropriate data structures
- [ ] No N+1 query problems
- [ ] Efficient algorithms (check Big O complexity)
- [ ] Proper caching where needed
- [ ] Lazy loading implemented

**Common Issues**
- Unnecessary re-renders (React)
- Synchronous operations blocking event loop
- Large bundle sizes
- Memory leaks
- Inefficient queries

### 6. Review Security

**Vulnerabilities**
- [ ] Input sanitization and validation
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection
- [ ] Authentication and authorization
- [ ] Sensitive data protection
- [ ] Secure dependencies (no known vulnerabilities)

**Security Checklist**
- No hardcoded secrets or credentials
- Passwords properly hashed
- HTTPS enforced
- Rate limiting on APIs
- Proper error messages (don't leak info)
- Secure session management

### 7. Review Testing

**Test Coverage**
- [ ] Critical paths tested
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] Tests are clear and maintainable
- [ ] No flaky tests
- [ ] Appropriate test types (unit, integration, e2e)

**Test Quality**
- Tests follow AAA pattern (Arrange, Act, Assert)
- One assertion per test (when possible)
- Tests are independent
- Good test names (describe behavior)
- Mock external dependencies

### 8. Review Dependencies

**Package Management**
- [ ] All dependencies necessary
- [ ] Versions pinned appropriately
- [ ] No security vulnerabilities
- [ ] Licenses compatible
- [ ] Bundle size acceptable

## Review Output Format

Provide feedback in this structure:

### Summary
Brief overview of the code and overall assessment

### Critical Issues (Must Fix)
Issues that must be addressed before merging:
- Security vulnerabilities
- Correctness bugs
- Breaking changes

### Major Issues (Should Fix)
Important improvements that should be made:
- Performance problems
- Maintainability concerns
- Architectural issues

### Minor Issues (Nice to Have)
Suggestions for improvement:
- Style inconsistencies
- Better naming
- Additional tests
- Documentation gaps

### Positive Observations
Highlight good practices and well-written code

### Recommendations
- Specific actionable suggestions
- Code examples for improvements
- Links to relevant documentation
- Priority order for fixes

## Example Review Comment

```
Location: src/users/userService.ts:45-60

Issue: SQL Injection Vulnerability (CRITICAL)

The user input is directly interpolated into the SQL query, creating
a SQL injection vulnerability.

Current code:
```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Recommended fix:
```typescript
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

Impact: Critical security vulnerability
Effort: Low (5 minutes)
```

## Best Practices for Reviewers

- Be constructive and respectful
- Explain the "why" behind suggestions
- Provide examples and alternatives
- Ask questions rather than make demands
- Acknowledge good work
- Focus on the most important issues first
- Be specific with feedback
- Suggest, don't dictate

Begin the code review by analyzing the specified files or changes.
