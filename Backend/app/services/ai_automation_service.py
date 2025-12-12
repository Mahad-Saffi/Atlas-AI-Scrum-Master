from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from openai import AsyncOpenAI
import json
import asyncio
import base64
from typing import Dict, List, Optional
from datetime import datetime
import os
import re

class AIAutomationService:
    def __init__(self):
        self.driver: Optional[webdriver.Chrome] = None
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.app_map = self._load_app_map()
        self.context_history = []
        self.current_task = None
        self.is_running = False
        
    def _load_app_map(self) -> Dict:
        """Load application map from JSON file"""
        map_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'app_map.json')
        with open(map_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    async def start_automation(self, task: str, websocket):
        """Main automation loop"""
        self.is_running = True
        self.current_task = task
        self.context_history = []
        
        try:
            # Initialize browser
            await self._send_update(websocket, "🚀 Initializing browser...", "info")
            self._init_browser()
            await asyncio.sleep(2)
            await self._send_screenshot(websocket)
            
            # Check if we need to login
            current_page = self._detect_current_page()
            if current_page == "login":
                await self._send_update(websocket, "🔐 Logging in with demo account...", "info")
                await self._auto_login(websocket)
                await asyncio.sleep(2)
                await self._send_screenshot(websocket)
            
            # Parse task with GPT
            await self._send_update(websocket, f"🤔 Understanding task: {task}", "info")
            plan = await self._create_task_plan(task)
            
            await self._send_update(websocket, f"📋 Created plan with {len(plan['steps'])} steps", "info")
            
            # Execute plan
            for idx, step in enumerate(plan['steps'], 1):
                if not self.is_running:
                    break
                    
                await self._send_update(
                    websocket, 
                    f"⚙️ Step {idx}/{len(plan['steps'])}: {step.get('description', 'Executing step')}", 
                    "info"
                )
                
                try:
                    await self._execute_step(step, websocket)
                except Exception as step_error:
                    # Try to recover from error
                    await self._send_update(websocket, f"⚠️ Step failed: {str(step_error)}", "warning")
                    await self._send_update(websocket, "🔄 Attempting to recover...", "info")
                    
                    recovered = await self._attempt_recovery(step, websocket)
                    if not recovered:
                        raise step_error
                
                await asyncio.sleep(0.5)
                await self._send_screenshot(websocket)
            
            await self._send_update(websocket, "✅ Task completed successfully!", "success")
            
        except Exception as e:
            await self._send_update(websocket, f"❌ Error: {str(e)}", "error")
            print(f"Automation error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            await asyncio.sleep(2)
            self._cleanup()
            self.is_running = False
    
    def _init_browser(self):
        """Initialize Selenium WebDriver"""
        options = Options()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        # Don't use headless mode so we can see what's happening
        # options.add_argument('--headless')
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.get('http://localhost:5173')
    
    async def _auto_login(self, websocket):
        """Automatically login with demo credentials"""
        try:
            # Click Try Demo button
            login_step = {
                "page": "login",
                "action": "login",
                "params": {},
                "description": "Login with demo account"
            }
            
            await self._execute_step(login_step, websocket)
            await self._send_update(websocket, "✅ Successfully logged in!", "success")
            
        except Exception as e:
            await self._send_update(websocket, f"❌ Login failed: {str(e)}", "error")
            raise
    
    async def _create_task_plan(self, task: str) -> Dict:
        """Use GPT to create execution plan"""
        
        # Add context about current state
        current_url = self.driver.current_url if self.driver else "http://localhost:5173"
        current_page = self._detect_current_page()
        
        prompt = f"""You are an AI automation assistant for the Atlas project management application.

Current State:
- Current URL: {current_url}
- Current Page: {current_page}
- User is logged in: {current_page != 'login'}

User Task: "{task}"

Application Map (available pages and actions):
{json.dumps(self.app_map, indent=2)}

Create a step-by-step plan to accomplish the user's task. 
Each step should reference a page and action from the application map.

CRITICAL: Return ONLY valid JSON. NO comments, NO explanations, NO markdown.

Return this exact structure:
{{
    "steps": [
        {{
            "page": "page_name_from_map",
            "action": "action_name_from_map",
            "params": {{"param_name": "value"}},
            "description": "Human-readable description of what this step does"
        }}
    ]
}}

Important:
- Use ONLY pages and actions that exist in the application map
- If user needs to navigate between pages, include navigation steps
- Extract parameters from the user's task (e.g., project name, email, etc.)
- Be specific and sequential
- NO COMMENTS in JSON (no // or /* */)
- If a parameter is not specified, use a reasonable default value
- For passwords, use "defaultPassword123" if not specified
"""
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful automation assistant. Return ONLY valid JSON without any comments or explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        
        # Remove any comments from JSON (just in case)
        content = re.sub(r'//.*?\n', '\n', content)  # Remove single-line comments
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)  # Remove multi-line comments
        
        try:
            plan = json.loads(content)
            return plan
        except json.JSONDecodeError as e:
            print(f"Failed to parse GPT response: {content}")
            raise Exception(f"Failed to create plan: {str(e)}")
    
    async def _execute_step(self, step: Dict, websocket):
        """Execute a single step"""
        page = step['page']
        action = step['action']
        params = step.get('params', {})
        
        # Navigate to page if needed
        current_page = self._detect_current_page()
        if current_page != page:
            await self._navigate_to_page(page, websocket)
            await asyncio.sleep(1)
        
        # Execute action
        if page not in self.app_map['pages']:
            raise Exception(f"Page '{page}' not found in application map")
        
        if action not in self.app_map['pages'][page]['actions']:
            raise Exception(f"Action '{action}' not found for page '{page}'")
        
        action_def = self.app_map['pages'][page]['actions'][action]
        
        for action_step in action_def['steps']:
            await self._execute_action_step(action_step, params, websocket)
            await asyncio.sleep(0.3)
    
    async def _execute_action_step(self, action_step: Dict, params: Dict, websocket):
        """Execute individual action step"""
        action_type = action_step['type']
        description = action_step.get('description', '')
        
        if description:
            await self._send_update(websocket, f"  → {description}", "action")
        
        try:
            if action_type == 'click':
                selector = action_step['selector']
                element = self._find_element(selector)
                element.click()
                
            elif action_type == 'input':
                selector = action_step['selector']
                param_name = action_step['param']
                value = params.get(param_name, '')
                
                element = self._find_element(selector)
                element.clear()
                element.send_keys(value)
                
            elif action_type == 'select':
                selector = action_step['selector']
                param_name = action_step['param']
                value = params.get(param_name, '')
                
                from selenium.webdriver.support.ui import Select
                element = self._find_element(selector)
                select = Select(element)
                select.select_by_visible_text(value)
                
            elif action_type == 'wait':
                seconds = action_step.get('seconds', 1)
                await asyncio.sleep(seconds)
                
            elif action_type == 'wait_for_text':
                text = action_step['text']
                timeout = action_step.get('timeout', 10)
                WebDriverWait(self.driver, timeout).until(
                    EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{text}')]"))
                )
                
            elif action_type == 'find_and_click':
                find_text = action_step['find_text']
                # Replace placeholders with actual values
                for key, value in params.items():
                    find_text = find_text.replace(f"{{{key}}}", value)
                
                # Find element containing text
                xpath = f"//*[contains(text(), '{find_text}')]"
                element = self.driver.find_element(By.XPATH, xpath)
                
                # Find button within or near that element
                then_click = action_step['then_click']
                parent = element.find_element(By.XPATH, "..")
                button = parent.find_element(By.CSS_SELECTOR, then_click)
                button.click()
                
        except Exception as e:
            await self._send_update(websocket, f"⚠️ Action failed: {str(e)}", "warning")
            raise
    
    def _find_element(self, selector: str, timeout: int = 10):
        """Find element with multiple selector strategies"""
        # Try CSS selector first
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
            )
        except:
            pass
        
        # Try XPath if selector contains :contains
        if ':contains' in selector:
            # Convert jQuery-style :contains to XPath
            match = re.search(r'([^:]+):contains\([\'"]([^\'"]+)[\'"]\)', selector)
            if match:
                tag = match.group(1) or '*'
                text = match.group(2)
                xpath = f"//{tag}[contains(text(), '{text}')]"
                return WebDriverWait(self.driver, timeout).until(
                    EC.presence_of_element_located((By.XPATH, xpath))
                )
        
        # Try as XPath
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.XPATH, selector))
            )
        except:
            raise NoSuchElementException(f"Could not find element: {selector}")
    
    def _detect_current_page(self) -> str:
        """Detect which page we're currently on"""
        if not self.driver:
            return "unknown"
        
        current_url = self.driver.current_url
        page_title = self.driver.title
        
        # Special case: root URL is login page if not authenticated
        if current_url == "http://localhost:5173/" or current_url == "http://localhost:5173":
            # Check if we see login elements (Try Demo button)
            try:
                self.driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[1]/div[2]/form/button[1]")
                return "login"
            except:
                # If no login button, we're on dashboard
                return "dashboard"
        
        for page_name, page_def in self.app_map['pages'].items():
            # Check URL pattern
            url_pattern = page_def['identifiers'].get('url_pattern', '')
            if url_pattern and re.search(url_pattern, current_url):
                return page_name
            
            # Check if URL contains page URL
            if page_def['url'] in current_url:
                return page_name
        
        return "unknown"
    
    async def _navigate_to_page(self, target_page: str, websocket):
        """Navigate to a specific page"""
        current_page = self._detect_current_page()
        
        await self._send_update(websocket, f"🧭 Navigating from {current_page} to {target_page}", "info")
        
        # Direct navigation
        if target_page in self.app_map['pages']:
            target_url = self.app_map['pages'][target_page]['url']
            self.driver.get(target_url)
            await asyncio.sleep(1)
    
    async def _attempt_recovery(self, failed_step: Dict, websocket) -> bool:
        """Attempt to recover from a failed step by analyzing current state"""
        try:
            # Get current state
            current_url = self.driver.current_url
            current_page = self._detect_current_page()
            target_page = failed_step.get('page', 'unknown')
            
            await self._send_update(
                websocket, 
                f"📍 Current location: {current_page} (URL: {current_url})", 
                "info"
            )
            await self._send_update(
                websocket, 
                f"🎯 Target location: {target_page}", 
                "info"
            )
            
            # If we're on login page, login first
            if current_page == "login":
                await self._send_update(websocket, "🔐 Detected login page, logging in...", "info")
                await self._auto_login(websocket)
                await asyncio.sleep(2)
                
                # Try the step again
                await self._send_update(websocket, "🔄 Retrying step after login...", "info")
                await self._execute_step(failed_step, websocket)
                return True
            
            # If we're not on the right page, navigate there
            if current_page != target_page and target_page != 'unknown':
                await self._send_update(
                    websocket, 
                    f"🧭 Wrong page detected, navigating to {target_page}...", 
                    "info"
                )
                await self._navigate_to_page(target_page, websocket)
                await asyncio.sleep(2)
                
                # Try the step again
                await self._send_update(websocket, "🔄 Retrying step after navigation...", "info")
                await self._execute_step(failed_step, websocket)
                return True
            
            # If element not found, use GPT to find alternative
            await self._send_update(
                websocket, 
                "🤖 Asking AI for alternative approach...", 
                "info"
            )
            
            # Get page source for context
            page_source = self.driver.page_source[:5000]  # First 5000 chars
            
            prompt = f"""The automation failed on this step:
Page: {target_page}
Action: {failed_step.get('action', 'unknown')}
Description: {failed_step.get('description', 'N/A')}

Current URL: {current_url}
Current Page: {current_page}

Page HTML (first 5000 chars):
{page_source}

Suggest an alternative approach or confirm if the task is impossible from current state.
Return JSON with: {{"possible": true/false, "suggestion": "what to do next"}}
"""
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful automation assistant. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            content = response.choices[0].message.content.strip()
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            suggestion = json.loads(content)
            
            if suggestion.get('possible', False):
                await self._send_update(
                    websocket, 
                    f"💡 AI suggestion: {suggestion.get('suggestion', 'Try alternative approach')}", 
                    "info"
                )
                # For now, just log the suggestion
                # In future, could implement dynamic action execution
                return False
            else:
                await self._send_update(
                    websocket, 
                    f"❌ AI says: {suggestion.get('suggestion', 'Cannot proceed from current state')}", 
                    "error"
                )
                return False
                
        except Exception as recovery_error:
            await self._send_update(
                websocket, 
                f"❌ Recovery failed: {str(recovery_error)}", 
                "error"
            )
            return False
    
    async def _send_screenshot(self, websocket):
        """Send current browser screenshot"""
        if not self.driver:
            return
        
        try:
            screenshot = self.driver.get_screenshot_as_base64()
            await websocket.send_json({
                "type": "screenshot",
                "data": screenshot,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            print(f"Screenshot error: {e}")
    
    async def _send_update(self, websocket, message: str, level: str):
        """Send status update"""
        try:
            await websocket.send_json({
                "type": "update",
                "message": message,
                "level": level,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            print(f"WebSocket send error: {e}")
    
    def _cleanup(self):
        """Clean up resources"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None
    
    def stop(self):
        """Stop automation"""
        self.is_running = False
        self._cleanup()

# Global instance
automation_service = AIAutomationService()
