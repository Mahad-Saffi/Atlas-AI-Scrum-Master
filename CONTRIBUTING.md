# Contributing Guidelines

## 🌿 Branch Naming Convention

### Branch Types and Naming
- **Feature branches**: `feature/short-description`
  - Example: `feature/user-authentication`, `feature/task-assignment`
- **Bug fixes**: `bugfix/short-description`  
  - Example: `bugfix/login-error`, `bugfix/api-timeout`
- **Hotfixes**: `hotfix/short-description`
  - Example: `hotfix/security-patch`, `hotfix/critical-bug`
- **Documentation**: `docs/short-description`
  - Example: `docs/api-guide`, `docs/setup-instructions`
- **Refactoring**: `refactor/short-description`
  - Example: `refactor/database-queries`, `refactor/auth-service`
- **Testing**: `test/short-description`
  - Example: `test/user-api`, `test/integration-tests`

### Branch Naming Rules
- Use lowercase letters only
- Use hyphens (-) to separate words, no spaces or underscores
- Keep names short but descriptive (max 30 characters)
- Be specific about what the branch does

## 📝 Commit Message Convention

### Format
```
type(scope): brief description

Detailed description of what was changed and why.

- Specific change 1
- Specific change 2
- Any breaking changes or important notes

Closes #issue-number (if applicable)
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## 🔄 Development Workflow

### Step-by-Step Process

#### 1. Start New Work
```bash
# Always start from main branch
git checkout main
git pull origin main

# Create new branch with proper naming
git checkout -b feature/task-management
```

#### 2. Make Atomic Changes
- Each commit should represent ONE logical change
- Test your changes before committing
- Write clear, detailed commit messages

#### 3. Commit Changes
```bash
# Stage specific files (not git add .)
git add src/components/TaskManager.tsx
git add src/services/taskService.ts

# Write detailed commit message
git commit -m "feat(tasks): add task management component

Implement comprehensive task management interface.
- Create TaskManager component with kanban board layout
- Add task creation modal with form validation
- Include real-time updates via WebSocket connection

Component supports all task operations defined in FR2 requirements.

Closes #12"
```

#### 4. Push Branch and Create PR
- Push your feature branch to GitHub
- Create Pull Request with clear description
- Wait for code review from Mahad
- Address feedback in additional commits

## ✅ Quality Standards

### Before Creating PR
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New features include tests
- [ ] Documentation updated for new features
- [ ] No sensitive data committed
- [ ] Branch is up to date with main

## 🚫 What NOT to Do

### Branch Naming
- ❌ `my-branch`, `temp`, `test123`
- ❌ `Feature_Authentication` (underscores/capitals)
- ❌ `fix bug in login page` (spaces/too long)

### Commits
- ❌ `git add .` and `git commit -m "fixes"`
- ❌ Multiple unrelated changes in one commit
- ❌ Commit messages like "update", "changes", "fix"
- ❌ Working directly on main branch

## 📋 Examples

### Good Branch Names
- `feature/github-oauth`
- `bugfix/api-timeout`
- `docs/deployment-guide`
- `refactor/auth-service`
- `test/task-api`

### Good Commit Messages
```bash
feat(auth): add JWT token validation middleware
fix(db): resolve connection pool exhaustion
docs(api): update endpoint documentation
refactor(tasks): extract task validation logic
test(users): add unit tests for user service
```

---

**Remember: Every change should be atomic, well-documented, and thoroughly tested!**
