// Load marketplace data
let marketplaceData = {};
let selectedComponents = new Set();
let currentCategory = 'all';
let currentSearch = '';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadMarketplaceData();
    setupEventListeners();
    renderComponents();
    updateResultCount();
});

// Load marketplace.json
async function loadMarketplaceData() {
    try {
        const response = await fetch('../.claude-plugin/marketplace.json');
        marketplaceData = await response.json();
    } catch (error) {
        console.error('Error loading marketplace data:', error);
        // Fallback to embedded data if fetch fails
        marketplaceData = getEmbeddedData();
    }
}

// Embedded data fallback
function getEmbeddedData() {
    return {
        plugins: [
            { id: 'fullstack-pro', name: 'Full-Stack Pro', description: 'Complete full-stack development toolkit', icon: '🚀', tags: ['fullstack', 'development'], components: { agents: 5, commands: 0, hooks: 0 }},
            { id: 'code-quality-suite', name: 'Code Quality Suite', description: 'Comprehensive code quality toolkit', icon: '✨', tags: ['quality', 'testing'], components: { agents: 3, commands: 2, hooks: 0 }},
            { id: 'documentation-master', name: 'Documentation Master', description: 'Complete documentation suite', icon: '📚', tags: ['documentation'], components: { agents: 1, commands: 3, hooks: 0 }},
            { id: 'product-workflow', name: 'Product Workflow', description: 'Product management and release workflow', icon: '📋', tags: ['management'], components: { agents: 0, commands: 2, hooks: 1 }},
            { id: 'ui-ux-studio', name: 'UI/UX Studio', description: 'Design-focused toolkit', icon: '🎨', tags: ['design', 'ui'], components: { agents: 2, commands: 0, hooks: 1 }},
            { id: 'architect-toolkit', name: 'Architect Toolkit', description: 'Senior-level architecture review', icon: '🏗️', tags: ['architecture'], components: { agents: 3, commands: 1, hooks: 0 }},
            { id: 'git-workflow-pro', name: 'Git Workflow Pro', description: 'Enhanced git workflow', icon: '🌿', tags: ['git', 'workflow'], components: { agents: 0, commands: 1, hooks: 2 }},
            { id: 'devops-complete', name: 'DevOps Complete', description: 'Full DevOps toolkit', icon: '⚙️', tags: ['devops'], components: { agents: 1, commands: 1, hooks: 1 }},
            { id: 'startup-essentials', name: 'Startup Essentials', description: 'Everything a startup needs', icon: '🚀', tags: ['startup'], components: { agents: 4, commands: 4, hooks: 2 }},
            { id: 'enterprise-complete', name: 'Enterprise Complete', description: 'Enterprise-grade development', icon: '🏢', tags: ['enterprise'], components: { agents: 12, commands: 7, hooks: 3 }}
        ],
        agents: [
            { name: 'frontend-developer', description: 'Expert frontend developer', category: 'development-team', tags: ['react', 'vue', 'frontend'] },
            { name: 'backend-architect', description: 'Senior backend architect', category: 'development-team', tags: ['backend', 'api'] },
            { name: 'fullstack-developer', description: 'Versatile fullstack developer', category: 'development-team', tags: ['fullstack'] },
            { name: 'ui-ux-designer', description: 'Skilled UI/UX designer', category: 'development-team', tags: ['ui', 'ux', 'design'] },
            { name: 'devops-engineer', description: 'DevOps engineer', category: 'development-team', tags: ['devops', 'ci-cd'] },
            { name: 'code-reviewer', description: 'Meticulous code reviewer', category: 'development-tools', tags: ['quality', 'review'] },
            { name: 'debugger', description: 'Expert debugger', category: 'development-tools', tags: ['debugging'] },
            { name: 'test-engineer', description: 'Quality-focused test engineer', category: 'development-tools', tags: ['testing', 'qa'] },
            { name: 'typescript-pro', description: 'TypeScript expert', category: 'programming-languages', tags: ['typescript'] },
            { name: 'database-architect', description: 'Database architect', category: 'database', tags: ['database', 'sql'] },
            { name: 'architect-review', description: 'Senior software architect', category: 'expert-advisors', tags: ['architecture'] },
            { name: 'api-documenter', description: 'API documentation expert', category: 'documentation', tags: ['documentation', 'api'] }
        ],
        commands: [
            { name: 'create-architecture-documentation', description: 'Create comprehensive architecture documentation', category: 'documentation', tags: ['documentation'] },
            { name: 'refactor-code', description: 'Refactor code for better quality', category: 'utilities', tags: ['refactoring'] },
            { name: 'code-review', description: 'Perform comprehensive code review', category: 'utilities', tags: ['review'] },
            { name: 'add-changelog', description: 'Create or update CHANGELOG.md', category: 'deployment', tags: ['changelog'] },
            { name: 'update-docs', description: 'Update project documentation', category: 'documentation', tags: ['documentation'] },
            { name: 'create-prd', description: 'Create Product Requirements Document', category: 'project-management', tags: ['prd'] },
            { name: 'generate-api-documentation', description: 'Generate API documentation', category: 'documentation', tags: ['api'] }
        ],
        hooks: [
            { name: 'git-commit-settings', description: 'Configure git commit behavior', category: 'global', tags: ['git'] },
            { name: 'colorful-statusline', description: 'Colorful status line', category: 'statusline', tags: ['ui'] },
            { name: 'git-branch-statusline', description: 'Git-focused status line', category: 'statusline', tags: ['git'] }
        ]
    };
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderComponents();
            updateResultCount();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderComponents();
        updateResultCount();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', () => {
        renderComponents();
    });

    // Stack builder actions
    document.getElementById('clearBtn').addEventListener('click', clearSelection);
    document.getElementById('generateBtn').addEventListener('click', generateCommand);
    document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard('commandText'));

    // Quick start copy
    document.querySelectorAll('.quick-install .copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.currentTarget.dataset.copy || '/plugin marketplace add zpaper-com/ClaudeKit';
            copyText(text, e.currentTarget);
        });
    });
}

