# Database Schema Design

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Related:** [Architecture Overview](architecture.md), [Tech Stack](tech-stack.md)
- **Target Audience:** Backend Developers (Primary), DevOps Engineers (Secondary)
- **Phase Relevance:** Phase 1 (Critical), Phase 2 (Important), Phase 3 (Performance optimization)
- **Reading Time:** 20 minutes

## Database Overview

### Database Engine
- **PostgreSQL:** 15.4
- **Driver:** asyncpg 0.28.3 (async)
- **ORM:** SQLAlchemy 2.0.21 (async core)
- **Migrations:** Alembic 1.12.0

### Design Principles
- **Normalized:** 3rd Normal Form (3NF) for data integrity
- **Performance:** Strategic denormalization for read optimization
- **Indexes:** Optimized for common query patterns
- **Constraints:** Comprehensive data validation at database level

## Core Tables

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    github_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL CHECK (role IN ('developer', 'designer', 'tester', 'project_manager', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

**Purpose:** Store user authentication and profile information
**Key Features:**
- GitHub OAuth integration via `github_id`
- Role-based access control
- Soft delete capability with `is_active`

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    assigned_role VARCHAR(50) NOT NULL,
    assigned_user_id INTEGER REFERENCES users(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_delayed BOOLEAN DEFAULT false,
    epic_id VARCHAR(50),
    story_id VARCHAR(50),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT tasks_date_order CHECK (end_date > start_date)
);

-- Performance indexes
CREATE INDEX idx_tasks_assigned_user ON tasks(assigned_user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_role_status ON tasks(assigned_role, status);
CREATE INDEX idx_tasks_dates ON tasks(start_date, end_date);
CREATE INDEX idx_tasks_delayed ON tasks(is_delayed) WHERE is_delayed = true;
CREATE INDEX idx_tasks_epic ON tasks(epic_id);
```

**Purpose:** Central task management with timeline tracking
**Key Features:**
- Role-based assignment with optional user assignment
- Timeline management with delay detection
- Epic and story organization
- Comprehensive status tracking

### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_task_id INTEGER REFERENCES tasks(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Notification performance indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_task ON notifications(related_task_id);
```

**Purpose:** User notification management system
**Key Features:**
- User-specific notifications
- Type-based categorization
- Task relationship tracking
- Read status management

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id), -- NULL for group messages
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'file')),
    channel VARCHAR(50) DEFAULT 'general',
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat performance indexes
CREATE INDEX idx_chat_recipient ON chat_messages(recipient_id);
CREATE INDEX idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_channel ON chat_messages(channel);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
CREATE INDEX idx_chat_conversation ON chat_messages(sender_id, recipient_id, created_at);
```

**Purpose:** Real-time chat message storage
**Key Features:**
- Direct messages and group channels
- Message type classification
- Edit history tracking
- Conversation threading

### Triage Items Table
```sql
CREATE TABLE triage_items (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'rejected')),
    assigned_to INTEGER REFERENCES users(id),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    category VARCHAR(50) DEFAULT 'issue',
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triage indexes
CREATE INDEX idx_triage_reporter ON triage_items(reporter_id);
CREATE INDEX idx_triage_status ON triage_items(status);
CREATE INDEX idx_triage_assigned ON triage_items(assigned_to);
CREATE INDEX idx_triage_priority ON triage_items(priority);
CREATE INDEX idx_triage_created ON triage_items(created_at);
```

**Purpose:** Issue reporting and triage management
**Key Features:**
- Reporter and assignee tracking
- Priority and category classification
- Resolution workflow
- Status progression

## Data Relationships

### Entity Relationship Diagram
```
Users (1) ────────── (0..n) Tasks
  │                     │
  │                     │
  │ (1)             (0..n) │
  │                     │
Notifications       Chat_Messages
  │                     │
  │                     │
  │ (0..n)         (0..n) │
  │                     │
Triage_Items ──────────────
```

### Key Relationships
1. **Users → Tasks:** One-to-many (user can have multiple assigned tasks)
2. **Users → Notifications:** One-to-many (user receives multiple notifications)
3. **Users → Chat Messages:** One-to-many (user sends/receives multiple messages)
4. **Users → Triage Items:** One-to-many (user can report multiple issues)
5. **Tasks → Notifications:** One-to-many (task can trigger multiple notifications)

## Database Performance Optimization

### Connection Pooling
```python
# SQLAlchemy async engine configuration
DATABASE_CONFIG = {
    "pool_size": 5,           # Base connection pool size
    "max_overflow": 10,       # Additional connections allowed
    "pool_pre_ping": True,    # Validate connections before use
    "pool_recycle": 3600,     # Recycle connections after 1 hour
}
```

### Query Optimization
- **Composite Indexes:** Multi-column indexes for common query patterns
- **Partial Indexes:** Conditional indexes for filtered queries
- **Covering Indexes:** Include columns to avoid table lookups

### Common Query Patterns
```sql
-- Get user tasks with status filtering (optimized with idx_tasks_user_status)
SELECT * FROM tasks 
WHERE assigned_user_id = $1 AND status = $2 
ORDER BY priority DESC, start_date ASC;

