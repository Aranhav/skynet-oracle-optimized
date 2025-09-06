# PostgreSQL Data Migration Guide

## Quick Start (Choose Your Method)

### Method 1: From Your Local Machine to Ubuntu Server

**On your local machine:**
```bash
# 1. Export your local database
pg_dump -U postgres -d skynet_cms --clean --if-exists --no-owner --no-acl > skynet_dump.sql

# 2. Transfer to Ubuntu server
scp skynet_dump.sql ubuntu@152.67.4.226:~/

# 3. SSH into server and import
ssh ubuntu@152.67.4.226
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost < ~/skynet_dump.sql
```

### Method 2: Direct Server-to-Server Migration

**On Ubuntu server (152.67.4.226):**
```bash
# 1. Download and run migration script
wget https://raw.githubusercontent.com/Aranhav/skynet-oracle-optimized/main/ubuntu-migrate-postgres.sh
chmod +x ubuntu-migrate-postgres.sh
./ubuntu-migrate-postgres.sh

# 2. Select option 1 for direct migration
# 3. Enter source database details
```

### Method 3: Using Docker Database

**If your data is in Docker:**
```bash
# 1. Export from Docker container
docker exec your-postgres-container pg_dump -U postgres skynet_cms > skynet_dump.sql

# 2. Transfer to Ubuntu server
scp skynet_dump.sql ubuntu@152.67.4.226:~/

# 3. Import on server
ssh ubuntu@152.67.4.226
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost < ~/skynet_dump.sql
```

## One-Line Migration Commands

### Export from local PostgreSQL (run locally):
```bash
PGPASSWORD=yourpass pg_dump -U postgres -d skynet_cms -h localhost --clean --no-owner --no-acl | ssh ubuntu@152.67.4.226 "PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost"
```

### Export from remote PostgreSQL (run on Ubuntu):
```bash
# Replace SOURCE_HOST, SOURCE_USER, SOURCE_PASS with your values
PGPASSWORD=SOURCE_PASS pg_dump -h SOURCE_HOST -U SOURCE_USER -d skynet_cms --clean --no-owner --no-acl | PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost
```

## Full Migration Script Usage

### On Local Machine:
```bash
# Run the comprehensive migration script
./migrate-postgres-data.sh

# It will guide you through:
# 1. Exporting from local/remote PostgreSQL
# 2. Automatically transferring to Ubuntu server
# 3. Importing and restarting services
```

### On Ubuntu Server:
```bash
# Copy script to server
scp ubuntu-migrate-postgres.sh ubuntu@152.67.4.226:~/

# SSH and run
ssh ubuntu@152.67.4.226
chmod +x ubuntu-migrate-postgres.sh
./ubuntu-migrate-postgres.sh
```

## Manual Step-by-Step Process

### Step 1: Export Data from Source
```bash
# Basic export
pg_dump -U postgres -d skynet_cms > dump.sql

# Export with all options
pg_dump \
  -U postgres \
  -d skynet_cms \
  -h localhost \
  --clean \           # Drop objects before creating
  --if-exists \       # Use IF EXISTS when dropping
  --no-owner \        # Don't output owner commands
  --no-acl \          # Don't output access privileges
  --verbose \         # Show progress
  > skynet_cms_dump.sql
```

### Step 2: Transfer File
```bash
# Using SCP
scp skynet_cms_dump.sql ubuntu@152.67.4.226:~/

# Using rsync (better for large files)
rsync -avz --progress skynet_cms_dump.sql ubuntu@152.67.4.226:~/
```

### Step 3: Import on Ubuntu Server
```bash
# SSH into server
ssh ubuntu@152.67.4.226

# Stop CMS to prevent conflicts
pm2 stop skynet-cms

# Import the dump
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost < ~/skynet_cms_dump.sql

# Restart services
pm2 restart all
```

## Verify Migration Success

```bash
# Check tables
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost -c "\dt"

# Count records in key tables
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost -c "
  SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
  UNION ALL
  SELECT 'files', COUNT(*) FROM files
  UNION ALL  
  SELECT 'i18n_locale', COUNT(*) FROM i18n_locale;
"

# Check CMS admin access
curl -I http://152.67.4.226/admin

# View logs
pm2 logs skynet-cms --lines 50
```

## Troubleshooting

### Error: "permission denied for schema public"
```bash
sudo -u postgres psql -d skynet_cms -c "
  GRANT ALL ON SCHEMA public TO skynet;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO skynet;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO skynet;
"
```

### Error: "database skynet_cms does not exist"
```bash
sudo -u postgres psql -c "CREATE DATABASE skynet_cms OWNER skynet;"
```

### Error: "role skynet does not exist"
```bash
sudo -u postgres psql -c "
  CREATE USER skynet WITH PASSWORD 'skynet2024';
  ALTER USER skynet CREATEDB;
"
```

### Reset Everything and Start Fresh
```bash
# Nuclear option - complete reset
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS skynet_cms;
DROP USER IF EXISTS skynet;
CREATE USER skynet WITH PASSWORD 'skynet2024';
CREATE DATABASE skynet_cms OWNER skynet;
GRANT ALL PRIVILEGES ON DATABASE skynet_cms TO skynet;
EOF

# Then import your dump
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost < ~/skynet_cms_dump.sql
```

## Quick Commands Reference

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database size
sudo -u postgres psql -c "SELECT pg_database_size('skynet_cms')/1024/1024 as size_mb;"

# List all tables with row counts
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost -c "
  SELECT schemaname,tablename,n_live_tup as rows 
  FROM pg_stat_user_tables 
  ORDER BY n_live_tup DESC;
"

# Backup before migration
sudo -u postgres pg_dump skynet_cms > ~/backup_before_migration.sql

# Test connection
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost -c "SELECT version();"
```

## Important Notes

1. **Always backup** before importing new data
2. **Stop CMS service** during import to prevent conflicts
3. **Use --clean flag** in pg_dump to replace existing data
4. **Restart services** after import (pm2 restart all)
5. **Verify migration** by checking key tables and accessing CMS

## Database Credentials on Ubuntu Server
- Database: `skynet_cms`
- Username: `skynet`
- Password: `skynet2024`
- Host: `localhost`
- Port: `5432`