# 🚀 CI/CD Pipeline for Diagonal Enterprises

This document describes the complete CI/CD (Continuous Integration/Continuous Deployment) setup for the Diagonal Enterprises project.

## 📋 Overview

Our CI/CD pipeline automatically:
- ✅ Tests code when changes are pushed
- ✅ Builds the frontend for production
- ✅ Deploys to the VPS automatically
- ✅ Manages Docker PostgreSQL database
- ✅ Performs health checks
- ✅ Handles rollbacks if needed

## 🏗️ Architecture

```
GitHub Repository
       ↓
GitHub Actions Workflow
       ↓
VPS Server (135.181.38.171)
├── Docker PostgreSQL
├── Node.js Backend (PM2)
├── React Frontend (Built)
└── Nginx (Reverse Proxy)
```

## 🔧 Components

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- **Trigger:** Push to `main` branch
- **Steps:** Test → Build → Deploy
- **Environment:** Ubuntu latest with PostgreSQL service

### 2. Deployment Script (`scripts/deploy.sh`)
- Pulls latest code from GitHub
- Installs dependencies
- Builds frontend
- Runs database migrations
- Restarts services
- Performs health checks

### 3. Health Check Script (`scripts/health-check.sh`)
- Monitors PostgreSQL, Backend, Frontend, Nginx
- Checks system resources (disk, memory)
- Returns exit codes for monitoring tools

### 4. Backup Script (`scripts/backup.sh`)
- Daily automated backups
- Database dumps, uploads, configuration
- Automatic cleanup of old backups

## 🚦 Deployment Process

### Automatic Deployment (on push to main)
```bash
1. Developer pushes code to GitHub
2. GitHub Actions triggers
3. Tests run in isolated environment
4. If tests pass, deployment starts
5. VPS pulls latest code
6. Dependencies are updated
7. Frontend is rebuilt
8. Backend services restart
9. Health checks verify deployment
10. Deployment complete!
```

### Manual Deployment
```bash
# SSH to your VPS
ssh diagonal@135.181.38.171

# Run deployment script
cd /home/diagonal/NEWPROJECT
./scripts/deploy.sh
```

## 📊 Monitoring & Health Checks

### Automated Health Checks
The pipeline includes comprehensive health monitoring:

```bash
# Run health check manually
./scripts/health-check.sh
```

**Checks performed:**
- ✅ PostgreSQL container status
- ✅ Backend API responsiveness
- ✅ Frontend accessibility
- ✅ PM2 process status
- ✅ Nginx service status
- ✅ Disk space usage
- ✅ Memory usage

### Logging
- **Application logs:** PM2 handles backend logs
- **Web server logs:** `/var/log/nginx/`
- **Deployment logs:** `/var/log/diagonal-deploy.log`

## 💾 Backup Strategy

### Automated Backups
```bash
# Daily backup (configured via cron)
0 2 * * * /home/diagonal/NEWPROJECT/scripts/backup.sh
```

**Backup includes:**
- PostgreSQL database dump
- User uploaded files
- Configuration files
- Environment variables

### Manual Backup
```bash
# Run backup manually
./scripts/backup.sh
```

**Restore from backup:**
```bash
# Database
docker exec -i diagonal_postgres psql -U diagonal_user diagonal_db < backup.sql

# Uploads
tar -xzf uploads_backup.tar.gz -C /home/diagonal/NEWPROJECT/backend/
```

## 🔐 Security Considerations

### Environment Variables
- Production secrets stored in `.env.production`
- GitHub secrets for CI/CD credentials
- Database credentials secured in Docker

### Access Control
- Non-root user (`diagonal`) for deployments
- SSH key authentication recommended
- Firewall configured (UFW)
- Nginx security headers enabled

### SSL/HTTPS (Optional)
```bash
# Install Let's Encrypt SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🛠️ Setup Instructions

### 1. Initial VPS Setup
```bash
# Connect to VPS as root
ssh root@135.181.38.171

# Run the complete setup from our guide
# (Follow the VPS deployment steps provided earlier)
```

### 2. GitHub Actions Setup
1. Add secrets to GitHub repository:
   - `VPS_HOST`: 135.181.38.171
   - `VPS_USERNAME`: diagonal
   - `VPS_PASSWORD`: [password] or `VPS_SSH_KEY`: [private key]

2. Push code to trigger first deployment

### 3. Configure Monitoring
```bash
# Set up cron jobs for automated tasks
crontab -e

# Add these lines:
# Health check every 5 minutes
*/5 * * * * /home/diagonal/NEWPROJECT/scripts/health-check.sh

# Daily backup at 2 AM
0 2 * * * /home/diagonal/NEWPROJECT/scripts/backup.sh

# Weekly log rotation
0 0 * * 0 /usr/sbin/logrotate -f /etc/logrotate.conf
```

## 🚨 Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check logs
tail -f /var/log/diagonal-deploy.log
pm2 logs diagonal-backend
```

#### Database Connection Issues
```bash
# Check PostgreSQL container
docker ps | grep postgres
docker logs diagonal_postgres

# Restart if needed
docker restart diagonal_postgres
```

#### Frontend Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Backend API Errors
```bash
# Check PM2 processes
pm2 status
pm2 restart diagonal-backend

# Check application logs
pm2 logs diagonal-backend
```

### Rollback Procedure
```bash
# Rollback to previous commit
git reset --hard HEAD~1
./scripts/deploy.sh

# Or rollback to specific commit
git reset --hard <commit-hash>
./scripts/deploy.sh
```

## 📈 Performance Optimization

### Frontend
- Static asset caching (1 year)
- Gzip compression enabled
- CDN integration (optional)

### Backend
- PM2 process management
- Database connection pooling
- API rate limiting

### Database
- PostgreSQL performance tuning
- Regular VACUUM and ANALYZE
- Index optimization

## 🔄 Maintenance Tasks

### Daily
- ✅ Automated health checks
- ✅ Automated backups
- ✅ Log rotation

### Weekly
- 🔍 Review error logs
- 📊 Monitor resource usage
- 🗃️ Database maintenance

### Monthly
- 🔒 Security updates
- 📈 Performance review
- 💾 Backup verification

## 📞 Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Review deployment logs on VPS
3. Run health checks
4. Check individual service status

**Pipeline Status Dashboard:** GitHub repository → Actions tab

---

*This CI/CD pipeline ensures reliable, automated deployments while maintaining high availability and security standards for the Diagonal Enterprises application.*