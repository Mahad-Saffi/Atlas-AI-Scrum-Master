# 🤖 AI-Powered Browser Automation System - Design Document

## 📋 Overview

An intelligent automation system that allows users to control the Atlas application through natural language commands. The AI uses Selenium WebDriver to interact with the browser in real-time, making decisions based on GPT-4 and a pre-configured application map.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (React)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AI Assistant Page                                      │ │
│  │  - Task Input                                           │ │
│  │  - Real-time Browser View (VNC/Screenshots)            │ │
│  │  - Action Log                                           │ │
│  │  - Status Indicator                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ WebSocket
┌─────────────────────────────────────────────────────────────┐
│              Backend API (FastAPI + WebSocket)               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AI Automation Service                                  │ │
│  │  - Task Queue                                           │ │
│  │  - WebSocket Manager (real-time updates)               │ │
│  │  - Screenshot Streaming                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              AI Agent (GPT-4 + Selenium)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Application Map Parser                               │ │
│  │  - Page Detector                                        │ │
│  │  - Action Executor                                      │ │
│  │  - Decision Engine (GPT-4)                              │ │
│  │  - Context Manager                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Selenium WebDriver (Chrome/Firefox)                  │
│         Controls actual browser on localhost                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Application Map Structure

```json
{
  "pages": {
    "login": {
      "url": "http://localhost:5173/login",
      "identifiers": {
        "title": "Sign In - Atlas AI",
        "elements": ["#email-input", "#password-input", ".btn-primary"]
      },
      "actions": {
        "login": {
          "steps": [
            {"type": "input", "selector": "#email-input", "param": "email"},
            {"type": "input", "selector": "#password-input", "param": "password"},
            {"type": "click", "selector": ".btn-primary"}
          ]
        }
      }
    },
    "dashboard": {
      "url": "http://localhost:5173/",
      "identifiers": {
        "title": "Dashboard - Atlas AI",
        "elements": [".dashboard-header", ".project-card"]
      },
      "actions": {
        "create_project": {
          "steps": [
            {"type": "click", "selector": "button:contains('Create New Project')"}
          ],
          "navigates_to": "project_creation"
        },
        "view_tasks": {
          "steps": [
            {"type": "click", "selector": "a[href='/task-board']"}
          ],
          "navigates_to": "task_board"
        }
      }
    },
    "project_creation": {
      "url": "http://localhost:5173/create-project",
      "identifiers": {
        "title": "Create New Project",
        "elements": [".chat-interface", "input[placeholder*='message']"]
      },
      "actions": {
        "create_project_with_ai": {
          "steps": [
            {"type": "input", "selector": "input[placeholder*='message']", "param": "description"},
            {"type": "click", "selector": "button:contains('Send')"},
            {"type": "wait", "condition": "text_contains", "selector": "body", "text": "Project created"}
          ]
        }
      }
    },
    "task_board": {
      "url": "http://localhost:5173/task-board",
      "identifiers": {
        "title": "Task Board",
        "elements": [".task-card", ".kanban-column"]
      },
      "actions": {
        "start_task": {
          "steps": [
            {"type": "find_element", "selector": ".task-card:contains('{task_name}')"},
            {"type": "click", "selector": "button:contains('Start Task')"}
          ]
        },
        "complete_task": {
          "steps": [
            {"type": "find_element", "selector": ".task-card:contains('{task_name}')"},
            {"type": "click", "selector": "button:contains('Mark Complete')"}
          ]
        }
      }
    }
  }
}
```

---

## 🔧 Implementation Components

### 1. Backend Service (`backend/app/services/ai_automation_service.py`)

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from openai import AsyncOpenAI
import json
import asyncio
import base64
from typing import Dict, List, Optional

