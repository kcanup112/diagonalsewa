# Quick Start Guide - SQLite Backend

## ✅ Migration Status: COMPLETE

Your PostgreSQL database has been successfully migrated to SQLite!

---

## 🚀 Start Your Server

### Backend (Required)
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

### Frontend (Optional - for testing UI)
```bash
cd frontend
npm start
```

---

## 🔐 Admin Login Credentials

**Username:** `admin`  
**Password:** `@!$%^&*(Axcd)`

These are exactly the same as before - your password hash was preserved during migration.

---

## 📊 What Was Migrated

| Data Type | Count |
|-----------|-------|
| Admins | 1 |
| Appointments | 23 |
| Offers | 2 |
| Team Members | 1 |
| Services | 0 |
| Portfolios | 0 |

Total: **27 records** successfully transferred with all relationships preserved.

---

## 🗄️ Database File Location

```
backend/database/diagonal_construction.sqlite
```

This single file contains your entire database. You can:
- Copy it for backups
- Move it between computers
- View it with [DB Browser for SQLite](https://sqlitebrowser.org/)

---

## 🧪 Test Your API

### 1. Health Check
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

Expected response:
```json
{
  "message": "API is running",
  "database": "connected"
}
```

### 2. Admin Login
```bash
# PowerShell
$body = @{
    username = "admin"
    password = "@!$%^&*(Axcd)"
} | ConvertTo-Json

$headers = @{ "Content-Type" = "application/json" }

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Body $body -Headers $headers
```

### 3. Get Appointments
```bash
Invoke-RestMethod -Uri "http://localhost:5000/api/appointments"
```

---

## ⚠️ Important Notes

1. **PostgreSQL is Still Running** - Your original Docker container is unchanged  
2. **Backups Saved** - Original models are in `backend/models_backup_postgres/`  
3. **ID Mapping Available** - See `backend/database/id_mapping.json` for UUID→INTEGER conversions  
4. **No Frontend Changes Needed** - All API endpoints work exactly the same  

---

## 🌐 Deploy to VPS (When Ready)

Your VPS: `135.181.38.171`

### Quick Deploy Steps:

1. **Copy database file:**
```bash
scp backend/database/diagonal_construction.sqlite root@135.181.38.171:/root/diagonal/backend/database/
```

2. **Update .env on VPS:**
```bash
ssh root@135.181.38.171
cd /root/diagonal/backend
nano .env
```
Replace PostgreSQL vars with:
```env
DB_STORAGE=./database/diagonal_construction.sqlite
```

3. **Restart backend:**
```bash
pm2 restart backend
```

4. **Stop PostgreSQL (optional):**
```bash
docker stop diagonal-postgres
```

---

## 📁 File Changes Summary

### Modified Files:
- `backend/models/index.js` - SQLite configuration
- `backend/models/Admin.js` - INTEGER IDs
- `backend/models/Appointment.js` - INTEGER IDs  
- `backend/models/Service.js` - INTEGER IDs
- `backend/models/Offer.js` - STRING validation
- `backend/routes/portfolios.js` - Removed sync loop
- `backend/server.js` - Fixed sync configuration
- `backend/.env` - SQLite storage path

### New Files:
- `backend/database/diagonal_construction.sqlite` - Your new database
- `backend/database/id_mapping.json` - UUID→INTEGER mapping
- `backend/migrate-to-sqlite.js` - Migration script (can be deleted)
- `backend/models_backup_postgres/` - Original model backups

### Can Be Deleted (after verification):
- `backend/migrate-to-sqlite.js`
- `backend/test-sqlite.js`
- `backend/test-api.ps1`
- `backend/models_backup_postgres/` (after confirming everything works)

---

## ✅ Everything Works!

- ✅ Authentication system (bcrypt passwords)
- ✅ All CRUD operations
- ✅ File uploads (multer)
- ✅ JWT tokens
- ✅ Rate limiting
- ✅ CORS
- ✅ All API routes
- ✅ Foreign key relationships
- ✅ JSON fields

**Your website functionality is 100% preserved!**

---

## 🆘 Troubleshooting

### Server won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <process_id> /F
```

### Can't login?
- Username must be exactly: `admin`
- Password must be exactly: `@!$%^&*(Axcd)`
- These are case-sensitive!

### Database file missing?
The file should auto-create. If not:
```bash
cd backend
mkdir database
node migrate-to-sqlite.js
```

---

## 📚 More Information

See `MIGRATION_COMPLETE.md` for detailed technical information about the migration process.

---

**You're all set! Your backend is now running on SQLite.** 🎉
