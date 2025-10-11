# GitHub Secrets Configuration for CI/CD

To set up the CI/CD pipeline, you need to add the following secrets to your GitHub repository:

## How to Add Secrets:
1. Go to your GitHub repository: https://github.com/kcanup112/NEWPROJECT
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret" for each secret below

## Required Secrets:

### VPS_HOST
- **Name:** `VPS_HOST`
- **Value:** `135.181.38.171`
- **Description:** Your VPS IP address

### VPS_USERNAME
- **Name:** `VPS_USERNAME`
- **Value:** `diagonal`
- **Description:** SSH username for deployment (use 'diagonal' user, not root for security)

### VPS_PASSWORD
- **Name:** `VPS_PASSWORD`
- **Value:** `[password for diagonal user]`
- **Description:** SSH password for the diagonal user
- **Note:** It's recommended to use SSH keys instead of passwords for better security

### Alternative: SSH Key Authentication (Recommended)
Instead of using password authentication, you can use SSH keys:

1. Generate SSH key pair on your local machine:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   ```

2. Add the public key to your VPS:
   ```bash
   # On your VPS as diagonal user
   mkdir -p ~/.ssh
   echo "your-public-key-content" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

3. Add the private key as a GitHub secret:
   - **Name:** `VPS_SSH_KEY`
   - **Value:** `[content of private key file]`

4. Update the GitHub Actions workflow to use SSH key instead of password:
   ```yaml
   - name: Deploy to VPS
     uses: appleboy/ssh-action@v0.1.7
     with:
       host: ${{ secrets.VPS_HOST }}
       username: ${{ secrets.VPS_USERNAME }}
       key: ${{ secrets.VPS_SSH_KEY }}
       script: |
         # deployment commands...
   ```

## Optional Secrets for Enhanced Features:

### EMAIL_HOST (for notifications)
- **Name:** `EMAIL_HOST`
- **Value:** `smtp.gmail.com`

### EMAIL_USER
- **Name:** `EMAIL_USER`
- **Value:** `your-email@gmail.com`

### EMAIL_PASS
- **Name:** `EMAIL_PASS`
- **Value:** `your-app-password`

### SLACK_WEBHOOK (for deployment notifications)
- **Name:** `SLACK_WEBHOOK`
- **Value:** `https://hooks.slack.com/services/...`

## Security Best Practices:

1. **Never commit secrets to your repository**
2. **Use environment-specific secrets**
3. **Regularly rotate passwords and keys**
4. **Use least privilege principle for SSH users**
5. **Enable 2FA on your GitHub account**

## Testing the CI/CD Pipeline:

After adding the secrets:

1. Make a small change to your code
2. Commit and push to the main branch
3. Go to the "Actions" tab in your GitHub repository
4. Watch the deployment workflow run
5. Check your VPS to confirm the deployment

The pipeline will:
- ✅ Run tests on both frontend and backend
- ✅ Build the frontend for production
- ✅ Deploy to your VPS automatically
- ✅ Restart services and perform health checks