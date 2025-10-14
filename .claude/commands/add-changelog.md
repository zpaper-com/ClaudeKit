# Add Changelog

You are tasked with creating or updating a CHANGELOG.md file following the Keep a Changelog format.

## Changelog Format

Follow the [Keep a Changelog](https://keepachangelog.com/) specification:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes

## [1.0.0] - 2024-01-15

### Added
- Initial release
- User authentication
- API endpoints for CRUD operations

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Process

### 1. Analyze Changes

Review recent commits, pull requests, and changes to understand:
- What features were added
- What was changed or improved
- What bugs were fixed
- What was deprecated or removed
- Any security fixes

### 2. Categorize Changes

Organize changes into categories:

**Added** - New features
- New API endpoints
- New components
- New functionality
- New configuration options

**Changed** - Modifications to existing features
- Updated dependencies
- Refactored code
- Modified behavior
- Performance improvements

**Deprecated** - Features marked for removal
- APIs being phased out
- Configuration options being replaced
- Functions marked as deprecated

**Removed** - Deleted features
- Removed APIs
- Deleted files or modules
- Dropped support for versions

**Fixed** - Bug fixes
- Corrected behavior
- Resolved issues
- Patched errors

**Security** - Security-related changes
- Vulnerability patches
- Security improvements
- Authentication fixes

### 3. Write Clear Entries

Each entry should:
- Start with a verb (Added, Fixed, Updated, etc.)
- Be concise but descriptive
- Include reference to issues/PRs if applicable
- Be user-focused, not implementation-focused

**Good Examples:**
```markdown
### Added
- Added user profile page with avatar upload (#123)
- Added support for PostgreSQL database
- Added `/api/v1/users/export` endpoint for CSV export

### Fixed
- Fixed memory leak in WebSocket connection (#456)
- Fixed incorrect calculation in discount logic
- Fixed authentication failure with special characters in password

### Changed
- Updated minimum Node.js version to 18.x
- Improved query performance for user search (50% faster)
- Changed default timeout from 30s to 60s
```

**Bad Examples:**
```markdown
### Added
- Stuff (#123)
- New feature

### Fixed
- Bug fix
- Fixed issue

### Changed
- Updated code
```

### 4. Version and Date

**Semantic Versioning:**
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

**Date Format:** YYYY-MM-DD (ISO 8601)

### 5. Update Links

Add comparison links at the bottom:
```markdown
[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Complete Example

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added dark mode support with system preference detection
- Added export functionality for user data in JSON and CSV formats

### Changed
- Improved dashboard loading time by 40% through query optimization
- Updated UI components to use new design system

### Fixed
- Fixed issue where notifications weren't displaying on mobile devices (#789)

## [2.1.0] - 2024-03-15

### Added
- Added real-time collaboration features
- Added webhooks for order status updates
- Added TypeScript types for all API responses

### Changed
- Migrated from REST to GraphQL for better query flexibility
- Updated authentication to use JWT tokens instead of sessions

### Deprecated
- Deprecated `/api/v1/users/list` endpoint (use `/api/v2/users` instead)

### Fixed
- Fixed race condition in payment processing (#567)
- Fixed incorrect timezone handling for scheduled tasks
- Fixed memory leak in WebSocket connections

### Security
- Updated dependencies to patch security vulnerabilities
- Added rate limiting to prevent brute-force attacks

## [2.0.0] - 2024-02-01

### Added
- Added support for multiple organizations per user
- Added role-based access control (RBAC)
- Added audit logging for all administrative actions

### Changed
- **BREAKING:** Changed API response format to standardize error handling
- **BREAKING:** Renamed environment variables for consistency
- Updated minimum Node.js version to 18.x

### Removed
- **BREAKING:** Removed deprecated v1 API endpoints
- Removed support for Internet Explorer 11

### Fixed
- Fixed data corruption issue in batch operations (#345)

## [1.0.0] - 2024-01-01

### Added
- Initial release
- User authentication and authorization
- CRUD operations for core resources
- RESTful API with OpenAPI documentation
- Admin dashboard
- Email notifications

[Unreleased]: https://github.com/user/repo/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/user/repo/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/user/repo/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Guidelines

- **User Perspective**: Write for users, not developers
- **Be Specific**: Provide context and details
- **Group Related**: Related changes go together
- **Link Issues**: Reference issue/PR numbers
- **Breaking Changes**: Clearly mark with "BREAKING:"
- **Keep Updated**: Update with each release
- **Unreleased Section**: Track ongoing work

## Process Steps

1. If CHANGELOG.md doesn't exist, create it with the standard header
2. Review git history or changes since last version
3. Categorize changes appropriately
4. Write clear, user-focused descriptions
5. Add or update version section with date
6. Update comparison links
7. Ensure breaking changes are clearly marked

Begin by analyzing the project changes and creating or updating the CHANGELOG.md file.
