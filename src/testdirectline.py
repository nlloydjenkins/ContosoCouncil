import requests
import time

"""
Azure Bot Framework Direct Line Test with Azure AD Authentication

SETUP INSTRUCTIONS:
1. Replace the Azure App Registration values below with your actual values
2. Ensure your Azure App Registration has the following:
   - API permissions: Bot Framework (https://api.botframework.com/.default)
   - Client secret generated and stored securely
   - Proper redirect URIs configured if needed

3. Update the DIRECT_LINE_SECRET with your bot's Direct Line secret

USAGE:
- Run as-is to test Direct Line communication only
- Uncomment Azure AD token acquisition in main execution to test authentication
- Use the azure_ad_token for additional Bot Framework API calls
"""

# === AZURE APP REGISTRATION CONFIGURATION ===
# Replace these with your actual Azure App Registration details
TENANT_ID = 'de6b5354-c00a-4c06-888c-81936c42d6f2'  # Azure AD Tenant ID
CLIENT_ID = 'a607a4c4-5bf6-4c90-b30a-b495cd30e97d'  # Application (client) ID from App Registration
CLIENT_SECRET = ''  # Client secret from App Registration

# === BOT CONFIGURATION ===
DIRECT_LINE_SECRET = '84pBUEFAqFLx0MKpELPqCyCcGNufWzr1W9mlX4g7EeO9PNaQOeJEJQQJ99BEACL93NaAArohAAABAZBS22tg.C4LWZtT98J3orvkLZjeCzn84zB9SIGzhGGq3NxLWuajmvhbwy9kDJQQJ99BFACHYHv6AArohAAABAZBS3Yn5'  # Replace with your actual secret
USER_ID = 'user1'
MESSAGE_TEXT = 'check planning application 10001'

# === AZURE AD TOKEN ACQUISITION ===
def get_azure_ad_token():
    """
    Get an access token using Azure AD client credentials flow
    """
    token_url = f'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token'
    
    token_data = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'scope': 'https://api.botframework.com/.default'  # Bot Framework scope
    }
    
    token_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    try:
        response = requests.post(token_url, data=token_data, headers=token_headers)
        response.raise_for_status()
        
        token_info = response.json()
        access_token = token_info['access_token']
        print("🔐 Azure AD access token acquired successfully")
        return access_token
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to acquire Azure AD token: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return None

def make_authenticated_bot_api_call(azure_ad_token, endpoint, method='GET', data=None):
    """
    Make an authenticated API call to Bot Framework using Azure AD token
    """
    headers = {
        'Authorization': f'Bearer {azure_ad_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        if method.upper() == 'GET':
            response = requests.get(endpoint, headers=headers)
        elif method.upper() == 'POST':
            response = requests.post(endpoint, headers=headers, json=data)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
            
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Authenticated API call failed: {e}")
        return None

# === MAIN EXECUTION ===
print("🚀 Starting Bot Framework Direct Line Test with Azure AD Authentication")

# === Step 0: Optional - Get Azure AD Token ===
# Uncomment the following lines if you want to use Azure AD authentication
# azure_ad_token = get_azure_ad_token()
# if azure_ad_token:
#     print("✅ Azure AD token available for additional API calls")
# else:
#     print("⚠️ Azure AD token acquisition failed, continuing with Direct Line only")

# === Step 1: Generate Direct Line Token ===
headers_secret = {
    'Authorization': f'Bearer {DIRECT_LINE_SECRET}',
    'Content-Type': 'application/json'
}

token_url = 'https://directline.botframework.com/v3/directline/tokens/generate'
token_res = requests.post(token_url, headers=headers_secret)
token_res.raise_for_status()
token = token_res.json()['token']
print("🔐 Direct Line token generated.")

# === Step 2: Start a Conversation ===
headers_token = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}
conversation_url = 'https://directline.botframework.com/v3/directline/conversations'
conv_res = requests.post(conversation_url, headers=headers_token)
conv_res.raise_for_status()
conversation_id = conv_res.json()['conversationId']
print(f"💬 Conversation started: {conversation_id}")

