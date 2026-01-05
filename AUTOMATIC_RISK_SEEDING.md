# Automatic Risk Task Seeding

## Overview

Every new project automatically gets seeded with 5 demonstration tasks that showcase different risk levels. This ensures users can immediately see the risk detection system in action.

## Implementation

### Location

`Backend/app/services/project_service.py` - `_seed_risk_tasks()` method

### When It Happens

Risk tasks are automatically created when:

- A new project is created via AI chat interface
- The `create_project_from_plan()` method is called

### Seeded Risk Tasks

Each new project gets these 5 tasks:

#### 1. Critical Security Patch Required (HIGH RISK)

- **Status**: To Do
- **Priority**: High
- **Due Date**: 2 days ago (OVERDUE)
- **Description**: Security vulnerability detected in authentication module
- **Risk Level**: High (overdue + high priority)

#### 2. Database Migration Pending (HIGH RISK)

- **Status**: In Progress
- **Priority**: High
- **Due Date**: Tomorrow
- **Description**: Database schema changes need to be applied
- **Risk Level**: High (due soon + high priority + in progress)

#### 3. API Integration Testing (MEDIUM RISK)

- **Status**: To Do
- **Priority**: Medium
- **Due Date**: 3 days from now
- **Description**: Third-party API integration needs testing
- **Risk Level**: Medium (due soon + medium priority)

#### 4. Performance Optimization (MEDIUM RISK)

- **Status**: To Do
- **Priority**: Medium
- **Due Date**: 5 days from now
- **Description**: Application response time exceeds threshold
- **Risk Level**: Medium (medium priority)

#### 5. Documentation Update (LOW RISK)

- **Status**: To Do
- **Priority**: Low
- **Due Date**: 14 days from now
- **Description**: Update technical documentation
- **Risk Level**: Low (low priority + distant due date)

## Risk Detection

### Automatic Detection

- Runs every hour via background scheduler
- Also runs immediately on server startup
- Analyzes all tasks across all projects

### Risk Calculation Factors

1. **Due Date Proximity**: Tasks due soon or overdue get higher risk
2. **Priority Level**: High priority tasks get higher risk scores
3. **Status**: In Progress tasks with approaching deadlines are flagged
4. **Overdue Status**: Overdue tasks automatically get high risk

### Risk Levels

- **High Risk**: Score ≥ 70

  - Overdue tasks
  - High priority tasks due within 3 days
  - In Progress tasks due within 2 days

- **Medium Risk**: Score 40-69

  - Medium priority tasks due within 7 days
  - High priority tasks due within 7 days
  - Tasks with moderate urgency

- **Low Risk**: Score < 40
  - Low priority tasks
  - Tasks with distant due dates
  - Tasks with no immediate concerns

## Benefits

1. **Immediate Demonstration**: Users see risk detection working right away
2. **Realistic Examples**: Tasks represent common project risks
3. **Educational**: Shows different risk levels and scenarios
4. **Testing**: Developers can test risk features without manual setup

## Task Assignment

All seeded risk tasks are automatically assigned to the project owner (the user who created the project).

## Task Ordering

Risk tasks are given high order numbers (1000+) to keep them at the end of the task list, separate from the main project tasks.

## Viewing Risks

Users can view detected risks:

1. Navigate to any project dashboard
2. Click "View Risks" button
3. See all tasks categorized by risk level (High, Medium, Low)
4. Each risk shows:
   - Task title and description
   - Risk level with color coding
   - Due date
   - Current status
   - Assigned user

## Customization

To modify the seeded tasks, edit the `_seed_risk_tasks()` method in `Backend/app/services/project_service.py`:

```python
risk_tasks = [
    {
        "title": "Your Task Title",
        "description": "Task description",
        "status": "To Do",  # or "In Progress", "Done"
        "due_date": datetime.now() + timedelta(days=X),
        "priority": "High"  # or "Medium", "Low"
    },
    # Add more tasks...
]
```

## Disabling Auto-Seeding

To disable automatic risk task seeding, comment out this line in `project_service.py`:

```python
# await self._seed_risk_tasks(session, str(project.id), owner_id)
```

## Future Enhancements

Potential improvements:

- Make seeding optional via configuration
- Customize number and types of risk tasks
- Add project-type-specific risk scenarios
- Allow users to delete demo tasks easily
- Add "Demo Task" flag to distinguish from real tasks
