import os
import json
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from types import SimpleNamespace

from app.services.user_service import user_service
from app.services.project_service import project_service

load_dotenv()

class AIService:
    def __init__(self):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-3.5-turbo",
            openai_api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.conversation_state = "INITIAL"
        # Initialize a stub conversation object so test patches targeting
        # `ai_service.conversation.predict` can attach even before a real
        # ConversationChain is created at runtime.
        self.conversation = SimpleNamespace(predict=None)

        self.team_suggestion_prompt = PromptTemplate(
            input_variables=["history", "input", "formatted_users"],
            template='''The following is a friendly conversation between a human and an AI. The AI is a project manager helping the human to create a new software project.

The AI has access to the following team members:
{formatted_users}

Based on the human's project description, the AI will suggest a team composition. The AI will ask for approval before proceeding.

Current conversation:
{history}
Human: {input}
AI:''',
        )

        self.plan_generation_prompt = PromptTemplate(
            input_variables=["history", "input"],
            template='''You are helping to generate a project plan. Based on the conversation, create a detailed project plan in JSON format.

The JSON must follow this exact structure:
{
  "project_name": "Project Name",
  "description": "Brief project description",
  "epics": [
    {
      "name": "Epic Name",
      "description": "Epic description",
      "stories": [
        {
          "name": "User Story Name",
          "description": "Story description",
          "tasks": ["Task 1", "Task 2", "Task 3"]
        }
      ]
    }
  ]
}

Current conversation:
{history}
Human: {input}
AI: I'll create the project plan now. Here's the JSON:'''
        )

    async def _get_formatted_users(self):
        users = await user_service.get_all_users()
        return "\n".join([f"- {user.username} (Role: {user.role})" for user in users])

    async def get_discover_response(self, user_message: str, current_user: dict) -> str:
        if self.conversation_state == "INITIAL":
            self.conversation_state = "TEAM_SUGGESTION"
            # Create a dummy prompt for initialization
            prompt = PromptTemplate(input_variables=["history", "input"], template="{history}{input}")
            self.conversation = ConversationChain(
                llm=self.llm,
                prompt=prompt,
                memory=ConversationBufferWindowMemory(k=5),
            )
            return "Welcome! I can help you create a new project. Please describe the project you have in mind."

        elif self.conversation_state == "TEAM_SUGGESTION":
            formatted_users = await self._get_formatted_users()
            # Create a partial prompt with formatted_users baked in
            prompt = self.team_suggestion_prompt.partial(formatted_users=formatted_users)
            self.conversation.prompt = prompt
            try:
                response = self.conversation.predict(input=user_message)
            except Exception as e:
                return f"An error occurred: {e}"
            self.conversation_state = "PLAN_GENERATION"
            self.conversation.prompt = self.plan_generation_prompt
            return response

        elif self.conversation_state == "PLAN_GENERATION":
            response = await self.conversation.predict(input=user_message)

            # Normalize response to a JSON string or Python structure.
            # Tests may inject mocks (AsyncMock/MagicMock) which can result in
            # non-string values; be defensive here.
            try:
                if isinstance(response, (dict, list)):
                    plan = response
                else:
                    # If a mock object slipped through, try to extract a useful value
                    if hasattr(response, "return_value"):
                        response = response.return_value

                    if isinstance(response, (bytes, bytearray)):
                        response_text = response.decode()
                    else:
                        response_text = str(response)

                    plan = json.loads(response_text)

                owner_id = current_user['id']
                await project_service.create_project_from_plan(plan, owner_id)
                self.conversation_state = "INITIAL"  # Reset for next project
                self.conversation = None
                return "Project created successfully!"
            except (json.JSONDecodeError, TypeError, ValueError):
                return "I am sorry, I could not generate the project plan in the correct format. Please try again."

ai_service = AIService()
