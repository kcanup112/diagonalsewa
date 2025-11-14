# 🚀 Quick Deployment Guide

This is a quick reference for deploying Diagonal Sewa to your VPS with automated CI/CD.

## 📦 What You Need

1. **VPS Server** (Ubuntu 20.04+ recommended)
2. **GitHub Account** with this repository
3. **SSH Access** to your VPS
4. **Domain Name** (optional but recommended)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Prepare VPS

SSH into your VPS and run the automated setup script:

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/kcanup112/diagonalsewa/main/scripts/vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

This script will:
- Install Node.js, PM2, Nginx, Git
- Clone your repository
- Install dependencies
- Build the application
- Generate SSH keys for GitHub Actions
- Configure Nginx
- Start services with PM2

### Step 2: Configure Environment

Edit the environment files on your VPS:

```bash
# Backend environment
nano /var/www/diagonalsewa/backend/.env
# Change: JWT_SECRET, ADMIN_PASSWORD, FRONTEND_URL

# Frontend environment
nano /var/www/diagonalsewa/frontend/.env
# Change: REACT_APP_API_URL to your domain
```

### Step 3: Setup GitHub Secrets

1. Go to: `https://github.com/kcanup112/diagonalsewa/settings/secrets/actions`

2. Click "New repository secret" and add:

   **VPS_HOST** = Your VPS IP address (e.g., `123.456.789.012`)
   
   **VPS_USERNAME** = Your SSH username (e.g., `ubuntu`)
   
   **VPS_SSH_KEY** = Private key (shown after running vps-setup.sh)
   
   **VPS_PORT** = `22` (or your custom SSH port)
   
   **VPS_PROJECT_PATH** = `/var/www/diagonalsewa`

### Step 4: Test Deployment

```bash
# Make a small change and push to GitHub
git add .
git commit -m "Test deployment"
git push origin main

# Watch the deployment at:
# https://github.com/kcanup112/diagonalsewa/actions
```

---

## 🎯 GitHub Secrets Setup

| Secret Name | Value | Example |
|------------|-------|---------|
| `VPS_HOST` | Your VPS IP or domain | `123.456.789.012` |
| `VPS_USERNAME` | SSH username | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH...` |
| `VPS_PORT` | SSH port (optional) | `22` |
| `VPS_PROJECT_PATH` | Project directory | `/var/www/diagonalsewa` |

---

## 📱 Useful Commands

### On VPS:

```bash
# View application status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Check Nginx
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
```

### Local Development:

```bash
# Push changes (triggers auto-deployment)
git add .
git commit -m "Your changes"
git push origin main

# Check deployment status
# Visit: https://github.com/kcanup112/diagonalsewa/actions
```

---

## 🔧 Troubleshooting

### Deployment Failed?

1. Check GitHub Actions logs
2. Verify SSH key in GitHub Secrets
3. Test SSH connection:
   ```bash
   ssh -i ~/.ssh/github_actions username@vps-ip
   ```

### Services Not Running?

```bash
# On VPS
pm2 restart all
pm2 logs --err
```

### Can't Access Website?

```bash
# Check if ports are open
sudo lsof -i :80
sudo lsof -i :3000
sudo lsof -i :5000

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🌐 Setup Domain (Optional)

### Configure DNS:

Add an A record pointing to your VPS IP:
```
Type: A
Name: @
Value: Your-VPS-IP
```

### Update Environment:

```bash
# Backend .env
FRONTEND_URL=https://yourdomain.com

# Frontend .env  
REACT_APP_API_URL=https://yourdomain.com/api
```

### Get SSL Certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ Success Checklist

- [ ] VPS setup script completed
- [ ] Environment files configured
- [ ] GitHub Secrets added
- [ ] First deployment successful
- [ ] Application accessible via browser
- [ ] PM2 processes running
- [ ] Nginx configured
- [ ] (Optional) SSL certificate installed

---

## 📚 Full Documentation

For detailed documentation, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [README.md](./README.md) - Project documentation

---

## 🆘 Need Help?

1. Check logs: `pm2 logs`
2. View deployment history: GitHub Actions tab
3. Test manually: SSH into VPS and run commands manually
4. Check firewall: `sudo ufw status`

---

## 🎉 You're Done!

Every time you push to `main` branch, your application will automatically deploy to your VPS!

Monitor deployments at: `https://github.com/kcanup112/diagonalsewa/actions`
