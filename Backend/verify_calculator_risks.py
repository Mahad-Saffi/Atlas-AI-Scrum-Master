"""
Verify Calculator project risks
"""
import sqlite3

conn = sqlite3.connect('atlas.db')
cursor = conn.cursor()

calculator_project_id = "05fa7cd8-b200-4078-b65a-7eb919127072"

print("\n=== HIGH RISK Tasks (Overdue) ===\n")
cursor.execute("""
    SELECT title, due_date, progress_percentage, status, risk_level
    FROM tasks 
    WHERE project_id = ?
    AND risk_level = 'high'
    ORDER BY due_date
""", (calculator_project_id,))

for row in cursor.fetchall():
    print(f"🔴 {row[0][:50]}")
    print(f"   Due: {row[1]} | Progress: {row[2]}% | Status: {row[3]}")
    print()

print("\n=== MEDIUM RISK Tasks (Due Soon) ===\n")
cursor.execute("""
    SELECT title, due_date, progress_percentage, status, risk_level
    FROM tasks 
    WHERE project_id = ?
    AND risk_level = 'medium'
    ORDER BY due_date
""", (calculator_project_id,))

for row in cursor.fetchall():
    print(f"🟠 {row[0][:50]}")
    print(f"   Due: {row[1]} | Progress: {row[2]}% | Status: {row[3]}")
    print()

print("\n=== Summary ===")
cursor.execute("""
    SELECT risk_level, COUNT(*) 
    FROM tasks 
    WHERE project_id = ?
    GROUP BY risk_level
""", (calculator_project_id,))

for row in cursor.fetchall():
    emoji = "🔴" if row[0] == "high" else "🟠" if row[0] == "medium" else "⚪"
    print(f"{emoji} {row[0].upper()}: {row[1]} tasks")

conn.close()
