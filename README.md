# ClaudeKit

Production-ready Claude Code toolkit with essential development agents, commands, and workflows. Self-contained with no external dependencies.

## Features

- **12 Specialized Agents** - AI specialists for every development task
- **7 Commands** - Essential workflows and automation
- **3 Hooks** - Customization and configuration options
- **10 Plugins** - Pre-configured component bundles
- **Zero Dependencies** - No MCPs, no external services needed

## Installation

### Prerequisites

- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed
- Access to this private repository

### Add ClaudeKit Marketplace

In Claude Code, run:

```
/plugin marketplace add zpaper-com/ClaudeKit
```

This adds ClaudeKit as a plugin marketplace, allowing you to browse and install components directly from Claude Code.

### Install Plugins

Once the marketplace is added, you can install entire plugin bundles:

```
/plugin install fullstack-pro
/plugin install code-quality-suite
/plugin install documentation-master
```

Or browse available plugins:

```
/plugin list
```

### Install Individual Components

You can also install specific agents, commands, or hooks:

#### Install Agents
```
# Install a specific agent
/agent install frontend-developer

# Install multiple agents
/agent install frontend-developer backend-architect fullstack-developer
```

#### Install Commands
```
# Install a specific command
/command install code-review

# Install multiple commands
/command install code-review refactor-code
```

#### Install Hooks
```
# Install a specific hook
/hook install git-commit-settings

# Install multiple hooks
/hook install colorful-statusline git-branch-statusline
```

### Manual Installation (Alternative)

If you prefer manual installation, clone the repository and copy files:

```bash
git clone git@github.com:zpaper-com/ClaudeKit.git

# Copy specific components
cp ClaudeKit/.claude/agents/frontend-developer.md ~/.claude/agents/
cp ClaudeKit/.claude/commands/code-review.md ~/.claude/commands/
cp ClaudeKit/.claude/hooks/git-commit-settings.json ~/.claude/hooks/

# Or copy everything
cp ClaudeKit/.claude/agents/*.md ~/.claude/agents/
cp ClaudeKit/.claude/commands/*.md ~/.claude/commands/
cp ClaudeKit/.claude/hooks/*.json ~/.claude/hooks/
```

## Available Plugins

### 🚀 Full-Stack Pro
Complete full-stack development toolkit with frontend, backend, database, and TypeScript expertise.

**Components:** 5 agents
- frontend-developer
- backend-architect
- fullstack-developer
- database-architect
- typescript-pro

### ✨ Code Quality Suite
Comprehensive code quality toolkit with review, refactoring, debugging, and testing.

**Components:** 3 agents, 2 commands
- Agents: code-reviewer, debugger, test-engineer
- Commands: code-review, refactor-code

### 📚 Documentation Master
Complete documentation suite for architecture, APIs, and project docs.

**Components:** 1 agent, 3 commands
- Agent: api-documenter
- Commands: create-architecture-documentation, generate-api-documentation, update-docs

### 📋 Product Workflow
Product management and release workflow with PRDs and changelogs.

**Components:** 2 commands, 1 hook
- Commands: create-prd, add-changelog
- Hook: git-commit-settings

### 🎨 UI/UX Studio
Design-focused toolkit with UI/UX expertise and visual status indicators.

**Components:** 2 agents, 1 hook
- Agents: ui-ux-designer, frontend-developer
- Hook: colorful-statusline

### 🏗️ Architect Toolkit
Senior-level architecture review and system design guidance.

**Components:** 3 agents, 1 command
- Agents: architect-review, backend-architect, database-architect
- Command: create-architecture-documentation

### 🌿 Git Workflow Pro
Enhanced git workflow with smart commits, branch tracking, and changelogs.

**Components:** 1 command, 2 hooks
- Command: add-changelog
- Hooks: git-commit-settings, git-branch-statusline

### ⚙️ DevOps Complete
Full DevOps toolkit with CI/CD expertise and deployment workflows.

**Components:** 1 agent, 1 command, 1 hook
- Agent: devops-engineer
- Command: add-changelog
- Hook: git-commit-settings

### 🚀 Startup Essentials
Everything a startup needs: full-stack dev, product management, and quality tools.

**Components:** 4 agents, 4 commands, 2 hooks
- Perfect for fast-moving teams building MVPs

### 🏢 Enterprise Complete
Enterprise-grade development with all agents, commands, and quality controls.

**Components:** All 12 agents, all 7 commands, all 3 hooks
- Complete toolkit for large teams

## Usage

Once installed, components are available in Claude Code:

### Using Agents

Agents are automatically available - just mention them in conversation or reference them in your prompts.

```
"Use the frontend-developer agent to help build this component"
"Ask the code-reviewer to review this pull request"
```

### Using Commands

Commands are available as slash commands:

```
/code-review
/refactor-code
/generate-api-documentation
/create-prd
/add-changelog
```

### Using Hooks

Hooks are automatically active once installed in your `.claude/hooks/` directory. They customize Claude Code's behavior for:
- Git commit message formatting
- Status line appearance
- Branch tracking displays

## Project Structure

```
ClaudeKit/
├── .claude/
│   ├── agents/           # 12 specialized AI agents
│   ├── commands/         # 7 workflow commands
│   └── hooks/            # 3 configuration hooks
├── .claude-plugin/
│   └── marketplace.json  # Component registry
├── web/                  # Web interface
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── README.md
```

## Web Interface

View all available components in a visual interface:

```bash
cd ClaudeKit/web
# Open index.html in your browser
```

Features:
- Browse all agents, commands, hooks, and plugins
- Search and filter components
- Build custom component stacks
- Generate installation commands
- Copy to clipboard functionality

## Component Details

### Agents (12)

**Development Team**
- `frontend-developer` - Modern frontend development (React, Vue, TypeScript)
- `backend-architect` - Scalable backend architecture and API design
- `fullstack-developer` - Full-stack development across entire stack
- `ui-ux-designer` - User interface design and UX optimization
- `devops-engineer` - CI/CD, containerization, infrastructure automation

**Development Tools**
- `code-reviewer` - Comprehensive code review and quality checks
- `debugger` - Systematic debugging and issue resolution
- `test-engineer` - Testing strategy, automation, QA

**Specialists**
- `typescript-pro` - TypeScript type safety and best practices
- `database-architect` - Database schema design and optimization
- `architect-review` - Senior-level architectural review
- `api-documenter` - Clear, comprehensive API documentation

### Commands (7)

**Documentation**
- `/create-architecture-documentation` - Generate comprehensive architecture docs
- `/update-docs` - Update project documentation
- `/generate-api-documentation` - Create API documentation with examples

**Code Quality**
- `/refactor-code` - Refactor for better quality and maintainability
- `/code-review` - Perform comprehensive code review

**Project Management**
- `/create-prd` - Create Product Requirements Document
- `/add-changelog` - Create or update CHANGELOG.md

### Hooks (3)

**Configuration**
- `git-commit-settings.json` - Git commit behavior and message formatting

**Status Line**
- `colorful-statusline.json` - Visual status line with emojis and themes
- `git-branch-statusline.json` - Git-focused status with branch info

## Contributing

This is a private repository for internal use. For issues or suggestions, please open an issue on GitHub.

## License

MIT License - See LICENSE file for details

## Support

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [GitHub Issues](https://github.com/zpaper-com/ClaudeKit/issues)
- [Repository](https://github.com/zpaper-com/ClaudeKit)

---

Built with ❤️ for [Claude Code](https://claude.com/claude-code)
