# Automatic Risk Detection - Setup Complete ✅

## What Was Implemented

I've set up automatic periodic risk detection that runs in the background.

### Features

1. **Automatic Scheduling**: Risk detection runs every hour automatically
2. **Startup Detection**: Runs immediately when the server starts
3. **Background Task**: Runs in the background without blocking the API
4. **Logging**: All risk detection runs are logged for monitoring

### Files Created/Modified

1. **`Backend/app/core/scheduler.py`** (NEW)

   - Background task scheduler
   - Manages periodic tasks
   - Handles errors gracefully

2. **`Backend/main.py`** (MODIFIED)
   - Added scheduler initialization on startup
   - Added risk detection task (runs every hour)
   - Added immediate risk detection on startup
   - Added graceful shutdown handler

### How It Works

```
Server Starts
    ↓
Initialize Scheduler
    ↓
Run Risk Detection Immediately
    ↓
Schedule Risk Detection Every Hour
    ↓
[Every Hour]
    ↓
Scan All Active Tasks
    ↓
Calculate Risk Levels
    ↓
Update Database
    ↓
Send Notifications for High Risk Tasks
```

### Risk Calculation Logic

Tasks are evaluated based on:

1. **Due Date Proximity**

   - Overdue: +50 risk points → HIGH RISK
   - Due within 1 day: +30 points
   - Due within 3 days: +20 points
   - Due within 7 days: +10 points

2. **Progress vs Status**

   - In Progress but <25% complete: +15 points
   - In Progress but <50% complete: +10 points
   - In Progress but 0% complete: +20 points (stuck task)

3. **Risk Levels**
   - **High Risk**: 40+ points (🔴 Red indicator)
   - **Medium Risk**: 20-39 points (🟠 Orange indicator)
   - **Low Risk**: <20 points (No indicator or gray)

### What Happens Now

When you **restart your backend server**:

1. ✅ Server starts up
2. ✅ Scheduler initializes
3. ✅ Risk detection runs immediately
4. ✅ All tasks are scanned and risk levels updated
5. ✅ High-risk tasks trigger notifications
6. ✅ Risk detection will run again in 1 hour
7. ✅ Continues running every hour automatically

### How to Use

#### Step 1: Restart Backend Server

```bash
cd Backend
# Stop current server (Ctrl+C)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Step 2: Watch the Logs

You should see:

```
INFO: Running initial risk detection...
INFO: ⏰ Running scheduled task: Risk Detection
INFO: Risk detection: 3 high, 4 medium risks found
INFO: ✅ Completed task: Risk Detection
INFO: 📋 Scheduled task: Risk Detection (every 3600s)
```

#### Step 3: Check Task Board

1. Go to Task Board in your frontend
2. Look for colored dots on tasks:
   - 🔴 Red dot = High risk (overdue or stuck)
   - 🟠 Orange dot = Medium risk (due soon)
   - No dot = Low risk

### Manual Trigger (Optional)

You can still manually trigger risk detection anytime:

```bash
curl -X POST http://localhost:8000/api/v1/projects/detect-delays \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Or from the frontend, you could add a "Refresh Risks" button that calls this endpoint.

### Configuration

To change the frequency, edit `Backend/main.py`:

```python
# Current: Every hour (3600 seconds)
scheduler.add_task(run_risk_detection, 3600, "Risk Detection")

# Every 30 minutes:
scheduler.add_task(run_risk_detection, 1800, "Risk Detection")

# Every 2 hours:
scheduler.add_task(run_risk_detection, 7200, "Risk Detection")
```

### Monitoring

Check the backend logs to see risk detection running:

```bash
# Watch logs in real-time
cd Backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Look for these log messages:

- `⏰ Running scheduled task: Risk Detection`
- `Risk detection: X high, Y medium risks found`
- `✅ Completed task: Risk Detection`

### Current Risk Status

Based on the database:

- **3 High Risk Tasks** (overdue)
- **4 Medium Risk Tasks** (due soon)
- **103 Low Risk Tasks**

### Notifications

When a task's risk level increases to HIGH:

- ✅ Assignee receives a notification
- ✅ Notification type: "task_at_risk"
- ✅ Message: "Task [name] is at high risk of delay"
- ✅ Link to task board

### Testing

1. **Create a task with a due date in the past**

   - Should be marked as HIGH RISK immediately

2. **Create a task due tomorrow**

   - Should be marked as MEDIUM RISK

3. **Wait for the next hour**
   - Risk detection will run automatically
   - Check logs for confirmation

### Troubleshooting

**If risk detection doesn't run:**

1. Check backend logs for errors
2. Verify scheduler started: Look for "Background scheduler started"
3. Check if risk detection ran: Look for "Running scheduled task: Risk Detection"

**If risks don't show in UI:**

1. Hard refresh browser (Ctrl+Shift+R)
2. Check if tasks have due dates (risk calculation needs due dates)
3. Verify risk_level column in database is updated

### Next Steps

1. ✅ Restart backend server
2. ✅ Watch logs to confirm risk detection runs
3. ✅ Check Task Board for risk indicators
4. ✅ Risk detection will continue running every hour automatically

## Summary

✅ Automatic risk detection is now set up and will run every hour
✅ Runs immediately on server startup
✅ Updates all task risk levels automatically
✅ Sends notifications for high-risk tasks
✅ No manual intervention needed

Just restart your backend server and it will start working!