class AIAutomationService:
    def __init__(self):
        self.driver: Optional[webdriver.Chrome] = None
        self.openai_client = AsyncOpenAI()
        self.app_map = self._load_app_map()
        self.context_history = []
        self.current_task = None
        
    def _load_app_map(self) -> Dict:
        """Load application map from JSON file"""
        with open('app_map.json', 'r') as f:
            return json.load(f)
    
    async def start_automation(self, task: str, websocket):
        """Main automation loop"""
        try:
            # Initialize browser
            await self._send_update(websocket, "Initializing browser...", "info")
            self._init_browser()
            
            # Parse task with GPT
            await self._send_update(websocket, f"Understanding task: {task}", "info")
            plan = await self._create_task_plan(task)
            
            # Execute plan
            for step in plan['steps']:
                await self._execute_step(step, websocket)
                await self._send_screenshot(websocket)
                
            await self._send_update(websocket, "Task completed successfully!", "success")
            
        except Exception as e:
            await self._send_update(websocket, f"Error: {str(e)}", "error")
        finally:
            self._cleanup()
    
    def _init_browser(self):
        """Initialize Selenium WebDriver"""
        options = webdriver.ChromeOptions()
        options.add_argument('--start-maximized')
        # Don't use headless mode so we can see what's happening
        self.driver = webdriver.Chrome(options=options)
        self.driver.get('http://localhost:5173')
    
    async def _create_task_plan(self, task: str) -> Dict:
        """Use GPT to create execution plan"""
        prompt = f"""
        Given this task: "{task}"
        And this application map: {json.dumps(self.app_map, indent=2)}
        
        Create a step-by-step plan to accomplish the task.
        Return JSON with this structure:
        {{
            "steps": [
                {{"page": "page_name", "action": "action_name", "params": {{}}}},
                ...
            ]
        }}
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def _execute_step(self, step: Dict, websocket):
        """Execute a single step"""
        page = step['page']
        action = step['action']
        params = step.get('params', {})
        
        await self._send_update(
            websocket, 
            f"Executing: {action} on {page}", 
            "info"
        )
        
        # Navigate to page if needed
        current_page = self._detect_current_page()
        if current_page != page:
            await self._navigate_to_page(page, websocket)
        
        # Execute action
        action_def = self.app_map['pages'][page]['actions'][action]
        for action_step in action_def['steps']:
            await self._execute_action_step(action_step, params, websocket)
    
    async def _execute_action_step(self, action_step: Dict, params: Dict, websocket):
        """Execute individual action step"""
        action_type = action_step['type']
        
        if action_type == 'click':
            element = self.driver.find_element(By.CSS_SELECTOR, action_step['selector'])
            element.click()
            await self._send_update(websocket, f"Clicked: {action_step['selector']}", "action")
            
        elif action_type == 'input':
            element = self.driver.find_element(By.CSS_SELECTOR, action_step['selector'])
            value = params.get(action_step['param'], '')
            element.clear()
            element.send_keys(value)
            await self._send_update(websocket, f"Entered text in: {action_step['selector']}", "action")
            
        elif action_type == 'wait':
            await asyncio.sleep(2)
            
        await asyncio.sleep(0.5)  # Small delay between actions
    
    def _detect_current_page(self) -> str:
        """Detect which page we're currently on"""
        current_url = self.driver.current_url
        page_title = self.driver.title
        
        for page_name, page_def in self.app_map['pages'].items():
            if page_def['url'] in current_url:
                return page_name
        
        return "unknown"
    
    async def _send_screenshot(self, websocket):
        """Send current browser screenshot"""
        screenshot = self.driver.get_screenshot_as_base64()
        await websocket.send_json({
            "type": "screenshot",
            "data": screenshot
        })
    
    async def _send_update(self, websocket, message: str, level: str):
        """Send status update"""
        await websocket.send_json({
            "type": "update",
            "message": message,
            "level": level,
            "timestamp": datetime.now().isoformat()
        })
    
    def _cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
```

### 2. Backend API Endpoint (`backend/app/api/v1/ai_automation.py`)

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.core.security import get_current_user
from app.services.ai_automation_service import AIAutomationService

router = APIRouter()
automation_service = AIAutomationService()

@router.websocket("/ws/automation")
async def automation_websocket(websocket: WebSocket, token: str):
    await websocket.accept()
    
    try:
        while True:
            # Receive task from client
            data = await websocket.receive_json()
            task = data.get('task')
            
            if task:
                # Start automation in background
                await automation_service.start_automation(task, websocket)
                
    except WebSocketDisconnect:
        print("Client disconnected")
```

