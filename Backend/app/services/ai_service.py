import os
import json
from dotenv import load_dotenv
from openai import AsyncOpenAI

from app.services.user_service import user_service
from app.services.project_service import project_service

load_dotenv()

class AIService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
        # Store conversation state per user
        self.user_conversations = {}

    def _get_user_state(self, user_id: int):
        """Get or create conversation state for a user"""
        if user_id not in self.user_conversations:
            self.user_conversations[user_id] = {
                "state": "INITIAL",
                "history": [],
                "project_description": ""
            }
        return self.user_conversations[user_id]

    def _reset_user_state(self, user_id: int):
        """Reset conversation state for a user"""
        if user_id in self.user_conversations:
            del self.user_conversations[user_id]

    async def _get_formatted_users(self):
        users = await user_service.get_all_users()
        return "\n".join([f"- {user.username} (Role: {user.role})" for user in users])

    async def _call_openai(self, messages: list) -> str:
        """Call OpenAI API with conversation history"""
        if not self.client:
            return "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file."
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return f"I'm having trouble connecting to my AI brain right now. Error: {str(e)}"

    async def _generate_project_plan(self, project_description: str) -> dict:
        """Use OpenAI to generate a structured project plan"""
        if not self.client:
            # Fallback to mock plan if no API key
            return self._get_mock_plan(project_description)
        
        system_prompt = """You are a project planning assistant. Generate a detailed project plan in JSON format.
The plan should include:
- project_name: A concise name for the project
- description: A brief description
- epics: An array of 2-3 major epics, each with:
  - name: Epic name
  - description: Epic description
  - stories: An array of 2-3 user stories, each with:
    - name: Story name
    - description: Story description
    - tasks: An array of 3-5 specific tasks (strings)

Return ONLY valid JSON, no markdown formatting."""

        user_prompt = f"Create a project plan for: {project_description}"

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            plan = json.loads(content)
            return plan
        except Exception as e:
            print(f"Error generating plan: {e}")
            return self._get_mock_plan(project_description)

    def _get_mock_plan(self, project_description: str) -> dict:
        """Fallback mock plan when OpenAI is not available"""
        return {
            "project_name": "New Project",
            "description": project_description,
            "epics": [
                {
                    "name": "Setup & Foundation",
                    "description": "Initial project setup",
                    "stories": [
                        {
                            "name": "Project Initialization",
                            "description": "Set up project structure",
                            "tasks": [
                                "Create repository",
                                "Set up development environment",
                                "Configure CI/CD"
                            ]
                        }
                    ]
                },
                {
                    "name": "Core Features",
                    "description": "Main functionality",
                    "stories": [
                        {
                            "name": "Feature Implementation",
                            "description": "Implement core features",
                            "tasks": [
                                "Design architecture",
                                "Implement backend",
                                "Implement frontend",
                                "Write tests"
                            ]
                        }
                    ]
                }
            ]
        }

    async def get_discover_response(self, user_message: str, current_user: dict) -> str:
        """
        Conversational AI for project discovery using OpenAI.
        """
        user_id = current_user['id']
        conv_state = self._get_user_state(user_id)
        
        # Add user message to history
        conv_state["history"].append({"role": "user", "content": user_message})
        
        if conv_state["state"] == "INITIAL":
            # First interaction - ask about the project
            if self.client:
                # Use OpenAI for natural conversation
                system_prompt = """You are a friendly project planning assistant. 
Your job is to understand what project the user wants to build.
Ask clarifying questions about their project idea.
Keep responses concise and friendly (2-3 sentences max).
Use emojis occasionally for personality."""
                
                messages = [{"role": "system", "content": system_prompt}] + conv_state["history"]
                response = await self._call_openai(messages)
            else:
                response = "👋 Hey! I'd love to help you plan your project. What are you thinking of building?"
            
            conv_state["history"].append({"role": "assistant", "content": response})
            conv_state["state"] = "GATHERING_INFO"
            conv_state["project_description"] = user_message
            return response

        elif conv_state["state"] == "GATHERING_INFO":
            # Continue gathering information
            conv_state["project_description"] += " " + user_message
            
            # Check if user wants to proceed
            proceed_keywords = ["yes", "yeah", "sure", "ok", "okay", "proceed", "continue", "go ahead", "create", "generate"]
            if any(keyword in user_message.lower() for keyword in proceed_keywords):
                conv_state["state"] = "TEAM_SUGGESTION"
                formatted_users = await self._get_formatted_users()
                response = f"Great! 🎉 Based on your project, I suggest this team:\n\n{formatted_users}\n\nSound good? I'll generate a detailed project plan for you!"
                conv_state["history"].append({"role": "assistant", "content": response})
                return response
            
            # Continue conversation
            if self.client:
                system_prompt = """You are a friendly project planning assistant.
Continue the conversation to understand the project better.
After 2-3 exchanges, suggest moving forward with: "Ready to create your project plan?"
Keep responses concise (2-3 sentences max)."""
                
                messages = [{"role": "system", "content": system_prompt}] + conv_state["history"]
                response = await self._call_openai(messages)
            else:
                response = "Interesting! Tell me more about what you want to build, or say 'yes' when you're ready to create the project plan."
            
            conv_state["history"].append({"role": "assistant", "content": response})
            return response

        elif conv_state["state"] == "TEAM_SUGGESTION":
            # User confirmed team, generate plan
            try:
                plan = await self._generate_project_plan(conv_state["project_description"])
                owner_id = current_user['id']
                await project_service.create_project_from_plan(plan, owner_id)
                
                # Reset state for next project
                self._reset_user_state(user_id)
                
                return f"✅ Awesome! I've created your project: **{plan['project_name']}**\n\nYour project plan includes epics, stories, and tasks. Head over to the Task Board to see everything! 🚀"
                
            except Exception as e:
                print(f"Error creating project: {e}")
                return f"😅 Oops! I hit a snag creating your project: {str(e)}\n\nWant to try again?"

        return "I'm not sure what to do next. Let's start over - what project do you want to build?"

ai_service = AIService()
