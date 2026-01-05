"""
Test the /channels/available endpoint directly
"""
import asyncio
from app.api.v1.chat import get_available_channels

class MockUser:
    def __init__(self, user_id):
        self.data = {'id': user_id}
    
    def __getitem__(self, key):
        return self.data[key]

async def test_endpoint():
    print("\n=== Testing /channels/available endpoint ===\n")
    
    # Test for User 7 (should see channels from User 1)
    print("Testing for User 7:")
    result = await get_available_channels(current_user=MockUser(7))
    print(f"Channels returned: {len(result)}")
    for channel in result:
        print(f"  - {channel['name']} (is_member: {channel['is_member']})")
    
    print("\nTesting for User 8:")
    result = await get_available_channels(current_user=MockUser(8))
    print(f"Channels returned: {len(result)}")
    for channel in result:
        print(f"  - {channel['name']} (is_member: {channel['is_member']})")
    
    print("\nTesting for User 1:")
    result = await get_available_channels(current_user=MockUser(1))
    print(f"Channels returned: {len(result)}")
    for channel in result:
        print(f"  - {channel['name']} (is_member: {channel['is_member']})")

if __name__ == "__main__":
    asyncio.run(test_endpoint())
