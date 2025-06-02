import { AuthService } from './authService';

export interface DirectLineMessage {
  id?: string;
  type: string;
  from: {
    id: string;
    name?: string;
  };
  text?: string;
  speak?: string;
  attachments?: any[];
  suggestedActions?: any;
  timestamp?: string;
  channelData?: any;
}

export interface DirectLineResponse {
  activities: DirectLineMessage[];
  watermark?: string;
}

export interface ConversationInfo {
  conversationId: string;
  token: string;
}

const DIRECT_LINE_SECRET = import.meta.env.VITE_DIRECTLINE_SECRET;
const DIRECT_LINE_BASE_URL = 'https://directline.botframework.com/v3/directline';
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Helper function to get trusted origins for current environment
const getTrustedOrigins = (): string[] => {
  return [
    'https://web.powerva.microsoft.com',
    BASE_URL, // Current environment URL (localhost:3000 or production)
    'http://localhost:3000', // Always include dev URL for convenience
    'https://thankful-sea-03a16bc03.6.azurestaticapps.net' // Always include production URL
  ];
};

// Azure AD Configuration - using environment variables for security
const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AZURE_CLIENT_SECRET;

export class DirectLineService {
  private static async getAzureADToken(): Promise<string> {
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    
    const tokenData = new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'scope': 'https://api.botframework.com/.default'
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenData
    });

    if (!response.ok) {
      throw new Error(`Failed to acquire Azure AD token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DirectLine: Azure AD access token acquired successfully');
    return data.access_token;
  }
  private static async generateToken(): Promise<string> {
    const response = await fetch(`${DIRECT_LINE_BASE_URL}/tokens/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECT_LINE_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        User: {
          Id: 'user1',
          Name: 'Planning Application User'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  private static async startConversation(token: string): Promise<string> {
    const response = await fetch(`${DIRECT_LINE_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to start conversation: ${response.statusText}`);
    }

    const data = await response.json();
    return data.conversationId;
  }  private static async sendMessageToBot(
    conversationId: string, 
    token: string, 
    message: string, 
    userId: string = 'user1',
    azureAdToken?: string
  ): Promise<void> {
    // Try to emulate the iframe's authentication approach
    const messagePayload = {
      type: 'message',
      from: { 
        id: userId,
        name: 'Planning Application User',
        role: 'user'
      },
      text: message,
      locale: 'en-US',
      timestamp: new Date().toISOString(),
      channelData: {
        clientTimestamp: new Date().toISOString(),
        // Include authentication context similar to Power Virtual Agents
        authenticationContext: {
          userId: userId,
          userName: 'Planning Application User',
          isAuthenticated: true
        },
        // Include Azure AD token if available
        ...(azureAdToken && { azureAdToken })
      }
    };

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ContosoCouncil/1.0'
    };

    // Include Azure AD token in headers as well
    if (azureAdToken) {
      headers['X-Azure-AD-Token'] = azureAdToken;
      headers['X-Bot-Framework-Auth'] = azureAdToken;
    }

    const response = await fetch(`${DIRECT_LINE_BASE_URL}/conversations/${conversationId}/activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Send message error response:', errorText);
      throw new Error(`Failed to send message: ${response.statusText} - ${errorText}`);
    }
  }  private static async pollForResponse(
    conversationId: string, 
    token: string, 
    userId: string = 'user1',
    maxAttempts: number = 40
  ): Promise<{messages: string[], hasPermissionRequest: boolean, suggestedActions: any[]}> {
    let attempt = 0;
    let botMessages: string[] = [];
    let hasPermissionRequest = false;
    let suggestedActions: any[] = [];

    // Initial wait before starting to poll
    await new Promise(resolve => setTimeout(resolve, 8000));

    while (attempt < maxAttempts && botMessages.length === 0) {
      attempt++;
      
      try {
        const response = await fetch(`${DIRECT_LINE_BASE_URL}/conversations/${conversationId}/activities`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to get activities: ${response.statusText}`);
        }

        const data: DirectLineResponse = await response.json();
        const activities = data.activities || [];

        console.log(`Polling attempt ${attempt}/${maxAttempts}. Total activities: ${activities.length}`);

        // Log all activities for debugging
        activities.forEach((activity, index) => {
          console.log(`Activity ${index}:`, {
            type: activity.type,
            from: activity.from?.id,
            fromName: activity.from?.name,
            text: activity.text || 'N/A',
            speak: activity.speak || 'N/A',
            attachments: activity.attachments?.length || 0,
            suggestedActions: activity.suggestedActions ? 'Yes' : 'No'
          });
        });

        // Filter for bot messages (exclude our own messages)
        const botActivities = activities.filter(activity => 
          activity.type === 'message' && 
          activity.from?.id !== userId
        );

        for (const activity of botActivities) {
          // Check for permission requests in text
          const text = activity.text || activity.speak || '';
          if (text.toLowerCase().includes('additional permissions') || 
              text.toLowerCase().includes('connect') ||
              text.toLowerCase().includes('sign in')) {
            hasPermissionRequest = true;
          }

          // Collect suggested actions
          if (activity.suggestedActions && activity.suggestedActions.actions) {
            suggestedActions.push(...activity.suggestedActions.actions);
          }

          // Extract text content
          let messageText = null;
          if (activity.text && activity.text.trim() !== '') {
            messageText = activity.text;
          } else if (activity.speak && activity.speak.trim() !== '') {
            messageText = activity.speak;
          } else if (activity.attachments && activity.attachments.length > 0) {
            // Check attachments for text content
            for (const attachment of activity.attachments) {
              if (attachment.content && attachment.content.text) {
                messageText = attachment.content.text;
                break;
              }
              if (attachment.content && attachment.content.body) {
                // Adaptive Card body
                const textBlocks = attachment.content.body?.filter((block: any) => 
                  block.type === 'TextBlock' && block.text
                );
                if (textBlocks && textBlocks.length > 0) {
                  messageText = textBlocks.map((block: any) => block.text).join('\n');
                  break;
                }
              }
            }
          }

          if (messageText) {
            botMessages.push(messageText);
          }
        }

        if (botMessages.length === 0 && attempt < maxAttempts) {
          const waitTime = attempt <= 6 ? 4000 : 6000;
          console.log(`No bot response yet, waiting ${waitTime}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      } catch (error) {
        console.error(`Polling attempt ${attempt} failed:`, error);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }
    }

    console.log(`Polling completed. Found ${botMessages.length} bot messages:`, botMessages);
    console.log('Permission request detected:', hasPermissionRequest);
    console.log('Suggested actions:', suggestedActions);
    return { messages: botMessages, hasPermissionRequest, suggestedActions };
  }  public static async sendMessageAndGetResponse(message: string): Promise<{messages: string[], hasPermissionRequest: boolean, suggestedActions: any[]}> {
    console.log('DirectLine: Starting conversation with message:', message);
    try {
      // Step 1: Get Azure AD token for authentication
      console.log('DirectLine: Acquiring Azure AD token...');
      const azureAdToken = await this.getAzureADToken();
      console.log('DirectLine: Azure AD token acquired successfully');
      
      // Step 2: Generate DirectLine token
      console.log('DirectLine: Generating DirectLine token...');
      const token = await this.generateToken();
      console.log('DirectLine: DirectLine token generated successfully');
      
      // Step 3: Start conversation
      console.log('DirectLine: Starting conversation...');
      const conversationId = await this.startConversation(token);
      console.log('DirectLine: Conversation started with ID:', conversationId);
      
      // Step 4: Send message with Azure AD token
      console.log('DirectLine: Sending message with authentication...');
      await this.sendMessageToBot(conversationId, token, message, 'user1', azureAdToken);
      console.log('DirectLine: Message sent successfully');
      
      // Step 5: Poll for response
      console.log('DirectLine: Polling for response...');
      const responses = await this.pollForResponse(conversationId, token);
      console.log('DirectLine: Polling completed. Responses:', responses);
      
      return responses;
    } catch (error) {
      console.error('DirectLine service error:', error);
      throw error;
    }
  }
  // Alternative method that tries to authenticate using conversation parameters
  public static async sendMessageWithWebChatAuth(message: string): Promise<{messages: string[], hasPermissionRequest: boolean, suggestedActions: any[]}> {
    console.log('DirectLine: Trying WebChat authentication approach...');
    try {
      // Step 1: Generate token with user context like the iframe does
      console.log('DirectLine: Generating token with user context...');
      const tokenResponse = await fetch(`${DIRECT_LINE_BASE_URL}/tokens/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIRECT_LINE_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          User: {
            Id: 'authenticated-user',
            Name: 'Contoso Council User'
          },
          TrustedOrigins: getTrustedOrigins()
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`Failed to generate authenticated token: ${tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
      console.log('DirectLine: Authenticated token generated');

      // Step 2: Start conversation with authentication context
      const conversationResponse = await fetch(`${DIRECT_LINE_BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locale: 'en-US',
          members: [
            {
              id: 'authenticated-user',
              name: 'Contoso Council User',
              role: 'user'
            }
          ]
        })
      });

      if (!conversationResponse.ok) {
        throw new Error(`Failed to start authenticated conversation: ${conversationResponse.statusText}`);
      }

      const conversationData = await conversationResponse.json();
      const conversationId = conversationData.conversationId;
      console.log('DirectLine: Authenticated conversation started:', conversationId);

      // Step 3: Send a connection event first (like Power Virtual Agents does)
      const connectionEvent = {
        type: 'event',
        name: 'webchat/join',
        from: {
          id: 'authenticated-user',
          name: 'Contoso Council User',
          role: 'user'
        },
        value: {
          language: 'en-US',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      await fetch(`${DIRECT_LINE_BASE_URL}/conversations/${conversationId}/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(connectionEvent)
      });

      console.log('DirectLine: Connection event sent');

      // Step 4: Wait a moment for the bot to process the connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Send the actual message
      const messagePayload = {
        type: 'message',
        from: {
          id: 'authenticated-user',
          name: 'Contoso Council User',
          role: 'user'
        },
        text: message,
        locale: 'en-US',
        timestamp: new Date().toISOString(),
        channelData: {
          clientTimestamp: new Date().toISOString(),
          authenticationContext: {
            isAuthenticated: true,
            userId: 'authenticated-user',
            userName: 'Contoso Council User'
          }
        }
      };

      const messageResponse = await fetch(`${DIRECT_LINE_BASE_URL}/conversations/${conversationId}/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });

      if (!messageResponse.ok) {
        const errorText = await messageResponse.text();
        throw new Error(`Failed to send authenticated message: ${messageResponse.statusText} - ${errorText}`);
      }

      console.log('DirectLine: Authenticated message sent');

      // Step 6: Poll for response
      const responses = await this.pollForResponse(conversationId, token, 'authenticated-user');
      console.log('DirectLine: WebChat auth polling completed. Responses:', responses);      return responses;
    } catch (error) {
      console.error('DirectLine WebChat auth error:', error);
      throw error;
    }
  }  // Bot Framework compatible authentication method
  public static async sendMessageWithBotFrameworkAuth(message: string): Promise<{messages: string[], hasPermissionRequest: boolean, suggestedActions: any[]}> {
    console.log('DirectLine: Starting Bot Framework authentication flow...');
    
    try {
      // Step 1: Get user access token via popup with Bot Framework compatible scopes
      const authService = AuthService.getInstance();
      
      // Try to get token with Bot Framework specific scopes
      const userToken = await authService.getAccessToken();
      const userInfo = await authService.getUserInfo();
      console.log('DirectLine: User authenticated successfully for Bot Framework');

      // Step 2: Use the enhanced DirectLine approach with Bot Framework token
      // Instead of using the user token directly, we'll use the Bot Framework's expected flow
      const conversationResponse = await fetch(`${DIRECT_LINE_BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIRECT_LINE_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            id: userInfo?.id || 'authenticated-user',
            name: userInfo?.name || 'Authenticated User'
          }
        })
      });

      if (!conversationResponse.ok) {
        throw new Error(`Failed to start conversation: ${conversationResponse.statusText}`);
      }

      const conversation = await conversationResponse.json();
      const { conversationId, token } = conversation;
      console.log('DirectLine: Conversation started with Bot Framework auth');

      // Step 3: Send message with Bot Framework authentication context
      const messageResponse = await fetch(
        `${DIRECT_LINE_BASE_URL}/conversations/${conversationId}/activities`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'message',
            text: message,
            from: {
              id: userInfo?.id || 'authenticated-user',
              name: userInfo?.name || 'Authenticated User'
            },
            channelData: {
              clientActivityID: Date.now().toString(),
              authenticatedUser: {
                id: userInfo?.id,
                name: userInfo?.name,
                aadObjectId: userInfo?.id,
                accessToken: userToken
              }
            }
          }),
        }
      );

      if (!messageResponse.ok) {
        const errorText = await messageResponse.text();
        throw new Error(`Failed to send message with Bot Framework auth: ${messageResponse.statusText} - ${errorText}`);
      }

      console.log('DirectLine: Message sent with Bot Framework authentication');

      // Step 4: Poll for response
      const responses = await this.pollForResponse(conversationId, token, userInfo?.id || 'authenticated-user');
      console.log('DirectLine: Bot Framework auth polling completed. Responses:', responses);

      return responses;
    } catch (error) {
      console.error('DirectLine Bot Framework auth error:', error);
      if (error instanceof Error && error.message.includes('login')) {
        throw new Error('User authentication required. Please login to continue.');
      }
      throw error;
    }
  }

  // Backward compatible method that returns just messages
  public static async sendMessage(message: string): Promise<string[]> {
    const result = await this.sendMessageWithBotFrameworkAuth(message);
    return result.messages;
  }

  // Enhanced method with detailed response information
  public static async sendMessageDetailed(message: string): Promise<{messages: string[], hasPermissionRequest: boolean, suggestedActions: any[]}> {
    return await this.sendMessageWithBotFrameworkAuth(message);
  }
}
