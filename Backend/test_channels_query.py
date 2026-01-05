import asyncio
import sqlite3
from sqlalchemy import select, and_
from app.config.database import SessionLocal
from app.models.message import Channel, ChannelMember
from app.models.organization import OrganizationMember

async def test_channels_for_user(user_id: int):
    """Test the channels query for a specific user"""
    print(f"\n=== Testing channels for User {user_id} ===\n")
    
    async with SessionLocal() as session:
        # Get ALL user's organizations
        org_result = await session.execute(
            select(OrganizationMember.organization_id).where(
                OrganizationMember.user_id == user_id
            )
        )
        org_ids = [row[0] for row in org_result.all()]
        
        print(f"User {user_id} is in organizations: {org_ids}")
        
        if not org_ids:
            print("User is not in any organization!")
            return
        
        # Get all members from ALL user's organizations
        members_result = await session.execute(
            select(OrganizationMember.user_id).where(
                OrganizationMember.organization_id.in_(org_ids)
            )
        )
        org_member_ids = list(set([row[0] for row in members_result.all()]))
        
        print(f"All organization members: {org_member_ids}")
        
        # Get all public channels created by organization members
        result = await session.execute(
            select(Channel).where(
                and_(
                    Channel.channel_type == 'public',
                    Channel.created_by.in_(org_member_ids)
                )
            )
        )
        all_channels = result.scalars().all()
        
        print(f"\nPublic channels created by org members:")
        for ch in all_channels:
            print(f"  - Channel {ch.id}: {ch.name} (created by user {ch.created_by})")
        
        # Get channels user is already a member of
        member_result = await session.execute(
            select(ChannelMember.channel_id).where(
                ChannelMember.user_id == user_id
            )
        )
        member_channel_ids = {row[0] for row in member_result.all()}
        
        print(f"\nUser {user_id} is a member of channels: {member_channel_ids}")
        
        print(f"\nFinal result for user {user_id}:")
        for ch in all_channels:
            is_member = ch.id in member_channel_ids
            print(f"  - Channel {ch.id}: {ch.name} (is_member: {is_member})")

async def main():
    # Test for users 1, 7, and 8 (all in same org)
    await test_channels_for_user(1)
    await test_channels_for_user(7)
    await test_channels_for_user(8)

if __name__ == "__main__":
    asyncio.run(main())
