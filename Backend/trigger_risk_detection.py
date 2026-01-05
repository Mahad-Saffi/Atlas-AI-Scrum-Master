"""
Manually trigger risk detection and show results
"""
import asyncio
import sqlite3
from datetime import datetime, timedelta

async def update_sample_due_dates():
    """Add some due dates to tasks for testing"""
    conn = sqlite3.connect('atlas.db')
    cursor = conn.cursor()
    
    now = datetime.utcnow()
    
    # Get some In Progress tasks without due dates
    cursor.execute("""
        SELECT id FROM tasks 
        WHERE status = 'In Progress' 
        AND due_date IS NULL 
        LIMIT 3
    """)
    in_progress_ids = [row[0] for row in cursor.fetchall()]
    
    # Set them as overdue (high risk)
    for task_id in in_progress_ids:
        cursor.execute("""
            UPDATE tasks 
            SET due_date = ? 
            WHERE id = ?
        """, ((now - timedelta(days=2)).isoformat(), task_id))
    
    # Get some To Do tasks without due dates
    cursor.execute("""
        SELECT id FROM tasks 
        WHERE status = 'To Do' 
        AND due_date IS NULL 
        LIMIT 3
    """)
    todo_ids = [row[0] for row in cursor.fetchall()]
    
    # Set them due soon (medium risk)
    for task_id in todo_ids:
        cursor.execute("""
            UPDATE tasks 
            SET due_date = ? 
            WHERE id = ?
        """, ((now + timedelta(days=2)).isoformat(), task_id))
    
    conn.commit()
    updated_count = len(in_progress_ids) + len(todo_ids)
    print(f"✅ Updated {updated_count} tasks with due dates")
    conn.close()

async def run_risk_detection():
    """Run risk detection"""
    from app.services.risk_service import risk_service
    
    print("\n=== Running Risk Detection ===\n")
    result = await risk_service.detect_delays_and_update_risks()
    
    print(f"Tasks scanned: {result['tasks_scanned']}")
    print(f"High risk: {result['high_risk']}")
    print(f"Medium risk: {result['medium_risk']}")
    print(f"Notifications sent: {result['notifications_sent']}")

async def show_risk_summary():
    """Show risk summary"""
    conn = sqlite3.connect('atlas.db')
    cursor = conn.cursor()
    
    print("\n=== Risk Summary ===\n")
    
    cursor.execute("""
        SELECT risk_level, COUNT(*) 
        FROM tasks 
        WHERE status IN ('To Do', 'In Progress')
        GROUP BY risk_level
    """)
    
    for row in cursor.fetchall():
        print(f"{row[0]}: {row[1]} tasks")
    
    print("\n=== High Risk Tasks ===\n")
    cursor.execute("""
        SELECT title, status, due_date, progress_percentage, risk_level
        FROM tasks 
        WHERE risk_level = 'high'
        LIMIT 5
    """)
    
    for row in cursor.fetchall():
        print(f"- {row[0][:50]} | {row[1]} | Due: {row[2]} | Progress: {row[3]}% | Risk: {row[4]}")
    
    print("\n=== Medium Risk Tasks ===\n")
    cursor.execute("""
        SELECT title, status, due_date, progress_percentage, risk_level
        FROM tasks 
        WHERE risk_level = 'medium'
        LIMIT 5
    """)
    
    for row in cursor.fetchall():
        print(f"- {row[0][:50]} | {row[1]} | Due: {row[2]} | Progress: {row[3]}% | Risk: {row[4]}")
    
    conn.close()

async def main():
    print("Step 1: Adding sample due dates to tasks...")
    await update_sample_due_dates()
    
    print("\nStep 2: Running risk detection...")
    await run_risk_detection()
    
    print("\nStep 3: Showing risk summary...")
    await show_risk_summary()
    
    print("\n✅ Done! Risk detection completed.")

if __name__ == "__main__":
    asyncio.run(main())
