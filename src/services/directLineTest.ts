import { DirectLineService } from './directLineService';
import { AuthService } from './authService';

// Simple test function to debug DirectLine service
async function testDirectLineService() {
  console.log('=== DirectLine Service Test ===');
  
  const testMessage = 'check planning application 10001';
  console.log('Testing with message:', testMessage);
    // Test popup authentication first
  console.log('\n--- Testing Popup Authentication ---');
  try {
    const popupResponses = await DirectLineService.sendMessageDetailed(testMessage);
    console.log('Popup Auth - Test completed successfully!');
    console.log('Popup Auth - Number of messages:', popupResponses.messages.length);
    console.log('Popup Auth - Messages:', popupResponses.messages);
    console.log('Popup Auth - Has permission request:', popupResponses.hasPermissionRequest);
    console.log('Popup Auth - Suggested actions:', popupResponses.suggestedActions);
    return popupResponses;
  } catch (popupError) {
    console.log('Popup Auth failed:', popupError);
    
    // Test both authentication methods
    console.log('\n--- Testing WebChat Authentication ---');
    try {
      const webChatResponses = await DirectLineService.sendMessageWithWebChatAuth(testMessage);
      console.log('WebChat Auth - Test completed successfully!');
      console.log('WebChat Auth - Number of messages:', webChatResponses.messages.length);
      console.log('WebChat Auth - Messages:', webChatResponses.messages);
      console.log('WebChat Auth - Has permission request:', webChatResponses.hasPermissionRequest);
      console.log('WebChat Auth - Suggested actions:', webChatResponses.suggestedActions);
      return webChatResponses;
    } catch (webChatError) {
      console.log('WebChat Auth failed:', webChatError);
      
      console.log('\n--- Testing Standard Azure AD Authentication ---');
      try {
        const standardResponses = await DirectLineService.sendMessageAndGetResponse(testMessage);
        console.log('Standard Auth - Test completed successfully!');
        console.log('Standard Auth - Number of messages:', standardResponses.messages.length);
        console.log('Standard Auth - Messages:', standardResponses.messages);
        console.log('Standard Auth - Has permission request:', standardResponses.hasPermissionRequest);
        console.log('Standard Auth - Suggested actions:', standardResponses.suggestedActions);
        return standardResponses;
      } catch (standardError) {
        console.error('All authentication methods failed');
        console.error('Popup Error:', popupError);
        console.error('WebChat Error:', webChatError);
        console.error('Standard Error:', standardError);
        throw standardError;
      }
    }
  }
}

// Test just the popup login functionality
async function testPopupLogin() {
  console.log('=== Testing Popup Login Only ===');
  try {
    const authService = AuthService.getInstance();
    const token = await authService.getAccessToken();
    console.log('✅ Login successful!');
    console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
    
    const userInfo = await authService.getUserInfo();
    console.log('User info:', userInfo);
    
    const isLoggedIn = await authService.isLoggedIn();
    console.log('Is logged in:', isLoggedIn);
    
    return { token, userInfo, isLoggedIn };
  } catch (error) {
    console.error('❌ Login test failed:', error);
    throw error;
  }
}

// Test Bot Framework authentication specifically
async function testBotFrameworkAuth() {
  console.log('=== Testing Bot Framework Authentication ===');
  try {
    const testMessage = 'check planning application 10001';
    const response = await DirectLineService.sendMessageWithBotFrameworkAuth(testMessage);
    console.log('✅ Bot Framework auth test successful!');
    console.log('Number of messages:', response.messages.length);
    console.log('Messages:', response.messages);
    console.log('Has permission request:', response.hasPermissionRequest);
    console.log('Suggested actions:', response.suggestedActions);
    return response;
  } catch (error) {
    console.error('❌ Bot Framework auth test failed:', error);
    throw error;
  }
}

// Export for use in development console
(window as any).testDirectLine = testDirectLineService;
(window as any).testPopupLogin = testPopupLogin;
(window as any).testBotFrameworkAuth = testBotFrameworkAuth;

console.log('🧪 DirectLine tests loaded!');
console.log('Available test functions:');
console.log('- testDirectLine() - Test all DirectLine methods including popup auth');
console.log('- testPopupLogin() - Test popup login functionality only');
console.log('- testBotFrameworkAuth() - Test Bot Framework authentication specifically');

export { testDirectLineService, testPopupLogin, testBotFrameworkAuth };
