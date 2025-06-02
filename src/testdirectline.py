import requests
import time

# === CONFIGURATION ===
DIRECT_LINE_SECRET = '84pBUEFAqFLx0MKpELPqCyCcGNufWzr1W9mlX4g7EeO9PNaQOeJEJQQJ99BEACL93NaAArohAAABAZBS22tg.C4LWZtT98J3orvkLZjeCzn84zB9SIGzhGGq3NxLWuajmvhbwy9kDJQQJ99BFACHYHv6AArohAAABAZBS3Yn5'  # Replace with your actual secret
USER_ID = 'user1'
MESSAGE_TEXT = 'check planning application 10001'

# === HEADERS ===
headers_secret = {
    'Authorization': f'Bearer {DIRECT_LINE_SECRET}',
    'Content-Type': 'application/json'
}

# === Step 1: Generate Direct Line Token ===
token_url = 'https://directline.botframework.com/v3/directline/tokens/generate'
token_res = requests.post(token_url, headers=headers_secret)
token_res.raise_for_status()
token = token_res.json()['token']
print("🔐 Token generated.")

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
send_res = requests.post(message_url, headers=headers_token, json=message_payload)
send_res.raise_for_status()
print(f"📨 Sent message: '{MESSAGE_TEXT}'")

# === Step 4: Poll for a Response ===
time.sleep(2)  # Give the bot a moment to reply
activities_url = f"https://directline.botframework.com/v3/directline/conversations/{conversation_id}/activities"
activities_res = requests.get(activities_url, headers=headers_token)
activities_res.raise_for_status()

# === Step 5: Print Bot Messages ===
activities = activities_res.json()['activities']
bot_messages = [a['text'] for a in activities if a['from']['id'] != USER_ID and a['type'] == 'message']

print("\n🤖 Bot response(s):\n")
for msg in bot_messages:
    print(msg)