// Render all components
function renderComponents() {
    renderPlugins();
    renderAgents();
    renderCommands();
    renderHooks();
}

// Render plugins
function renderPlugins() {
    const grid = document.getElementById('pluginsGrid');
    const plugins = filterAndSort(marketplaceData.plugins || [], 'plugins');

    grid.innerHTML = plugins.map(plugin => `
        <div class="card ${selectedComponents.has(`plugin:${plugin.id}`) ? 'selected' : ''}"
             onclick="toggleComponent('plugin', '${plugin.id}')">
            <div class="card-header">
                <div class="card-icon">${plugin.icon || '🔌'}</div>
            </div>
            <div class="card-title">${plugin.name}</div>
            <div class="card-description">${plugin.description}</div>
            <div class="component-count">
                ${getComponentCount(plugin.components)}
            </div>
            <div class="card-meta">
                ${(plugin.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Render agents
function renderAgents() {
    const grid = document.getElementById('agentsGrid');
    const agents = filterAndSort(marketplaceData.agents || [], 'agents');

    grid.innerHTML = agents.map(agent => `
        <div class="card ${selectedComponents.has(`agent:${agent.name}`) ? 'selected' : ''}"
             onclick="toggleComponent('agent', '${agent.name}')">
            <div class="card-header">
                <div class="card-icon">🤖</div>
            </div>
            <div class="card-title">${formatName(agent.name)}</div>
            <div class="card-description">${agent.description}</div>
            <div class="card-meta">
                ${(agent.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Render commands
function renderCommands() {
    const grid = document.getElementById('commandsGrid');
    const commands = filterAndSort(marketplaceData.commands || [], 'commands');

    grid.innerHTML = commands.map(command => `
        <div class="card ${selectedComponents.has(`command:${command.name}`) ? 'selected' : ''}"
             onclick="toggleComponent('command', '${command.name}')">
            <div class="card-header">
                <div class="card-icon">⚡</div>
            </div>
            <div class="card-title">/${command.name}</div>
            <div class="card-description">${command.description}</div>
            <div class="card-meta">
                ${(command.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Render hooks
function renderHooks() {
    const grid = document.getElementById('hooksGrid');
    const hooks = filterAndSort(marketplaceData.hooks || [], 'hooks');

    grid.innerHTML = hooks.map(hook => `
        <div class="card ${selectedComponents.has(`hook:${hook.name}`) ? 'selected' : ''}"
             onclick="toggleComponent('hook', '${hook.name}')">
            <div class="card-header">
                <div class="card-icon">🪝</div>
            </div>
            <div class="card-title">${formatName(hook.name)}</div>
            <div class="card-description">${hook.description}</div>
            <div class="card-meta">
                ${(hook.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Filter and sort items
function filterAndSort(items, type) {
    let filtered = items;

    // Filter by category
    if (currentCategory !== 'all') {
        const categoryMap = {
            'plugins': 'plugins',
            'agents': 'agents',
            'commands': 'commands',
            'hooks': 'hooks'
        };
        if (categoryMap[currentCategory] !== type) {
            return [];
        }
    }

    // Filter by search
    if (currentSearch) {
        filtered = items.filter(item => {
            const searchText = `${item.name} ${item.description} ${(item.tags || []).join(' ')}`.toLowerCase();
            return searchText.includes(currentSearch);
        });
    }

    // Sort
    const sortValue = document.getElementById('sortSelect').value;
    if (sortValue === 'name') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortValue === 'category') {
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }

    return filtered;
}

// Toggle component selection
function toggleComponent(type, id) {
    const key = `${type}:${id}`;
    if (selectedComponents.has(key)) {
        selectedComponents.delete(key);
    } else {
        selectedComponents.add(key);
    }
    renderComponents();
    updateSelectedItems();
}

// Update selected items display
function updateSelectedItems() {
    const container = document.getElementById('selectedItems');

    if (selectedComponents.size === 0) {
        container.innerHTML = '<p class="empty-state">No components selected</p>';
        document.getElementById('installCommand').classList.add('hidden');
        return;
    }

    const items = Array.from(selectedComponents).map(key => {
        const [type, id] = key.split(':');
        return { type, id, key };
    });

    container.innerHTML = items.map(item => `
        <div class="selected-item">
            <div class="selected-item-info">
                <div class="selected-item-name">${formatName(item.id)}</div>
                <div class="selected-item-type">${getIcon(item.type)} ${item.type}</div>
            </div>
            <button class="remove-btn" onclick="toggleComponent('${item.type}', '${item.id}')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Generate installation command
function generateCommand() {
    if (selectedComponents.size === 0) return;

    const components = {
        agents: [],
        commands: [],
        hooks: [],
        plugins: []
    };

    selectedComponents.forEach(key => {
        const [type, id] = key.split(':');
        if (type === 'plugin') {
            components.plugins.push(id);
        } else if (type === 'agent') {
            components.agents.push(id);
        } else if (type === 'command') {
            components.commands.push(id);
        } else if (type === 'hook') {
            components.hooks.push(id);
        }
    });

    // Generate Claude Code plugin commands
    let commands = [];

    if (components.plugins.length > 0) {
        components.plugins.forEach(plugin => {
            commands.push(`/plugin install ${plugin}`);
        });
    }
    if (components.agents.length > 0) {
        commands.push(`/agent install ${components.agents.join(' ')}`);
    }
    if (components.commands.length > 0) {
        components.commands.forEach(cmd => {
            commands.push(`/command install ${cmd}`);
        });
    }
    if (components.hooks.length > 0) {
        components.hooks.forEach(hook => {
            commands.push(`/hook install ${hook}`);
        });
    }

    const command = commands.length > 0
        ? commands.join('\n')
        : '# Select components to generate installation commands';

    document.getElementById('commandText').textContent = command;
    document.getElementById('installCommand').classList.remove('hidden');
}

// Clear selection
function clearSelection() {
    selectedComponents.clear();
    renderComponents();
    updateSelectedItems();
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    const button = document.getElementById('copyBtn');
    copyText(text, button);
}

function copyText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
    });
}

// Update result count
function updateResultCount() {
    const total =
        filterAndSort(marketplaceData.plugins || [], 'plugins').length +
        filterAndSort(marketplaceData.agents || [], 'agents').length +
        filterAndSort(marketplaceData.commands || [], 'commands').length +
        filterAndSort(marketplaceData.hooks || [], 'hooks').length;

    document.getElementById('resultCount').textContent = `${total} result${total !== 1 ? 's' : ''}`;
}

// Utility functions
function formatName(name) {
    return name.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getIcon(type) {
    const icons = {
        plugin: '🔌',
        agent: '🤖',
        command: '⚡',
        hook: '🪝'
    };
    return icons[type] || '';
}

function getComponentCount(components) {
    if (!components) return '';
    const counts = [];
    if (components.agents && components.agents > 0) counts.push(`${components.agents} agents`);
    if (components.commands && components.commands > 0) counts.push(`${components.commands} commands`);
    if (components.hooks && components.hooks > 0) counts.push(`${components.hooks} hooks`);
    return counts.join(' • ') || 'Bundle';
}
