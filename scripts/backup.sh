#!/bin/bash

# Diagonal Enterprises - Backup Script
# This script creates backups of database and uploads

set -e

# Configuration
BACKUP_DIR="/home/diagonal/backups"
PROJECT_DIR="/home/diagonal/NEWPROJECT"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Create backup directory
mkdir -p $BACKUP_DIR

log "Starting backup process..."

# 1. Backup PostgreSQL database
log "Backing up PostgreSQL database..."
docker exec diagonal_postgres pg_dump -U diagonal_user diagonal_db > $BACKUP_DIR/db_backup_$DATE.sql || error "Database backup failed"

# 2. Backup uploads directory
log "Backing up uploads directory..."
if [ -d "$PROJECT_DIR/backend/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C $PROJECT_DIR/backend uploads || error "Uploads backup failed"
else
    log "Uploads directory not found, skipping..."
fi

# 3. Backup environment files
log "Backing up configuration files..."
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz -C $PROJECT_DIR \
    .env.production \
    docker-compose.yml \
    ecosystem.config.js \
    scripts/ \
    || log "Some config files not found, continuing..."

# 4. Create backup manifest
log "Creating backup manifest..."
cat > $BACKUP_DIR/backup_manifest_$DATE.txt << EOF
Diagonal Enterprises Backup
Created: $(date)
Database: db_backup_$DATE.sql
Uploads: uploads_backup_$DATE.tar.gz
Config: config_backup_$DATE.tar.gz

Backup Contents:
- PostgreSQL database dump
- User uploaded files (gallery, portfolio, avatars)
- Configuration files and scripts

Restore Instructions:
1. Database: docker exec -i diagonal_postgres psql -U diagonal_user diagonal_db < db_backup_$DATE.sql
2. Uploads: tar -xzf uploads_backup_$DATE.tar.gz -C $PROJECT_DIR/backend/
3. Config: tar -xzf config_backup_$DATE.tar.gz -C $PROJECT_DIR/
EOF

# 5. Cleanup old backups
log "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.sql" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.txt" -mtime +$RETENTION_DAYS -delete

# 6. Display backup summary
log "Backup completed successfully!"
log "Backup files created:"
ls -lah $BACKUP_DIR/*$DATE*

# Calculate total backup size
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Total backup directory size: $TOTAL_SIZE"

log "Backup process finished at $(date)"