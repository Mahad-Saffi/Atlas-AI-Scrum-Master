"""
Seed high-risk tasks for Calculator project
"""
import sqlite3
from datetime import datetime, timedelta

def seed_calculator_risks():
    conn = sqlite3.connect('atlas.db')
    cursor = conn.cursor()
    
    # Get demo_user
    cursor.execute("SELECT id, username FROM users WHERE username LIKE '%demo%'")
    demo_users = cursor.fetchall()
    
    if not demo_users:
        print("❌ No demo user found. Creating one...")
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, role, is_active)
            VALUES ('demo_user', 'demo@example.com', 'hashed_password', 'developer', 1)
        """)
        conn.commit()
        cursor.execute("SELECT id, username FROM users WHERE username = 'demo_user'")
        demo_users = cursor.fetchall()
    
    demo_user_id = demo_users[0][0]
    demo_username = demo_users[0][1]
    print(f"✅ Using demo user: {demo_username} (ID: {demo_user_id})")
    
    # Get Calculator project
    calculator_project_id = "05fa7cd8-b200-4078-b65a-7eb919127072"
    cursor.execute("SELECT id, name FROM projects WHERE id = ?", (calculator_project_id,))
    project = cursor.fetchone()
    
    if not project:
        print(f"❌ Calculator project not found!")
        conn.close()
        return
    
    print(f"✅ Found project: {project[1]} (ID: {project[0]})")
    
    # Get some Calculator project tasks
    cursor.execute("""
        SELECT id, title, status 
        FROM tasks 
        WHERE project_id = ? 
        AND status IN ('To Do', 'In Progress')
        LIMIT 10
    """, (calculator_project_id,))
    
    tasks = cursor.fetchall()
    print(f"\n✅ Found {len(tasks)} active tasks in Calculator project")
    
    if len(tasks) == 0:
        print("❌ No active tasks found in Calculator project!")
        conn.close()
        return
    
    now = datetime.utcnow()
    updated_count = 0
    
    # Make first 3 tasks HIGH RISK (overdue, assigned to demo_user, 0% progress)
    print("\n📝 Creating HIGH RISK tasks...")
    for i, task in enumerate(tasks[:3]):
        task_id, title, status = task
        
        # Set overdue date (2-5 days ago)
        overdue_date = now - timedelta(days=2 + i)
        
        cursor.execute("""
            UPDATE tasks 
            SET due_date = ?,
                assignee_id = ?,
                progress_percentage = 0,
                status = 'In Progress',
                risk_level = 'high'
            WHERE id = ?
        """, (overdue_date.isoformat(), demo_user_id, task_id))
        
        print(f"  🔴 {title[:50]} - Overdue by {2+i} days")
        updated_count += 1
    
    # Make next 3 tasks MEDIUM RISK (due soon, assigned to demo_user, low progress)
    print("\n📝 Creating MEDIUM RISK tasks...")
    for i, task in enumerate(tasks[3:6]):
        task_id, title, status = task
        
        # Set due date soon (1-2 days from now)
        due_soon_date = now + timedelta(days=1 + (i % 2))
        
        cursor.execute("""
            UPDATE tasks 
            SET due_date = ?,
                assignee_id = ?,
                progress_percentage = ?,
                status = 'In Progress',
                risk_level = 'medium'
            WHERE id = ?
        """, (due_soon_date.isoformat(), demo_user_id, 20 + (i * 10), task_id))
        
        print(f"  🟠 {title[:50]} - Due in {1 + (i % 2)} days")
        updated_count += 1
    
    # Make remaining tasks LOW RISK (due later, good progress)
    print("\n📝 Creating LOW RISK tasks...")
    for i, task in enumerate(tasks[6:]):
        task_id, title, status = task
        
        # Set due date later (7-14 days from now)
        due_later_date = now + timedelta(days=7 + i)
        
        cursor.execute("""
            UPDATE tasks 
            SET due_date = ?,
                assignee_id = ?,
                progress_percentage = ?,
                status = 'In Progress',
                risk_level = 'low'
            WHERE id = ?
        """, (due_later_date.isoformat(), demo_user_id, 50 + (i * 10), task_id))
        
        print(f"  ⚪ {title[:50]} - Due in {7+i} days")
        updated_count += 1
    
    conn.commit()
    
    print(f"\n✅ Successfully updated {updated_count} tasks!")
    
    # Show summary
    print("\n=== Risk Summary for Calculator Project ===")
    cursor.execute("""
        SELECT risk_level, COUNT(*) 
        FROM tasks 
        WHERE project_id = ?
        AND assignee_id = ?
        GROUP BY risk_level
    """, (calculator_project_id, demo_user_id))
    
    for row in cursor.fetchall():
        print(f"{row[0].upper()}: {row[1]} tasks")
    
    print(f"\n✅ All tasks assigned to: {demo_username}")
    print(f"✅ Project: Calculator Project")
    print(f"\n🎯 Now restart your backend to run risk detection!")
    
    conn.close()

if __name__ == "__main__":
    seed_calculator_risks()
