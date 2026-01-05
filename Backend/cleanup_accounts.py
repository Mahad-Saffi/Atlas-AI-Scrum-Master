"""
Script to delete all user accounts except the demo account
"""
import sqlite3
import os

def cleanup_accounts():
    """Delete all accounts except demo_user"""
    db_path = os.path.join(os.path.dirname(__file__), 'atlas.db')
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # First, get the demo user ID
        cursor.execute("SELECT id, username, email FROM users WHERE username = 'demo_user'")
        demo_user = cursor.fetchone()
        
        if not demo_user:
            print("❌ Demo user not found in database!")
            return
        
        demo_user_id = demo_user[0]
        print(f"✓ Found demo user: {demo_user[1]} ({demo_user[2]}) - ID: {demo_user_id}")
        
        # Get count of users to delete
        cursor.execute("SELECT COUNT(*) FROM users WHERE id != ?", (demo_user_id,))
        count_to_delete = cursor.fetchone()[0]
        
        if count_to_delete == 0:
            print("✓ No other users to delete. Only demo_user exists.")
            return
        
        print(f"\n⚠️  About to delete {count_to_delete} user(s) (keeping demo_user)")
        
        # Show users that will be deleted
        cursor.execute("SELECT id, username, email FROM users WHERE id != ?", (demo_user_id,))
        users_to_delete = cursor.fetchall()
        
        print("\nUsers to be deleted:")
        for user in users_to_delete:
            print(f"  - {user[1]} ({user[2]}) - ID: {user[0]}")
        
        # Confirm deletion
        response = input("\nProceed with deletion? (yes/no): ").strip().lower()
        
        if response != 'yes':
            print("❌ Deletion cancelled.")
            return
        
        # Delete related data first (due to foreign key constraints)
        
        # Delete organization memberships
        cursor.execute("""
            DELETE FROM organization_members 
            WHERE user_id != ?
        """, (demo_user_id,))
        deleted_memberships = cursor.rowcount
        print(f"✓ Deleted {deleted_memberships} organization memberships")
        
        # Delete chat messages
        cursor.execute("""
            DELETE FROM messages 
            WHERE sender_id != ?
        """, (demo_user_id,))
        deleted_messages = cursor.rowcount
        print(f"✓ Deleted {deleted_messages} chat messages")
        
        # Delete chat channel members
        cursor.execute("""
            DELETE FROM channel_members 
            WHERE user_id != ?
        """, (demo_user_id,))
        deleted_channel_members = cursor.rowcount
        print(f"✓ Deleted {deleted_channel_members} chat channel memberships")
        
        # Delete notifications
        cursor.execute("""
            DELETE FROM notifications 
            WHERE user_id != ?
        """, (demo_user_id,))
        deleted_notifications = cursor.rowcount
        print(f"✓ Deleted {deleted_notifications} notifications")
        
        # Delete user presence
        cursor.execute("""
            DELETE FROM user_presence 
            WHERE user_id != ?
        """, (demo_user_id,))
        deleted_presence = cursor.rowcount
        print(f"✓ Deleted {deleted_presence} user presence records")
        
        # Finally, delete the users
        cursor.execute("""
            DELETE FROM users 
            WHERE id != ?
        """, (demo_user_id,))
        deleted_users = cursor.rowcount
        print(f"✓ Deleted {deleted_users} user account(s)")
        
        # Commit the changes
        conn.commit()
        
        print("\n✅ Cleanup completed successfully!")
        print(f"✓ Kept demo_user account: {demo_user[1]} ({demo_user[2]})")
        
        # Show remaining users
        cursor.execute("SELECT COUNT(*) FROM users")
        remaining_users = cursor.fetchone()[0]
        print(f"✓ Total users remaining: {remaining_users}")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Account Cleanup Script")
    print("=" * 60)
    print("This will delete ALL accounts except demo_user")
    print("=" * 60)
    print()
    
    cleanup_accounts()
