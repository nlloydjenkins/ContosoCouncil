# Azure Configuration Setup Guide

This guide will help you obtain the required Azure credentials for the Contoso Council Planning Portal.

## Required Environment Variables

You need to configure the following environment variables:

- `VITE_AZURE_TENANT_ID` - Your Azure AD tenant ID
- `VITE_AZURE_CLIENT_ID` - Your Azure AD app registration client ID  
- `VITE_AZURE_CLIENT_SECRET` - Your Azure AD app registration client secret
- `VITE_DIRECTLINE_SECRET` - Your Bot Framework DirectLine secret

## Step 1: Azure AD App Registration

### 1.1 Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: `Contoso Council Planning Portal`
   - **Supported account types**: Select appropriate option (usually "Accounts in this organizational directory only")
   - **Redirect URI**: 
     - Platform: Web
     - URI: `http://localhost:3000` (for development)
5. Click **Register**

### 1.2 Get Tenant ID and Client ID

1. After registration, you'll be on the app's **Overview** page
2. Copy the following values:
   - **Application (client) ID** → This is your `VITE_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → This is your `VITE_AZURE_TENANT_ID`

### 1.3 Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description: `Contoso Council Portal Secret`
4. Choose expiration period (recommend 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the secret **Value** immediately (it won't be shown again)
   - This is your `VITE_AZURE_CLIENT_SECRET`

### 1.4 Configure Redirect URIs

1. Go to **Authentication** in your app registration
2. Add the following redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://thankful-sea-03a16bc03.6.azurestaticapps.net` (for production)
3. Save changes

### 1.5 Configure API Permissions

1. Go to **API permissions** in your app registration
2. Click **Add a permission**
3. Go to **APIs my organization uses**
4. Search for and select **Bot Framework**
5. Select **Application permissions**
6. Check **user_impersonation** or similar Bot Framework scope
7. Click **Add permissions**
8. Click **Grant admin consent** for your organization

## Step 2: Bot Framework DirectLine Setup

### 2.1 Create Azure Bot Service

1. In Azure Portal, search for **Bot Services**
2. Click **Create** > **Azure Bot**
3. Fill in the details:
   - **Bot handle**: `contoso-council-bot`
   - **Subscription**: Your subscription
   - **Resource group**: Create new or use existing
   - **Data residency**: Choose appropriate region
   - **Pricing tier**: Choose based on needs (F0 for development)
   - **Microsoft App ID**: Use the Client ID from Step 1.2
4. Click **Review + create** > **Create**

### 2.2 Configure DirectLine Channel

1. Once the bot is created, go to the bot resource
2. Navigate to **Settings** > **Configuration**
3. Go to **Channels**
4. Click **DirectLine** channel
5. Configure the channel:
   - **Sites**: Create a new site or use default
   - **Enhanced authentication**: Enable if needed
6. Click **Done**
7. Click **Show** next to one of the secret keys
8. Copy the secret key → This is your `VITE_DIRECTLINE_SECRET`

## Step 3: Configure Environment Variables

### For Local Development:

1. In your project root, edit the `.env.local` file:

```bash
# Azure AD Configuration
VITE_AZURE_TENANT_ID=your_tenant_id_from_step_1_2
VITE_AZURE_CLIENT_ID=your_client_id_from_step_1_2
VITE_AZURE_CLIENT_SECRET=your_client_secret_from_step_1_3

# DirectLine Configuration
VITE_DIRECTLINE_SECRET=your_directline_secret_from_step_2_2

# Application Configuration
VITE_APP_BASE_URL=http://localhost:3000
```

### For Production (GitHub Actions):

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** for each:
   - `VITE_AZURE_TENANT_ID`
   - `VITE_AZURE_CLIENT_ID`
   - `VITE_AZURE_CLIENT_SECRET`
   - `VITE_DIRECTLINE_SECRET`

## Step 4: Test Configuration

1. Save your `.env.local` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Open the application in your browser
4. Try using the chatbot feature to verify DirectLine connection
5. Check the browser console for any authentication errors

## Troubleshooting

### Common Issues:

1. **Invalid tenant ID**: Make sure you copied the Directory (tenant) ID, not the Application ID
2. **Client secret expired**: Client secrets expire - check the expiration date in Azure AD
3. **Wrong redirect URI**: Ensure redirect URIs match exactly (including trailing slashes)
4. **DirectLine secret invalid**: DirectLine secrets can be regenerated if needed

### Security Best Practices:

1. **Never commit secrets**: The `.env.local` file is in `.gitignore` for a reason
2. **Rotate secrets regularly**: Set up calendar reminders to rotate client secrets
3. **Use least privilege**: Only grant necessary API permissions
4. **Monitor usage**: Check Azure AD sign-in logs for unusual activity

## Need Help?

- Check the [Azure AD documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- Review [Bot Framework documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- Contact your Azure administrator if you don't have necessary permissions
