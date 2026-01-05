"""
Test risk detection functionality
"""
import asyncio
from app.services.risk_service import risk_service

async def test_risk_detection():
    print("\n=== Testing Risk Detection ===\n")
    
    try:
        result = await risk_service.detect_delays_and_update_risks()
        print("Risk Detection Results:")
        print(f"  Tasks scanned: {result['tasks_scanned']}")
        print(f"  High risk: {result['high_risk']}")
        print(f"  Medium risk: {result['medium_risk']}")
        print(f"  Notifications sent: {result['notifications_sent']}")
        print("\n✅ Risk detection completed successfully!")
    except Exception as e:
        print(f"\n❌ Error during risk detection: {e}")
        import traceback
        traceback.print_exc()

async def test_project_risks():
    print("\n=== Testing Project Risk Summary ===\n")
    
    # Test with Calculator project
    project_id = "05fa7cd8-b200-4078-b65a-7eb919127072"
    
    try:
        result = await risk_service.get_project_risks(project_id)
        print(f"Project Risk Summary for {project_id}:")
        print(f"  Total active tasks: {result['total_active_tasks']}")
        print(f"  High risk: {result['high_risk_count']}")
        print(f"  Medium risk: {result['medium_risk_count']}")
        print(f"  Low risk: {result['low_risk_count']}")
        
        if result['high_risk_tasks']:
            print(f"\n  High Risk Tasks:")
            for task in result['high_risk_tasks']:
                print(f"    - {task['title']} (Progress: {task['progress']}%)")
        
        print("\n✅ Project risk summary completed successfully!")
    except Exception as e:
        print(f"\n❌ Error getting project risks: {e}")
        import traceback
        traceback.print_exc()

async def main():
    await test_risk_detection()
    await test_project_risks()

if __name__ == "__main__":
    asyncio.run(main())
