#!/usr/bin/env python3
"""Quick test for Atlas MCP Server"""

import os
import asyncio
import httpx

ATLAS_API_URL = os.getenv("ATLAS_API_URL", "http://localhost:8000")
ATLAS_TOKEN = os.getenv("ATLAS_TOKEN", "")

async def test():
    print("🧪 Testing Atlas MCP Server Setup\n")
    
    # Test 1: Check if MCP is installed
    print("1️⃣ Checking MCP installation...")
    try:
        import mcp
        print("   ✅ MCP installed")
    except ImportError:
        print("   ❌ MCP not installed. Run: pip install mcp httpx")
        return
    
    # Test 2: Check Atlas backend
    print("\n2️⃣ Checking Atlas backend...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{ATLAS_API_URL}/health", timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Atlas backend is running")
                print(f"   Service: {data.get('service', 'unknown')}")
            else:
                print(f"   ❌ Backend returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Cannot connect to Atlas backend")
        print(f"   Make sure it's running: uvicorn main:app --reload --port 8000")
        return
    
    # Test 3: Check authentication
    print("\n3️⃣ Checking authentication...")
    if not ATLAS_TOKEN:
        print("   ❌ ATLAS_TOKEN not set")
        print("   Get token: curl -X POST http://localhost:8000/api/v1/auth/demo-login")
        return
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ATLAS_API_URL}/users/me",
                headers={"Authorization": f"Bearer {ATLAS_TOKEN}"},
                timeout=5.0
            )
            if response.status_code == 200:
                user = response.json()
                print(f"   ✅ Authenticated as: {user['username']}")
            else:
                print(f"   ❌ Authentication failed: {response.status_code}")
                print("   Token may be expired. Get a new one.")
                return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Test 4: Test API endpoint
    print("\n4️⃣ Testing API endpoint...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ATLAS_API_URL}/api/v1/projects",
                headers={"Authorization": f"Bearer {ATLAS_TOKEN}"},
                timeout=5.0
            )
            if response.status_code == 200:
                projects = response.json()
                print(f"   ✅ API working - Found {len(projects)} projects")
            else:
                print(f"   ❌ API error: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    print("\n" + "="*50)
    print("✅ All tests passed!")
    print("\nNext steps:")
    print("1. Add to Claude Desktop config (see SETUP_MCP.md)")
    print("2. Restart Claude Desktop")
    print("3. Ask Claude: 'Show me all my Atlas projects'")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(test())
