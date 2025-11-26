# 🚀 Setup Guide - AI Integration

## Quick Start

### 1. Install OpenAI Package

```bash
cd backend
pip install openai
# or
pip install -r requirements.txt
```

### 2. Add OpenAI API Key

Create or update `backend/.env`:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

**Get your API key**: https://platform.openai.com/api-keys

### 3. Restart Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 4. Test It Out!

1. Open `http://localhost:5173`
2. Sign in with GitHub
3. Go to "Create New Project"
4. Start chatting with the AI!

## 💬 Example Conversation

**You**: "I want to build a recipe sharing app"

**AI**: "That sounds delicious! 🍳 What features are you thinking? User accounts? Recipe ratings? Meal planning?"

**You**: "Yes, all of those plus a shopping list feature"

**AI**: "Perfect! I'll create a comprehensive plan with user authentication, recipe management, ratings, and shopping lists. Ready to generate your project?"

**You**: "Yes!"

**AI**: "✅ Awesome! I've created your project: **Recipe Sharing Platform**. Your project plan includes epics, stories, and tasks. Head over to the Task Board to see everything! 🚀"

## 🎯 What Works Now

### ✅ Real AI Conversations
- Natural language understanding
- Context-aware responses
- Clarifying questions
- Personalized project plans

### ✅ Dynamic Project Plans
- AI generates custom epics
- Relevant user stories
- Specific tasks
- Based on your description

### ✅ Task Board Integration
- See all your projects
- Switch between projects
- View tasks by status
- Complete tasks
- Auto-refresh

## 🔧 Without OpenAI API Key

**Still works!** The system will:
- Use friendly fallback responses
- Generate generic project plans
- Create projects successfully
- Just won't be as "smart"

**Fallback behavior**:
```
You: "I want to build an app"
AI: "👋 Hey! I'd love to help you plan your project. What are you thinking of building?"
You: "A todo app"
AI: "Interesting! Tell me more about what you want to build, or say 'yes' when you're ready to create the project plan."
You: "yes"
AI: Creates generic project with Setup & Core Features epics
```

## 📊 API Usage

### Model Used
- **Model**: gpt-4o-mini
- **Cost**: ~$0.15 per 1M input tokens
- **Speed**: Fast responses (1-2 seconds)

### Typical Conversation Cost
- 3-5 messages: ~$0.001 (less than a penny)
- Project plan generation: ~$0.002
- **Total per project**: ~$0.003 (less than half a cent)

### Rate Limits
- Free tier: 3 RPM (requests per minute)
- Tier 1: 500 RPM
- Tier 2: 5000 RPM

## 🐛 Troubleshooting

### "OpenAI API key not configured"
**Solution**: Add `OPENAI_API_KEY` to `backend/.env`

### "I'm having trouble connecting to my AI brain"
**Possible causes**:
1. Invalid API key
2. No API credits
3. Rate limit exceeded
4. Network issues

**Check**:
```bash
# Test your API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### "Module 'openai' not found"
**Solution**:
```bash
cd backend
pip install openai
```

### AI responses are generic
**Cause**: No API key or API error
**Solution**: Check backend logs for errors

### Tasks not showing
**Cause**: Token mismatch or no projects
**Solution**: 
1. Create a project first
2. Check JWT token in localStorage
3. Check browser console for errors

## 🎨 Customization

### Change AI Model
Edit `backend/app/services/ai_service.py`:
```python
model="gpt-4o-mini"  # Fast and cheap
# or
model="gpt-4o"       # More capable, slower, pricier
# or
model="gpt-3.5-turbo" # Cheapest option
```

### Adjust AI Personality
Edit system prompts in `ai_service.py`:
```python
system_prompt = """You are a friendly project planning assistant.
Keep responses concise and friendly (2-3 sentences max).
Use emojis occasionally for personality."""
```

### Change Temperature
```python
temperature=0.7  # Balanced (default)
# or
temperature=0.3  # More focused and deterministic
# or
temperature=0.9  # More creative and varied
```

## 📈 Monitoring

### Check API Usage
1. Go to https://platform.openai.com/usage
2. View requests and costs
3. Set usage limits

### Backend Logs
```bash
# Watch logs
cd backend
uvicorn main:app --reload --port 8000

# Look for:
# - "OpenAI API error: ..."
# - "Error generating plan: ..."
# - "Error creating project: ..."
```

### Frontend Console
```javascript
// Open browser console (F12)
// Look for:
// - "Error fetching projects: ..."
// - "Error fetching tasks: ..."
// - "Error getting AI response: ..."
```

## 🔐 Security

### API Key Safety
- ✅ Store in `.env` file
- ✅ Add `.env` to `.gitignore`
- ❌ Never commit API keys
- ❌ Never expose in frontend

### Rate Limiting
Consider adding rate limiting:
```python
# In ai_service.py
from datetime import datetime, timedelta

class AIService:
    def __init__(self):
        self.rate_limit = {}  # user_id: last_request_time
    
    async def check_rate_limit(self, user_id: int):
        if user_id in self.rate_limit:
            last_request = self.rate_limit[user_id]
            if datetime.now() - last_request < timedelta(seconds=2):
                raise Exception("Please wait before sending another message")
        self.rate_limit[user_id] = datetime.now()
```

## 🎉 Success Checklist

- [ ] OpenAI package installed
- [ ] API key in `.env` file
- [ ] Backend restarted
- [ ] Frontend running
- [ ] Can create projects via AI
- [ ] Projects show in Task Board
- [ ] Tasks load correctly
- [ ] Can complete tasks
- [ ] Can switch between projects

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

---

**Need Help?**
- Check backend logs
- Check browser console
- Review `AI_INTEGRATION_FIX.md`
- Test with mock data (no API key)

**Status**: ✅ Ready to use!
