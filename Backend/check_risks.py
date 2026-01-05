import sqlite3

conn = sqlite3.connect('atlas.db')
cursor = conn.cursor()

print("\n=== Current Risk Distribution ===\n")
cursor.execute("""
    SELECT risk_level, COUNT(*) 
    FROM tasks 
    WHERE status IN ('To Do', 'In Progress')
    GROUP BY risk_level
""")

for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]} tasks")

print("\n=== Sample Tasks with Due Dates ===\n")
cursor.execute("""
    SELECT title, status, due_date, progress_percentage, risk_level
    FROM tasks 
    WHERE due_date IS NOT NULL
    LIMIT 10
""")

for row in cursor.fetchall():
    print(f"{row[0][:40]} | {row[1]} | Due: {row[2]} | Progress: {row[3]}% | Risk: {row[4]}")

conn.close()
