"""
Script to delete all projects and related data
"""
import sqlite3
import os

def cleanup_projects():
    """Delete all projects and their related data"""
    db_path = os.path.join(os.path.dirname(__file__), 'atlas.db')
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get count of projects
        cursor.execute("SELECT COUNT(*) FROM projects")
        count_projects = cursor.fetchone()[0]
        
        if count_projects == 0:
            print("✓ No projects to delete.")
            return
        
        print(f"\n⚠️  About to delete {count_projects} project(s) and all related data")
        
        # Show projects that will be deleted
        cursor.execute("SELECT id, name, description FROM projects")
        projects = cursor.fetchall()
        
        print("\nProjects to be deleted:")
        for project in projects:
            print(f"  - {project[1]} (ID: {project[0]})")
            if project[2]:
                print(f"    Description: {project[2][:60]}...")
        
        # Confirm deletion
        response = input("\nProceed with deletion? (yes/no): ").strip().lower()
        
        if response != 'yes':
            print("❌ Deletion cancelled.")
            return
        
        # Delete related data first (due to foreign key constraints)
        
        # Delete issues
        cursor.execute("DELETE FROM issues")
        deleted_issues = cursor.rowcount
        print(f"✓ Deleted {deleted_issues} issues")
        
        # Delete tasks
        cursor.execute("DELETE FROM tasks")
        deleted_tasks = cursor.rowcount
        print(f"✓ Deleted {deleted_tasks} tasks")
        
        # Delete stories
        cursor.execute("DELETE FROM stories")
        deleted_stories = cursor.rowcount
        print(f"✓ Deleted {deleted_stories} stories")
        
        # Delete epics
        cursor.execute("DELETE FROM epics")
        deleted_epics = cursor.rowcount
        print(f"✓ Deleted {deleted_epics} epics")
        
        # Delete projects
        cursor.execute("DELETE FROM projects")
        deleted_projects = cursor.rowcount
        print(f"✓ Deleted {deleted_projects} projects")
        
        # Commit the changes
        conn.commit()
        
        print("\n✅ Project cleanup completed successfully!")
        
        # Show remaining counts
        cursor.execute("SELECT COUNT(*) FROM projects")
        remaining_projects = cursor.fetchone()[0]
        print(f"✓ Total projects remaining: {remaining_projects}")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Project Cleanup Script")
    print("=" * 60)
    print("This will delete ALL projects and related data")
    print("(Tasks, Stories, Epics, Issues)")
    print("=" * 60)
    print()
    
    cleanup_projects()
