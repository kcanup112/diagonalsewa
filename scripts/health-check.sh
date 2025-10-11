#!/bin/bash

# Diagonal Enterprises - Health Check Script
# This script monitors the application health

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost"
POSTGRES_CONTAINER="diagonal_postgres"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

# Health check functions
check_postgres() {
    if docker ps | grep -q $POSTGRES_CONTAINER; then
        if docker exec $POSTGRES_CONTAINER pg_isready -U diagonal_user > /dev/null 2>&1; then
            success "PostgreSQL is healthy"
            return 0
        else
            error "PostgreSQL container is running but not ready"
            return 1
        fi
    else
        error "PostgreSQL container is not running"
        return 1
    fi
}

check_backend() {
    if curl -f "$BACKEND_URL/api/health" > /dev/null 2>&1; then
        success "Backend API is healthy"
        return 0
    else
        error "Backend API is not responding"
        return 1
    fi
}

check_frontend() {
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
        success "Frontend is healthy"
        return 0
    else
        error "Frontend is not responding"
        return 1
    fi
}

check_pm2() {
    if pm2 list | grep -q "diagonal-backend.*online"; then
        success "PM2 backend process is running"
        return 0
    else
        error "PM2 backend process is not running"
        return 1
    fi
}

check_nginx() {
    if systemctl is-active --quiet nginx; then
        success "Nginx is running"
        return 0
    else
        error "Nginx is not running"
        return 1
    fi
}

check_disk_space() {
    USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $USAGE -lt 80 ]; then
        success "Disk usage is healthy ($USAGE%)"
        return 0
    elif [ $USAGE -lt 90 ]; then
        warning "Disk usage is high ($USAGE%)"
        return 1
    else
        error "Disk usage is critical ($USAGE%)"
        return 1
    fi
}

check_memory() {
    USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $USAGE -lt 80 ]; then
        success "Memory usage is healthy ($USAGE%)"
        return 0
    elif [ $USAGE -lt 90 ]; then
        warning "Memory usage is high ($USAGE%)"
        return 1
    else
        error "Memory usage is critical ($USAGE%)"
        return 1
    fi
}

# Main health check
log "Starting health check..."

FAILED=0

check_postgres || FAILED=$((FAILED + 1))
check_pm2 || FAILED=$((FAILED + 1))
check_backend || FAILED=$((FAILED + 1))
check_nginx || FAILED=$((FAILED + 1))
check_frontend || FAILED=$((FAILED + 1))
check_disk_space || FAILED=$((FAILED + 1))
check_memory || FAILED=$((FAILED + 1))

if [ $FAILED -eq 0 ]; then
    success "All health checks passed! 🎉"
    exit 0
else
    error "$FAILED health check(s) failed!"
    exit 1
fi