### 3. Frontend AI Assistant Page (`frontend/src/pages/AIAssistant.tsx`)

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AIAssistant: React.FC = () => {
  const [task, setTask] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startAutomation = () => {
    const token = localStorage.getItem('jwt');
    const ws = new WebSocket(`ws://localhost:8000/api/v1/ai-automation/ws/automation?token=${token}`);
    
    ws.onopen = () => {
      setIsRunning(true);
      setLogs([]);
      ws.send(JSON.stringify({ task }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'update') {
        setLogs(prev => [...prev, data]);
      } else if (data.type === 'screenshot') {
        setScreenshot(data.data);
      }
    };
    
    ws.onclose = () => {
      setIsRunning(false);
    };
    
    wsRef.current = ws;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header className="glass-header" style={{ marginBottom: '2rem' }}>
        <h1>🤖 AI Assistant</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Control Panel */}
        <div className="card-glass-solid">
          <h2>Task Input</h2>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task... e.g., 'Create a new project named Q4 Report'"
            rows={4}
            disabled={isRunning}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          
          <button
            onClick={startAutomation}
            disabled={isRunning || !task}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {isRunning ? '🔄 AI is working...' : '▶ Start Automation'}
          </button>

          {/* Action Log */}
          <div style={{ marginTop: '2rem' }}>
            <h3>Action Log</h3>
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  background: log.level === 'error' ? 'rgba(239,68,68,0.2)' : 
                             log.level === 'success' ? 'rgba(16,185,129,0.2)' : 
                             'rgba(236,223,204,0.1)',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ opacity: 0.7 }}>{log.timestamp}</span>
                  <br />
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Browser View */}
        <div className="card-glass-solid">
          <h2>Live Browser View</h2>
          {screenshot ? (
            <img 
              src={`data:image/png;base64,${screenshot}`}
              alt="Browser view"
              style={{ 
                width: '100%', 
                border: '2px solid rgba(236,223,204,0.3)',
                borderRadius: '8px'
              }}
            />
          ) : (
            <div style={{
              height: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px'
            }}>
              <p>Browser view will appear here when automation starts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
```

---

## 📦 Required Dependencies

### Backend (`backend/requirements.txt`)
```
selenium==4.15.0
webdriver-manager==4.0.1
pillow==10.1.0
```

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "react-webcam": "^7.2.0"
  }
}
```

---

## 🚀 Setup Instructions

1. **Install Selenium and ChromeDriver**
```bash
cd backend
pip install selenium webdriver-manager
```

2. **Create Application Map**
```bash
# Create app_map.json in backend/
```

3. **Add Route to Backend**
```python
# backend/main.py
from app.api.v1 import ai_automation
app.include_router(ai_automation.router, prefix="/api/v1/ai-automation", tags=["ai-automation"])
```

4. **Add Route to Frontend**
```typescript
// frontend/src/App.tsx
<Route path="/ai-assistant" element={<AIAssistant />} />
```

---

## 🎯 Example Tasks

1. **"Create a new project named 'Q4 Report'"**
   - AI navigates to dashboard
   - Clicks "Create New Project"
   - Enters "Q4 Report" in chat
   - Waits for completion

2. **"Start the task 'Design UI mockups'"**
   - AI navigates to task board
   - Finds task by name
   - Clicks "Start Task"

3. **"Add a team member with email john@example.com"**
   - AI navigates to team management
   - Fills in form fields
   - Submits form

---

## ⚠️ Important Considerations

1. **Security**: Only allow on localhost, require authentication
2. **Resource Management**: Limit concurrent automations
3. **Error Recovery**: Implement retry logic
4. **Rate Limiting**: Prevent abuse
5. **Browser Management**: Clean up browser instances

---

This is a complete design. Would you like me to implement any specific part?
