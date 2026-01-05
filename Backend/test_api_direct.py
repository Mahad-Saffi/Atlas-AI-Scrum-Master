"""
Test API endpoints directly to verify they return correct data
"""
import requests
import json

# You'll need to replace this with a valid JWT token from your browser
# Open browser console and run: localStorage.getItem('jwt')
TOKEN = "YOUR_JWT_TOKEN_HERE"

BASE_URL = "http://localhost:8000/api/v1"

def test_projects_api():
    print("\n=== Testing Projects API ===\n")
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    # Get all projects
    response = requests.get(f"{BASE_URL}/projects", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        projects = response.json()
        print(f"Found {len(projects)} projects:\n")
        
        for project in projects:
            print(f"Project: {project['name']} (ID: {project['id']})")
            
            # Get tasks for this project
            tasks_response = requests.get(
                f"{BASE_URL}/projects/{project['id']}/tasks",
                headers=headers
            )
            
            if tasks_response.status_code == 200:
                tasks = tasks_response.json()
                print(f"  → {len(tasks)} tasks")
                
                # Show first 3 tasks
                for i, task in enumerate(tasks[:3]):
                    print(f"     {i+1}. {task['title']} (Status: {task['status']})")
                
                if len(tasks) > 3:
                    print(f"     ... and {len(tasks) - 3} more")
            else:
                print(f"  → Error fetching tasks: {tasks_response.status_code}")
            
            print()
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    if TOKEN == "YOUR_JWT_TOKEN_HERE":
        print("ERROR: Please set your JWT token in the script")
        print("Get it from browser console: localStorage.getItem('jwt')")
    else:
        test_projects_api()
