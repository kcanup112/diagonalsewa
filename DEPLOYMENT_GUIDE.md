# VPS Deployment Setup Guide

## 🚀 Automated CI/CD Deployment

This guide will help you set up automated deployment from GitHub to your VPS server.

---

## 📋 Prerequisites

### On Your VPS Server:
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PM2 installed globally
- Nginx installed (optional, for reverse proxy)
- Git installed
- SSH access enabled

---

## 🔧 VPS Server Setup

### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install serve for frontend (static file serving)
sudo npm install -g serve

# Install Nginx (optional)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 2. Create Application Directory

```bash
# Create directory for the application
sudo mkdir -p /var/www/diagonalsewa
sudo chown -R $USER:$USER /var/www/diagonalsewa

# Navigate to directory
cd /var/www/diagonalsewa

# Clone your repository
git clone https://github.com/kcanup112/diagonalsewa.git .

# Or if already exists, pull latest
git pull origin main
```

### 3. Setup SSH Key for GitHub Actions

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "github-actions@diagonalsewa" -f ~/.ssh/github_actions

# Display public key (add this to VPS authorized_keys)
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Display private key (add this to GitHub Secrets)
cat ~/.ssh/github_actions
# Copy this entire output including BEGIN and END lines
```

### 4. Create Logs Directory

```bash
# Create logs directory
mkdir -p /var/www/diagonalsewa/logs
chmod 755 /var/www/diagonalsewa/logs
```

### 5. Setup Environment Variables

```bash
# Create backend .env file
cd /var/www/diagonalsewa/backend
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

# Database (SQLite)
DB_STORAGE=./database/diagonal_construction.sqlite

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random

# Admin Credentials
ADMIN_EMAIL=admin@diagonal.com
ADMIN_PASSWORD=your-secure-admin-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
FRONTEND_URL=http://your-domain.com

# Rate Limiting
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Create frontend .env file
cd /var/www/diagonalsewa/frontend
cat > .env << 'EOF'
REACT_APP_API_URL=http://your-domain.com/api
REACT_APP_ENV=production
EOF
```

### 6. Initial Setup

```bash
# Navigate to project root
cd /var/www/diagonalsewa

# Install backend dependencies
cd backend
npm ci --production

# Install frontend dependencies and build
cd ../frontend
npm ci
npm run build

# Start services with PM2
cd /var/www/diagonalsewa
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it gives you (usually sudo ...)
```

### 7. Configure Nginx (Optional but Recommended)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/diagonalsewa

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React build)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for long requests
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files and uploads
    location /uploads {
        alias /var/www/diagonalsewa/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_disable "MSIE [1-6]\.";
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/diagonalsewa /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### 8. SSL Certificate with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

---

## 🔐 GitHub Secrets Configuration

Go to your GitHub repository: `https://github.com/kcanup112/diagonalsewa/settings/secrets/actions`

Add the following secrets:

### Required Secrets:

1. **VPS_HOST**
   - Your VPS IP address or domain
   - Example: `123.456.789.012` or `vps.example.com`

2. **VPS_USERNAME**
   - SSH username for your VPS
   - Example: `ubuntu` or your username

3. **VPS_SSH_KEY**
   - Private SSH key content (from step 3 above)
   - Copy the entire output from `cat ~/.ssh/github_actions`
   - Include `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

4. **VPS_PORT** (Optional)
   - SSH port (default: 22)
   - Only add if using non-standard SSH port

5. **VPS_PROJECT_PATH** (Optional)
   - Full path to project on VPS
   - Default: `/var/www/diagonalsewa`
   - Example: `/home/ubuntu/apps/diagonalsewa`

---

## 🎯 How It Works

1. **Push to GitHub**: When you push code to the `main` branch
2. **Tests Run**: GitHub Actions runs tests (if available)
3. **Deployment**: If tests pass, the code is automatically deployed to VPS
4. **Services Restart**: PM2 restarts backend and frontend services
5. **Health Check**: Verifies deployment was successful

---

## 📊 Monitoring & Management

### PM2 Commands

```bash
# View all running processes
pm2 status

# View logs
pm2 logs

# View specific app logs
pm2 logs diagonal-backend
pm2 logs diagonal-frontend

# Restart services
pm2 restart all
pm2 restart diagonal-backend
pm2 restart diagonal-frontend

# Stop services
pm2 stop all
pm2 stop diagonal-backend

# Delete processes
pm2 delete all

# Monitor CPU and Memory
pm2 monit
```

### Check Application Health

```bash
# Check if backend is responding
curl http://localhost:5000/api/health

# Check if frontend is serving
curl http://localhost:3000

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 Manual Deployment

If you need to deploy manually:

```bash
# SSH into VPS
ssh your-username@your-vps-ip

# Navigate to project
cd /var/www/diagonalsewa

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm ci --production

# Update frontend
cd ../frontend
npm ci
npm run build

# Restart services
pm2 restart all

# Check status
pm2 status
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check PM2 logs
pm2 logs --err

# Check if ports are in use
sudo lsof -i :5000
sudo lsof -i :3000

# Check permissions
ls -la /var/www/diagonalsewa
```

### Database Issues

```bash
# Check if database file exists
ls -la /var/www/diagonalsewa/backend/database/

# Check database permissions
chmod 644 /var/www/diagonalsewa/backend/database/*.sqlite
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### GitHub Actions Deployment Fails

1. Check GitHub Actions logs in your repository
2. Verify SSH key is correct in GitHub Secrets
3. Ensure VPS can be reached from GitHub's IPs
4. Check VPS firewall settings:
   ```bash
   sudo ufw status
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

---

## 🔒 Security Best Practices

1. **Change default SSH port**:
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to something else
   sudo systemctl restart sshd
   ```

2. **Setup firewall**:
   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp  # SSH
   sudo ufw allow 80/tcp  # HTTP
   sudo ufw allow 443/tcp # HTTPS
   ```

3. **Disable root login**:
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

4. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

5. **Setup fail2ban**:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

---

## 📝 Environment Variables Reference

### Backend (.env)
- `NODE_ENV`: production
- `PORT`: 5000
- `DB_STORAGE`: Path to SQLite database
- `JWT_SECRET`: Secret key for JWT tokens
- `ADMIN_EMAIL`: Admin login email
- `ADMIN_PASSWORD`: Admin login password
- `FRONTEND_URL`: Your frontend domain

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: production

---

## ✅ Deployment Checklist

- [ ] VPS server set up with Node.js, PM2, Nginx
- [ ] SSH key generated and added to authorized_keys
- [ ] GitHub Secrets configured (VPS_HOST, VPS_USERNAME, VPS_SSH_KEY)
- [ ] Environment files created (.env in backend and frontend)
- [ ] Application cloned to VPS
- [ ] Dependencies installed
- [ ] PM2 processes started and saved
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Firewall configured
- [ ] Test deployment by pushing to main branch

---

## 🎉 Success!

Once everything is set up, every push to the `main` branch will automatically deploy to your VPS!

Monitor the deployment at: `https://github.com/kcanup112/diagonalsewa/actions`
