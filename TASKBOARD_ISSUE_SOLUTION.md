# Task Board Issue - Complete Analysis & Solution

## Problem Confirmed

You're seeing **Flappy Bird tasks** when viewing the **Calculator Project** task board.

## Investigation Results

### ✅ Database is Correct

I verified the database and confirmed:

- **Calculator Project** (`05fa7cd8-b200-4078-b65a-7eb919127072`): Has 30 tasks
  - Examples: "Define user interface for addition", "Implement addition logic", etc.
- **Flappy Bird Project** (`2fac609ad7dc4a6ab9a8b8c713b37824`): Has 25 tasks
  - Examples: "Create bird sprite", "Implement tap detection", etc.
- **New Project** (`a5086f8673c244d28ffd9d599f0f14b2`): Has 7 tasks

### ✅ Backend API is Correct

The backend correctly filters tasks by project_id.

### 🔍 Issue is in Frontend

The problem is likely one of these:

1. **Browser cache** - Old data is cached
2. **React state** - State not updating correctly
3. **API response** - Wrong project_id being sent
4. **Axios cache** - HTTP client caching responses

## Debug Logging Added

I've added comprehensive logging to track:

1. Which projects are fetched
2. Which project is selected
3. Which tasks are fetched for each project
4. The first 3 tasks with their project_ids

## How to Debug

### Step 1: Clear Everything

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**:
   - Press F12
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

### Step 2: Open Console

1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Clear any existing logs

### Step 3: Navigate to Task Board

1. Go to the Task Board page
2. Watch the console output

### Step 4: Check Console Output

You should see something like this:

```
[TaskBoard] Fetched projects: [{id: "a5086f86...", name: "New Project"}, {id: "2fac609a...", name: "Flappy Bird Clone"}, {id: "05fa7cd8...", name: "Calculator Project"}]
[TaskBoard] Setting initial project to: New Project a5086f8673c244d28ffd9d599f0f14b2
[TaskBoard] Fetching tasks for project: a5086f8673c244d28ffd9d599f0f14b2
[TaskBoard] Received 7 tasks for project a5086f8673c244d28ffd9d599f0f14b2
[TaskBoard] First 3 tasks: [{title: "Create repository", project_id: "a5086f86..."}, ...]
```

### Step 5: Change to Calculator Project

1. Use the dropdown to select "Calculator Project"
2. Watch the console

You should see:

```
[TaskBoard] Project changed from a5086f86... to 05fa7cd8-b200-4078-b65a-7eb919127072
[TaskBoard] Fetching tasks for project: 05fa7cd8-b200-4078-b65a-7eb919127072
[TaskBoard] Received 30 tasks for project 05fa7cd8-b200-4078-b65a-7eb919127072
[TaskBoard] First 3 tasks: [{title: "Define user interface for addition", project_id: "05fa7cd8..."}, ...]
```

## What to Look For

### Scenario 1: Console shows correct tasks, UI shows wrong tasks

**Problem**: React rendering issue
**Solution**: Check if TaskBoard component is receiving correct props

### Scenario 2: Console shows wrong project_id

**Problem**: Project selector not working
**Solution**: Check dropdown value binding

### Scenario 3: Console shows correct project_id but wrong tasks

**Problem**: Backend returning wrong data OR axios caching
**Solution**: Check Network tab to see actual API response

### Scenario 4: Tasks from Flappy Bird have Calculator project_id

**Problem**: Database corruption
**Solution**: Need to fix database

## Quick Fixes to Try

### Fix 1: Disable Auto-Refresh

The page auto-refreshes every 10 seconds. This might be causing issues.

In `TaskBoardPage.tsx`, find this code around line 110:

```typescript
// Auto-refresh every 10 seconds
const interval = setInterval(() => {
  if (selectedProjectId) {
    fetchTasks(false);
  }
}, 10000);

return () => clearInterval(interval);
```

Comment it out:

```typescript
// TEMPORARILY DISABLED FOR DEBUGGING
// const interval = setInterval(() => {
//   if (selectedProjectId) {
//     fetchTasks(false);
//   }
// }, 10000);

// return () => clearInterval(interval);
```

### Fix 2: Clear Axios Cache

Add this to `taskService.ts`:

```typescript
const getTasks = async (projectId: string) => {
  const token = localStorage.getItem("jwt");
  const response = await axios.get(`${API_URL}/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache", // ADD THIS
      Pragma: "no-cache", // ADD THIS
    },
  });
  return response.data;
};
```

### Fix 3: Force Re-render

Add a key to the TaskBoard component to force it to re-render when project changes:

In `TaskBoardPage.tsx`, find:

```typescript
<TaskBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
```

Change to:

```typescript
<TaskBoard
  key={selectedProjectId} // ADD THIS
  tasks={filteredTasks}
  onTaskUpdate={handleTaskUpdate}
/>
```

## Network Tab Debugging

1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Filter by "XHR" or "Fetch"
4. Change project in dropdown
5. Look for request to `/api/v1/projects/{project_id}/tasks`
6. Click on it and check:
   - **Request URL**: Does it have the correct project_id?
   - **Response**: Does it return the correct tasks?

## Expected Database Values

For reference, here's what should be in the database:

### Calculator Project Tasks (30 total)

- Define user interface for addition
- Implement addition logic in the backend
- Create unit tests for addition functionality
- Integrate addition feature with the UI
- Conduct user acceptance testing
- Define user interface for subtraction
- ... (25 more)

### Flappy Bird Tasks (25 total)

- Create bird sprite
- Implement tap detection
- Add upward force to the bird
- Implement gravity effect
- Test bird movement responsiveness
- ... (20 more)

## What to Report

Please share:

1. **Console logs** when you:
   - First load the page
   - Change to Calculator Project
2. **Network tab** screenshot showing:

   - The API request URL
   - The response data

3. **What you see** in the UI:
   - How many tasks?
   - What are the first 3 task titles?

## If Nothing Works

If the issue persists after trying all fixes, the problem might be:

1. **Service Worker** caching responses

   - Solution: Unregister service workers in DevTools → Application → Service Workers

2. **Proxy/CDN** caching

   - Solution: Add timestamp to API calls

3. **Database issue** - Tasks have wrong project_ids
   - Solution: Run database fix script

Let me know what you find in the console logs!