# === Step 3: Send a Message ===
message_url = f"https://directline.botframework.com/v3/directline/conversations/{conversation_id}/activities"
message_payload = {
    "type": "message",
    "from": { "id": USER_ID },
    "text": MESSAGE_TEXT
}

print(f"📤 Sending message to: {message_url}")
print(f"📝 Message payload: {message_payload}")

send_res = requests.post(message_url, headers=headers_token, json=message_payload)
send_res.raise_for_status()

# Check the response from sending the message
send_response_data = send_res.json()
print(f"📨 Message sent successfully. Response: {send_response_data}")
print(f"✅ Sent message: '{MESSAGE_TEXT}'")

# === Step 4: Poll for a Response ===
print("⏳ Waiting for bot response...")
time.sleep(8)  # Give the bot more time to reply initially (web UI takes ~20 seconds)

# Try multiple polling attempts with longer waits
max_attempts = 40
attempt = 0
bot_messages = []

while attempt < max_attempts and not bot_messages:
    attempt += 1
    print(f"🔍 Polling attempt {attempt}/{max_attempts}")
    
    activities_url = f"https://directline.botframework.com/v3/directline/conversations/{conversation_id}/activities"
    activities_res = requests.get(activities_url, headers=headers_token)
    activities_res.raise_for_status()
    
    activities_data = activities_res.json()
    activities = activities_data.get('activities', [])
    
    print(f"📊 Total activities received: {len(activities)}")
      # Debug: Print all activities
    for i, activity in enumerate(activities):
        from_info = activity.get('from', {})
        from_id = from_info.get('id')
        from_name = from_info.get('name', 'Unknown')
        activity_text = activity.get('text', 'N/A')
        
        print(f"  Activity {i}: Type={activity.get('type')}, From={from_id} ({from_name}), Text={activity_text}")
          # If this is an error message, provide more details
        if 'error' in activity_text.lower() or 'authenticationnotconfigured' in activity_text.lower():
            print(f"    🔍 Bot ID in error: {from_id}")
            print(f"    🔍 Your Client ID: {CLIENT_ID}")
            print(f"    🔍 Match: {from_id == CLIENT_ID}")
    
    # Filter for bot messages (exclude our own messages)
    bot_messages = []
    for activity in activities:
        if (activity.get('type') == 'message' and 
            activity.get('from', {}).get('id') != USER_ID and
            activity.get('text')):
            bot_messages.append(activity.get('text'))
    
    if not bot_messages and attempt < max_attempts:
        wait_time = 4 if attempt <= 6 else 6  # Wait longer after first 6 attempts
        print(f"⏳ No bot response yet, waiting {wait_time} seconds before next attempt...")
        time.sleep(wait_time)

# === Step 5: Print Bot Messages ===
if bot_messages:
    print(f"\n🤖 Bot response(s) ({len(bot_messages)} found):\n")
    for i, msg in enumerate(bot_messages, 1):
        print(f"{i}. {msg}")
else:
    print("\n❌ No bot responses received.")
    print("💡 Troubleshooting tips:")
    print("   - Check if your bot is running and accessible")
    print("   - Verify the Direct Line secret is correct")
    print("   - Ensure your bot is configured to respond to messages")
    print("   - Check the bot's logs for any errors")

# === OPTIONAL: Example Azure AD Token Usage ===
# Uncomment the following section to demonstrate Azure AD token usage
"""
# Example: Get bot information using Azure AD token (requires appropriate permissions)
if 'azure_ad_token' in locals() and azure_ad_token:
    print("\n🔐 Making authenticated Bot Framework API call...")
    
    # Example endpoint - replace with actual Bot Framework API endpoint you need
    bot_info_endpoint = f"https://api.botframework.com/v3/bots/{CLIENT_ID}"
    
    bot_info = make_authenticated_bot_api_call(
        azure_ad_token, 
        bot_info_endpoint, 
        method='GET'
    )
    
    if bot_info:
        print("✅ Bot information retrieved successfully")
        print(f"Bot info: {bot_info}")
    else:
        print("❌ Failed to retrieve bot information")
"""

print("\n✅ Direct Line test completed!")