-- Get unread notifications (optimized with idx_notifications_user_unread)
SELECT * FROM notifications 
WHERE user_id = $1 AND is_read = false 
ORDER BY created_at DESC;

-- Get chat conversation (optimized with idx_chat_conversation)
SELECT * FROM chat_messages 
WHERE (sender_id = $1 AND recipient_id = $2) 
   OR (sender_id = $2 AND recipient_id = $1)
ORDER BY created_at ASC;

-- Get delayed tasks (optimized with idx_tasks_delayed)
SELECT * FROM tasks 
WHERE is_delayed = true AND status != 'done'
ORDER BY end_date ASC;
```

## Data Validation & Constraints

### Check Constraints
```sql
-- Ensure valid task status transitions
ALTER TABLE tasks ADD CONSTRAINT valid_status 
CHECK (status IN ('todo', 'in_progress', 'done'));

-- Ensure valid user roles
ALTER TABLE users ADD CONSTRAINT valid_role 
CHECK (role IN ('developer', 'designer', 'tester', 'project_manager', 'admin'));

-- Ensure end date after start date
ALTER TABLE tasks ADD CONSTRAINT valid_date_range 
CHECK (end_date > start_date);

-- Ensure notification types are controlled
ALTER TABLE notifications ADD CONSTRAINT valid_notification_type
CHECK (type IN ('task_assigned', 'task_delayed', 'task_completed', 'issue_reported', 'system'));
```

### Foreign Key Constraints
- **Cascading Updates:** User ID changes cascade to related tables
- **Restricted Deletes:** Prevent deletion of referenced records
- **Null Handling:** Strategic nullable foreign keys for optional relationships

## Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY user_access_policy ON users
FOR ALL TO application_user
USING (id = current_setting('app.user_id')::integer);

-- Users can see tasks assigned to their role or created by them
CREATE POLICY task_access_policy ON tasks
FOR SELECT TO application_user
USING (assigned_role = current_setting('app.user_role') 
    OR assigned_user_id = current_setting('app.user_id')::integer);

-- Users can only see their own notifications
CREATE POLICY notification_access_policy ON notifications
FOR ALL TO application_user
USING (user_id = current_setting('app.user_id')::integer);
```

### Database User Roles
```sql
-- Application role with limited permissions
CREATE ROLE application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO application_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO application_user;

-- Read-only role for reporting
CREATE ROLE read_only_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only_user;
```

## Database Migrations

### Migration Strategy
- **Alembic:** Automated schema migrations
- **Versioning:** Sequential version numbering
- **Rollback:** All migrations include rollback scripts
- **Testing:** Migrations tested in staging environment

### Initial Migration
```python
# alembic/versions/001_initial_schema.py
def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('github_id', sa.String(50), unique=True, nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        # ... additional columns
    )
    
    # Create indexes
    op.create_index('idx_users_github_id', 'users', ['github_id'])
    
    # Create other tables...

def downgrade():
    # Drop tables in reverse order
    op.drop_table('triage_items')
    op.drop_table('chat_messages')
    op.drop_table('notifications')
    op.drop_table('tasks')
    op.drop_table('users')
```

## Backup and Recovery

### Backup Strategy
- **Full Backup:** Daily automated backups
- **Incremental:** WAL (Write-Ahead Log) archiving
- **Retention:** 30 days of backup history
- **Testing:** Monthly backup restoration tests

### Recovery Procedures
```bash
# Point-in-time recovery
pg_restore -d ai_scrum_master_restored backup_file.dump

# WAL replay for incremental recovery
pg_wal_replay -D /var/lib/postgresql/data
```

## Monitoring and Maintenance

### Performance Monitoring
- **Query Performance:** pg_stat_statements for slow query identification
- **Index Usage:** pg_stat_user_indexes for index effectiveness
- **Connection Monitoring:** pg_stat_activity for connection tracking

### Maintenance Tasks
```sql
-- Weekly maintenance
VACUUM ANALYZE;
REINDEX CONCURRENTLY;

-- Monthly statistics update
ANALYZE;

-- Cleanup old notifications (older than 30 days)
DELETE FROM notifications 
WHERE created_at < NOW() - INTERVAL '30 days' AND is_read = true;
```

## Data Seeding

### Development Data
```python
# Seed data for development environment
dev_users = [
    {"github_id": "dev1", "username": "developer1", "role": "developer"},
    {"github_id": "pm1", "username": "projectmanager1", "role": "project_manager"},
    {"github_id": "admin1", "username": "admin", "role": "admin"}
]

sample_tasks = [
    {
        "title": "Implement user authentication",
        "description": "Set up GitHub OAuth integration",
        "assigned_role": "developer",
        "start_date": "2025-09-25",
        "end_date": "2025-09-30"
    }
]
```

Ready for database implementation! ���️
