import os
from supabase import create_client, Client

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

print("Checking agents table for email data...")
print("=" * 50)

# Query all agents
response = supabase.table('agents').select('*').execute()

if response.data:
    print(f"\nFound {len(response.data)} agent(s) in database:\n")
    for agent in response.data:
        print(f"Agent: {agent.get('name')}")
        print(f"  ID: {agent.get('id')}")
        print(f"  Role: {agent.get('role')}")
        print(f"  Email: {agent.get('email') or '(not set)'}")
        print(f"  Auth User ID: {agent.get('auth_user_id') or '(not set)'}")
        print(f"  Created: {agent.get('created_at')}")
        print("-" * 50)
    
    # Check specifically for sarah@laysongroup.com
    sarah_agents = [a for a in response.data if a.get('email') == 'sarah@laysongroup.com']
    if sarah_agents:
        print(f"\n✓ Found agent with email sarah@laysongroup.com")
    else:
        print(f"\n✗ No agent found with email sarah@laysongroup.com")
        print(f"  The email may not have been saved to the database.")
else:
    print("No agents found in database.")
    print("The agents table exists but is empty.")
