# Update Documentation

You are tasked with updating project documentation to reflect the current state of the codebase.

## Documentation Scope

Review and update these documentation areas:

### 1. README.md
The project's front door - make it welcoming and informative.

**Essential Sections:**
```markdown
# Project Name

Brief description (1-2 sentences)

## Features
- Key feature 1
- Key feature 2
- Key feature 3

## Installation

```bash
npm install
```

## Quick Start

```javascript
// Simple usage example
const app = require('project-name');
app.start();
```

## Documentation

- [Full Documentation](./docs/)
- [API Reference](./docs/api/)
- [Contributing Guide](./CONTRIBUTING.md)

## License

MIT
```

**Update If:**
- Installation steps changed
- New features added
- Configuration requirements changed
- Examples are outdated
- Links are broken

### 2. API Documentation

**For Each Endpoint:**
- HTTP method and path
- Request parameters and body
- Response format and status codes
- Example requests/responses
- Authentication requirements
- Rate limiting

**For Each Function:**
- Purpose and behavior
- Parameters with types
- Return value with type
- Exceptions thrown
- Usage examples
- Edge cases

### 3. Configuration Documentation

**Document:**
- Environment variables
- Configuration files
- Default values
- Valid options
- Examples for different environments

**Example:**
```markdown
## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Server port |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| API_KEY | Yes | - | Third-party API key |

### Example .env

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your_api_key_here
```
```

### 4. Getting Started / Tutorial

**Include:**
- Prerequisites
- Step-by-step installation
- First-time setup
- Hello World example
- Next steps

**Make it:**
- Copy-pastable
- Tested and working
- Beginner-friendly
- Complete (no missing steps)

### 5. Architecture Documentation

**Update if changed:**
- System architecture diagrams
- Component relationships
- Data flow
- Technology stack
- Design decisions

### 6. Development Documentation

**For Contributors:**
- Development setup
- Running tests
- Code style guidelines
- Commit message format
- PR process
- Development workflow

**Example:**
```markdown
## Development

### Setup

```bash
git clone https://github.com/user/repo.git
cd repo
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # E2E tests only
npm run test:watch    # Watch mode
```

### Code Style

We use ESLint and Prettier. Format code with:

```bash
npm run lint
npm run format
```
```

### 7. Deployment Documentation

**Cover:**
- Production requirements
- Deployment steps
- Environment configuration
- Monitoring and logging
- Backup and recovery
- Rollback procedures

### 8. Troubleshooting / FAQ

**Common Issues:**
```markdown
## Troubleshooting

### Installation fails with "permission denied"

Run with sudo or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

### Database connection fails

Check:
1. Database is running: `pg_isready`
2. Credentials are correct in .env
3. Port is not blocked by firewall
```

### 9. Code Comments

**Update:**
- Outdated comments
- Functions with changed behavior
- Complex algorithms explanations
- TODOs that are completed

**Good Comments:**
```typescript
// Calculate discount based on user tier and purchase history
// Premium users get 20%, regular users get 10% after 10 purchases
function calculateDiscount(user: User): number {
  if (!user.isPremium) return 0;
  return user.purchases > 10 ? 0.2 : 0.1;
}
```

**Bad Comments:**
```typescript
// Get discount
function calculateDiscount(user: User): number {
  // Check if premium
  if (!user.isPremium) return 0;
  // Return discount
  return user.purchases > 10 ? 0.2 : 0.1;
}
```

### 10. Inline Documentation (JSDoc/TSDoc)

**Update Function Documentation:**
```typescript
/**
 * Creates a new user in the database
 *
 * @param userData - User information including name, email, password
 * @param options - Optional settings for user creation
 * @param options.sendEmail - Whether to send welcome email (default: true)
 * @returns The created user object with generated ID
 * @throws {ValidationError} If email format is invalid
 * @throws {DuplicateError} If email already exists
 *
 * @example
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'secure123'
 * });
 */
async function createUser(
  userData: UserInput,
  options?: CreateUserOptions
): Promise<User> {
  // Implementation
}
```

## Documentation Quality Checklist

- [ ] Accurate (matches current code)
- [ ] Complete (no missing sections)
- [ ] Clear (easy to understand)
- [ ] Concise (no unnecessary verbosity)
- [ ] Consistent (uniform style and terminology)
- [ ] Up-to-date (reflects latest changes)
- [ ] Tested (examples actually work)
- [ ] Searchable (good headings and keywords)
- [ ] Accessible (proper markdown formatting)
- [ ] Linked (cross-references where appropriate)

## Documentation Update Process

### 1. Audit Current Documentation
- Read through all documentation files
- Note what's outdated, missing, or incorrect
- Check all code examples
- Test all links

### 2. Review Recent Changes
- Check git history for changes since last doc update
- Identify new features, changed APIs, removed features
- Note breaking changes

### 3. Update Content
- Fix inaccuracies
- Add new sections for new features
- Update examples and code snippets
- Remove documentation for removed features
- Update version numbers and dates

### 4. Verify Examples
- Test all code examples
- Ensure commands work as written
- Verify API examples are correct
- Check that configurations are valid

### 5. Improve Clarity
- Simplify complex explanations
- Add diagrams where helpful
- Break up long sections
- Add table of contents for long docs

### 6. Add Missing Documentation
- Document undocumented features
- Add troubleshooting for common issues
- Include migration guides for breaking changes
- Add usage examples

## Documentation Best Practices

**Writing Style:**
- Use active voice
- Write in present tense
- Be direct and concise
- Use "you" for instructions
- Define technical terms

**Structure:**
- Start with overview/summary
- Use clear hierarchical headings
- Break up text with lists and code blocks
- Add examples liberally
- End with next steps or related topics

**Code Examples:**
- Keep them short and focused
- Make them copy-pastable
- Include expected output
- Show common use cases
- Add comments for clarity

**Maintenance:**
- Update docs with code changes
- Version documentation with releases
- Review docs regularly
- Remove obsolete content
- Keep examples tested

Begin by analyzing the project documentation and identifying what needs to be updated.
