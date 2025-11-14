#!/bin/bash

# Diagonal Sewa - VPS Initial Setup Script
# Run this script on your VPS server to set up the initial environment

set -e  # Exit on error

echo "🚀 Starting Diagonal Sewa VPS Setup..."

# Configuration
PROJECT_DIR="/var/www/diagonalsewa"
GITHUB_REPO="https://github.com/kcanup112/diagonalsewa.git"
NODE_VERSION="20"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root. Run as regular user with sudo privileges."
    exit 1
fi

# Update system
print_message "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
print_message "Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    print_message "Node.js installed: $(node --version)"
else
    print_message "Node.js already installed: $(node --version)"
fi

# Install PM2
print_message "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_message "PM2 installed: $(pm2 --version)"
else
    print_message "PM2 already installed: $(pm2 --version)"
fi

# Install serve for frontend
print_message "Installing serve..."
sudo npm install -g serve

# Install Nginx
print_message "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    print_message "Nginx installed"
else
    print_message "Nginx already installed"
fi

# Install Git
print_message "Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install -y git
    print_message "Git installed"
else
    print_message "Git already installed"
fi

# Create project directory
print_message "Creating project directory..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# Clone repository
print_message "Cloning repository..."
if [ -d "$PROJECT_DIR/.git" ]; then
    print_warning "Repository already exists. Pulling latest changes..."
    cd $PROJECT_DIR
    git pull origin main
else
    git clone $GITHUB_REPO $PROJECT_DIR
fi

cd $PROJECT_DIR

# Create logs directory
print_message "Creating logs directory..."
mkdir -p logs

# Setup backend
print_message "Setting up backend..."
cd backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating backend .env file..."
    cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

# Database (SQLite)
DB_STORAGE=./database/diagonal_construction.sqlite

# JWT Secret (CHANGE THIS!)
JWT_SECRET=change-this-to-a-random-secret-key-$(date +%s)

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=admin@diagonal.com
ADMIN_PASSWORD=ChangeThisPassword123!

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
FRONTEND_URL=http://localhost

# Rate Limiting
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    print_warning "⚠️  IMPORTANT: Edit backend/.env and change JWT_SECRET and ADMIN_PASSWORD!"
else
    print_message "Backend .env already exists"
fi

# Install backend dependencies
print_message "Installing backend dependencies..."
npm ci --production

# Setup frontend
print_message "Setting up frontend..."
cd ../frontend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating frontend .env file..."
    cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=production
EOF
    print_warning "⚠️  IMPORTANT: Edit frontend/.env and update REACT_APP_API_URL with your domain!"
else
    print_message "Frontend .env already exists"
fi

# Install frontend dependencies
print_message "Installing frontend dependencies..."
npm ci

# Build frontend
print_message "Building frontend..."
npm run build

# Start PM2 processes
print_message "Starting PM2 processes..."
cd $PROJECT_DIR
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 startup
print_message "Configuring PM2 startup..."
pm2 startup | tail -n 1 | bash

# Configure Nginx
print_message "Configuring Nginx..."
NGINX_CONFIG="/etc/nginx/sites-available/diagonalsewa"

if [ ! -f "$NGINX_CONFIG" ]; then
    sudo tee $NGINX_CONFIG > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /uploads {
        alias /var/www/diagonalsewa/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    sudo nginx -t && sudo systemctl restart nginx
    print_message "Nginx configured and restarted"
else
    print_message "Nginx configuration already exists"
fi

# Setup firewall
print_message "Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw --force enable
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    print_message "Firewall configured"
fi

# Generate SSH key for GitHub Actions
print_message "Generating SSH key for GitHub Actions..."
SSH_KEY_PATH="$HOME/.ssh/github_actions"
if [ ! -f "$SSH_KEY_PATH" ]; then
    ssh-keygen -t ed25519 -C "github-actions@diagonalsewa" -f $SSH_KEY_PATH -N ""
    cat "${SSH_KEY_PATH}.pub" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    print_message "SSH key generated"
    echo ""
    print_warning "================================"
    print_warning "IMPORTANT: Add this PRIVATE key to GitHub Secrets as VPS_SSH_KEY:"
    echo ""
    cat $SSH_KEY_PATH
    echo ""
    print_warning "================================"
else
    print_message "SSH key already exists"
fi

# Print summary
echo ""
echo "================================"
print_message "🎉 VPS Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and update JWT_SECRET and ADMIN_PASSWORD"
echo "2. Edit frontend/.env and update REACT_APP_API_URL with your domain"
echo "3. Add the SSH private key (shown above) to GitHub Secrets"
echo "4. Configure GitHub Secrets:"
echo "   - VPS_HOST: $(hostname -I | awk '{print $1}')"
echo "   - VPS_USERNAME: $USER"
echo "   - VPS_SSH_KEY: (the private key shown above)"
echo "   - VPS_PORT: 22 (or your SSH port)"
echo "   - VPS_PROJECT_PATH: $PROJECT_DIR"
echo "5. Test the application:"
echo "   - Frontend: http://$(hostname -I | awk '{print $1}')"
echo "   - Backend: http://$(hostname -I | awk '{print $1}')/api/health"
echo "6. (Optional) Setup SSL with: sudo certbot --nginx -d yourdomain.com"
echo ""
echo "PM2 processes status:"
pm2 status
echo ""
print_message "Happy deploying! 🚀"
