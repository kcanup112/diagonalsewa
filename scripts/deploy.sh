#!/bin/bash

# Diagonal Enterprises - Production Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/diagonal/NEWPROJECT"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_FILE="/var/log/diagonal-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as diagonal user
if [ "$USER" != "diagonal" ]; then
    error "This script must be run as the 'diagonal' user"
fi

log "Starting deployment process..."

# 1. Navigate to project directory
cd $PROJECT_DIR || error "Failed to navigate to project directory"

# 2. Pull latest changes from GitHub
log "Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main || error "Failed to pull latest changes"

# 3. Check if Docker PostgreSQL is running
log "Checking Docker PostgreSQL status..."
if ! docker ps | grep -q "postgres"; then
    log "Starting PostgreSQL container..."
    docker-compose up -d postgres || error "Failed to start PostgreSQL"
    sleep 10  # Wait for PostgreSQL to start
else
    log "PostgreSQL container is already running"
fi

# 4. Install/Update backend dependencies
log "Installing backend dependencies..."
cd $BACKEND_DIR
npm install --production || error "Failed to install backend dependencies"

# 5. Install/Update frontend dependencies and build
log "Installing frontend dependencies and building..."
cd $FRONTEND_DIR
npm install --production || error "Failed to install frontend dependencies"
npm run build || error "Failed to build frontend"

# 6. Run database migrations
log "Running database migrations..."
cd $BACKEND_DIR
NODE_ENV=production node -e "
const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
  process.exit(0);
}).catch(err => {
  console.error('Database sync failed:', err);
  process.exit(1);
});
" || error "Database migration failed"

# 7. Create upload directories
log "Setting up upload directories..."
mkdir -p $BACKEND_DIR/uploads/{gallery,portfolio,avatars}
chmod -R 755 $BACKEND_DIR/uploads

# 8. Restart PM2 processes
log "Restarting backend services..."
cd $PROJECT_DIR
pm2 restart diagonal-backend || pm2 start ecosystem.config.js || error "Failed to start backend"

# 9. Reload Nginx
log "Reloading Nginx..."
sudo systemctl reload nginx || error "Failed to reload Nginx"

# 10. Health checks
log "Performing health checks..."
sleep 5

# Check if backend is responding
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log "✅ Backend health check passed"
else
    warning "⚠️  Backend health check failed"
fi

# Check if frontend is accessible
if curl -f http://localhost > /dev/null 2>&1; then
    log "✅ Frontend health check passed"
else
    warning "⚠️  Frontend health check failed"
fi

# 11. Display status
log "Deployment completed successfully!"
log "=== Service Status ==="
pm2 status
docker ps --filter "name=postgres"

log "=== Deployment Summary ==="
log "Frontend: Built and deployed"
log "Backend: Restarted with PM2"
log "Database: PostgreSQL running in Docker"
log "Web Server: Nginx reloaded"
log "Site URL: http://135.181.38.171"
log "Admin URL: http://135.181.38.171/admin/login"

log "Deployment completed at $(date)"