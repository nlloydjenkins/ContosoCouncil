import { 
  PublicClientApplication, 
  Configuration, 
  AuthenticationResult,
  PopupRequest,
  SilentRequest
} from '@azure/msal-browser';

// Azure AD Configuration from the Python script
const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// MSAL Configuration
const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: BASE_URL, // Use environment-specific URL
    postLogoutRedirectUri: BASE_URL
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Login request configuration
const loginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'openid',
    'profile',
    'email'
  ],
  prompt: 'select_account'
};

export class AuthService {
  private static instance: AuthService;
  private authResult: AuthenticationResult | null = null;
  private static msalInitialized = false;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize MSAL if not already initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!AuthService.msalInitialized) {
      await msalInstance.initialize();
      AuthService.msalInitialized = true;
    }
  }

  /**
   * Login with popup window
   */
  public async loginWithPopup(): Promise<AuthenticationResult> {
    try {
      await this.ensureInitialized();
      console.log('Auth: Starting popup login...');
      
      this.authResult = await msalInstance.loginPopup(loginRequest);
      
      console.log('Auth: Login successful!', {
        account: this.authResult.account?.username,
        scopes: this.authResult.scopes
      });
      
      return this.authResult;
    } catch (error) {
      console.error('Auth: Login failed:', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get access token silently (if user is already logged in)
   */
  public async getAccessTokenSilent(): Promise<string> {
    try {
      await this.ensureInitialized();
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please login first.');
      }

      const silentRequest: SilentRequest = {
        scopes: loginRequest.scopes!,
        account: accounts[0]
      };

      const result = await msalInstance.acquireTokenSilent(silentRequest);
      this.authResult = result;
      
      console.log('Auth: Silent token acquisition successful');
      return result.accessToken;
    } catch (error) {
      console.log('Auth: Silent token acquisition failed, will require login:', error);
      throw error;
    }
  }

  /**
   * Get access token (tries silent first, then popup if needed)
   */
  public async getAccessToken(): Promise<string> {
    try {
      // Try to get token silently first
      return await this.getAccessTokenSilent();
    } catch (silentError) {
      console.log('Auth: Silent acquisition failed, showing login popup...');
      
      // If silent fails, show popup
      const loginResult = await this.loginWithPopup();
      return loginResult.accessToken;
    }
  }
  /**
   * Get current user account
   */
  public async getCurrentAccount() {
    await this.ensureInitialized();
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  /**
   * Check if user is logged in
   */
  public async isLoggedIn(): Promise<boolean> {
    await this.ensureInitialized();
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0;
  }

  /**
   * Logout
   */
  public async logout(): Promise<void> {
    try {
      await this.ensureInitialized();
      await msalInstance.logoutPopup();
      this.authResult = null;
      console.log('Auth: Logout successful');
    } catch (error) {
      console.error('Auth: Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get user information for DirectLine
   */
  public async getUserInfo() {
    const account = await this.getCurrentAccount();
    if (!account) {
      return null;
    }

    return {
      id: account.localAccountId || account.username,
      name: account.name || account.username,
      username: account.username
    };
  }
}

export default AuthService;
