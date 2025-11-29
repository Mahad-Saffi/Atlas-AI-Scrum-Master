#!/usr/bin/env python3
"""
Test script for bulk task assignment
"""
import httpx
import json

# Configuration
API_URL = "http://localhost:8000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJkZW1vX3VzZXIiLCJlbWFpbCI6ImRlbW9AYXRsYXMuYWkiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPURlbW8rVXNlciZiYWNrZ3JvdW5kPTRhOTBlMiIsImV4cCI6MTc2NTA1ODgyNn0.WsyEnje6QmWSh0gphNo8hhGBbr8GDQARrSY927xN25Q"

def test_bulk_assign():
    """Test bulk task assignment"""
    print("🧪 Testing Bulk Task Assignment\n")
    
    client = httpx.Client(
        base_url=API_URL,
        headers={"Authorization": f"Bearer {TOKEN}"}
    )
    
    # 1. Get projects
    print("1️⃣ Getting projects...")
    response = client.get("/api/v1/projects")
    projects = response.json()
    
    if not projects:
        print("❌ No projects found. Please create a project first.")
        return
    
    project_id = projects[0]["id"]
    print(f"✅ Found project: {projects[0]['name']} ({project_id})\n")
    
    # 2. Get tasks
    print("2️⃣ Getting tasks...")
    response = client.get(f"/api/v1/projects/{project_id}/tasks")
    tasks = response.json()
    
    if len(tasks) < 3:
        print(f"❌ Need at least 3 tasks, found {len(tasks)}")
        return
    
    # Get first 5 unassigned tasks
    unassigned_tasks = [t for t in tasks if t["assignee_id"] is None][:5]
    task_ids = [t["id"] for t in unassigned_tasks]
    
    print(f"✅ Found {len(unassigned_tasks)} unassigned tasks:")
    for task in unassigned_tasks:
        print(f"   • {task['title']}")
    print()
    
    # 3. Get team members
    print("3️⃣ Getting team members...")
    response = client.get("/api/v1/organizations/members")
    members = response.json()
    
    # Find a developer to assign to
    developer = next((m for m in members if m["role"] == "developer" and m["id"] != 3), None)
    
    if not developer:
        print("❌ No developer found to assign tasks to")
        return
    
    print(f"✅ Found developer: {developer['username']} (ID: {developer['id']})\n")
    
    # 4. Bulk assign tasks
    print(f"4️⃣ Bulk assigning {len(task_ids)} tasks to {developer['username']}...")
    response = client.post(
        "/api/v1/projects/tasks/bulk-assign",
        json={
            "task_ids": task_ids,
            "assigned_to": developer["id"]
        }
    )
    
    result = response.json()
    print(f"✅ {result['message']}")
    print(f"   • Success: {result['success_count']}")
    print(f"   • Failed: {result['failed_count']}")
    
    if result['failed_tasks']:
        print("   • Failed tasks:")
        for failed in result['failed_tasks']:
            print(f"     - {failed['task_id']}: {failed['reason']}")
    print()
    
    # 5. Verify assignments
    print("5️⃣ Verifying assignments...")
    response = client.get(f"/api/v1/projects/{project_id}/tasks")
    updated_tasks = response.json()
    
    assigned_count = sum(1 for t in updated_tasks if t["assignee_id"] == developer["id"])
    print(f"✅ {assigned_count} tasks now assigned to {developer['username']}\n")
    
    print("🎉 Bulk assignment test completed successfully!")
    
    client.close()

if __name__ == "__main__":
    try:
        test_bulk_assign()
    except Exception as e:
        print(f"❌ Error: {e}")
