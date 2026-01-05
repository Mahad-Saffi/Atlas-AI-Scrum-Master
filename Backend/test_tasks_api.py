"""
Test the tasks API endpoint to see if it filters by project correctly
"""
import asyncio
from app.services.task_service import task_service

async def test_tasks_by_project():
    print("\n=== Testing Tasks by Project ===\n")
    
    # Test Project 1: New Project
    project1_id = "a5086f8673c244d28ffd9d599f0f14b2"
    print(f"Project 1: {project1_id}")
    tasks1 = await task_service.get_tasks_for_user_in_project(project1_id, 1)
    print(f"Tasks returned: {len(tasks1)}")
    for task in tasks1[:5]:  # Show first 5
        print(f"  - {task['title']} (Status: {task['status']})")
    
    print()
    
    # Test Project 2: Flappy Bird Clone
    project2_id = "2fac609ad7dc4a6ab9a8b8c713b37824"
    print(f"Project 2: {project2_id}")
    tasks2 = await task_service.get_tasks_for_user_in_project(project2_id, 1)
    print(f"Tasks returned: {len(tasks2)}")
    for task in tasks2[:5]:  # Show first 5
        print(f"  - {task['title']} (Status: {task['status']})")
    
    print()
    
    # Test Project 3: Calculator Project
    project3_id = "05fa7cd8-b200-4078-b65a-7eb919127072"
    print(f"Project 3: {project3_id}")
    tasks3 = await task_service.get_tasks_for_user_in_project(project3_id, 1)
    print(f"Tasks returned: {len(tasks3)}")
    for task in tasks3[:5]:  # Show first 5
        print(f"  - {task['title']} (Status: {task['status']})")
    
    print()
    
    # Check if tasks are different
    task1_ids = {t['id'] for t in tasks1}
    task2_ids = {t['id'] for t in tasks2}
    task3_ids = {t['id'] for t in tasks3}
    
    print("=== Verification ===")
    print(f"Project 1 has {len(task1_ids)} unique tasks")
    print(f"Project 2 has {len(task2_ids)} unique tasks")
    print(f"Project 3 has {len(task3_ids)} unique tasks")
    print(f"Overlap between Project 1 and 2: {len(task1_ids & task2_ids)} tasks")
    print(f"Overlap between Project 1 and 3: {len(task1_ids & task3_ids)} tasks")
    print(f"Overlap between Project 2 and 3: {len(task2_ids & task3_ids)} tasks")
    
    if len(task1_ids & task2_ids) > 0 or len(task1_ids & task3_ids) > 0 or len(task2_ids & task3_ids) > 0:
        print("\n❌ ERROR: Projects are sharing tasks! This is the bug.")
    else:
        print("\n✅ SUCCESS: Each project has unique tasks. Backend is working correctly.")

if __name__ == "__main__":
    asyncio.run(test_tasks_by_project())
