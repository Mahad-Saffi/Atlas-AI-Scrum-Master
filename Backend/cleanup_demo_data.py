"""
Script to clean up all data for demo_user (channels, messages, projects, etc.)
while keeping the demo_user account itself
"""
import sqlite3
import os

def cleanup_demo_data():
    """Clean up all data while keeping demo_user account"""
    db_path = os.path.join(os.path.dirname(__file__), 'atlas.db')
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get the demo user ID
        cursor.execute("SELECT id, username, email FROM users WHERE username = 'demo_user'")
        demo_user = cursor.fetchone()
        
        if not demo_user:
            print("❌ Demo user not found in database!")
            return
        
        demo_user_id = demo_user[0]
        print(f"✓ Found demo user: {demo_user[1]} ({demo_user[2]}) - ID: {demo_user_id}")
        
        print("\n⚠️  About to clean up ALL data (keeping demo_user account)")
        print("This will delete:")
        print("  - All projects")
        print("  - All tasks, epics, stories, issues")
        print("  - All chat channels and messages")
        print("  - All notifications")
        print("  - All organization memberships")
        
        # Confirm deletion
        response = input("\nProceed with cleanup? (yes/no): ").strip().lower()
        
        if response != 'yes':
            print("❌ Cleanup cancelled.")
            return
        
        # Delete all data (order matters due to foreign keys)
        
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
        
        # Delete chat messages
        cursor.execute("DELETE FROM messages")
        deleted_messages = cursor.rowcount
        print(f"✓ Deleted {deleted_messages} chat messages")
        
        # Delete channel members
        cursor.execute("DELETE FROM channel_members")
        deleted_channel_members = cursor.rowcount
        print(f"✓ Deleted {deleted_channel_members} channel memberships")
        
        # Delete channels
        cursor.execute("DELETE FROM channels")
        deleted_channels = cursor.rowcount
        print(f"✓ Deleted {deleted_channels} channels")
        
        # Delete notifications
        cursor.execute("DELETE FROM notifications")
        deleted_notifications = cursor.rowcount
        print(f"✓ Deleted {deleted_notifications} notifications")
        
        # Delete user presence
        cursor.execute("DELETE FROM user_presence")
        deleted_presence = cursor.rowcount
        print(f"✓ Deleted {deleted_presence} user presence records")
        
        # Delete organization members (but keep organizations)
        cursor.execute("DELETE FROM organization_members")
        deleted_org_members = cursor.rowcount
        print(f"✓ Deleted {deleted_org_members} organization memberships")
        
        # Commit the changes
        conn.commit()
        
        print("\n✅ Cleanup completed successfully!")
        print(f"✓ Kept demo_user account: {demo_user[1]} ({demo_user[2]})")
        
        # Show remaining counts
        cursor.execute("SELECT COUNT(*) FROM users")
        print(f"\n📊 Database Status:")
        print(f"  Users: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM projects")
        print(f"  Projects: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM tasks")
        print(f"  Tasks: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM channels")
        print(f"  Channels: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM messages")
        print(f"  Messages: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM organizations")
        print(f"  Organizations: {cursor.fetchone()[0]}")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Demo Data Cleanup Script")
    print("=" * 60)
    print("This will delete ALL data while keeping demo_user account")
    print("=" * 60)
    print()
    
    cleanup_demo_data()
