# Git Workflow Cheat Sheet

## Ì∫Ä Quick Commands for Atlas AI Scrum Master

### Starting New Work
```bash
# 1. Switch to main and update
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/user-dashboard
git checkout -b bugfix/login-timeout
git checkout -b docs/api-documentation
```

### Making Changes
```bash
# 1. Stage specific files (NEVER use git add .)
git add path/to/specific/file.py
git add frontend/src/components/TaskCard.tsx

# 2. Commit with detailed message
git commit -m "feat(tasks): implement task creation form

Add comprehensive task creation form with validation.
- Create TaskForm component with all required fields
- Add client-side validation using Yup schema
- Implement error handling and user feedback
- Connect to task creation API endpoint

Form supports priority selection and role assignment as per FR2.

Closes #34"

# 3. Push to your branch
git push origin feature/your-feature-name
```

## ÌæØ Golden Rules

### DO ‚úÖ
- Always work in feature branches
- Write detailed commit messages
- Make atomic commits (one logical change)
- Test before committing
- Use proper branch naming convention

### DON'T ‚ùå
- Work directly on main branch
- Use `git add .` (stage files specifically)
- Write vague commit messages ("fix", "update")
- Commit multiple unrelated changes together
- Merge your own PRs

---

**Keep this cheat sheet handy for consistent Git workflow-la *.md* Ì≥ã
