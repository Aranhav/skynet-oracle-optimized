#!/bin/bash

# =====================================================
#   Run this script ON YOUR UBUNTU SERVER
#   Direct PostgreSQL migration script
# =====================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   PostgreSQL Migration (Ubuntu Server)${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Local database config (on Ubuntu server)
LOCAL_DB="skynet_cms"
LOCAL_USER="skynet"
LOCAL_PASS="skynet2024"

# Method 1: Direct server-to-server migration
method_direct() {
    echo -e "${YELLOW}Method 1: Direct PostgreSQL to PostgreSQL Migration${NC}"
    echo ""
    echo "Enter SOURCE database details:"
    read -p "Source Host/IP: " SOURCE_HOST
    read -p "Source Port [5432]: " SOURCE_PORT
    SOURCE_PORT=${SOURCE_PORT:-5432}
    read -p "Source Database [skynet_cms]: " SOURCE_DB
    SOURCE_DB=${SOURCE_DB:-skynet_cms}
    read -p "Source Username [postgres]: " SOURCE_USER
    SOURCE_USER=${SOURCE_USER:-postgres}
    read -sp "Source Password: " SOURCE_PASS
    echo ""
    echo ""
    
    # Stop CMS to prevent conflicts
    echo -e "${YELLOW}Stopping CMS service...${NC}"
    pm2 stop skynet-cms 2>/dev/null || true
    
    # Backup current database
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}Backing up current database...${NC}"
    sudo -u postgres pg_dump $LOCAL_DB > ~/$BACKUP_FILE 2>/dev/null || echo "No existing data to backup"
    
    # Create dump from source
    DUMP_FILE="migration_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}Extracting data from source database...${NC}"
    PGPASSWORD=$SOURCE_PASS pg_dump -h $SOURCE_HOST -p $SOURCE_PORT -U $SOURCE_USER -d $SOURCE_DB \
        --clean --if-exists --no-owner --no-acl > ~/$DUMP_FILE
    
    echo -e "${GREEN}✓ Data extracted ($(du -h ~/$DUMP_FILE | cut -f1))${NC}"
    
    # Import to local database
    echo -e "${YELLOW}Importing to local PostgreSQL...${NC}"
    PGPASSWORD=$LOCAL_PASS psql -U $LOCAL_USER -d $LOCAL_DB -h localhost < ~/$DUMP_FILE
    
    # Verify migration
    echo -e "${YELLOW}Verifying migration...${NC}"
    echo "Tables in database:"
    PGPASSWORD=$LOCAL_PASS psql -U $LOCAL_USER -d $LOCAL_DB -h localhost -c "\dt" | head -20
    
    # Restart CMS
    echo -e "${YELLOW}Restarting services...${NC}"
    pm2 restart skynet-cms
    pm2 restart skynet-frontend
    
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo "Backup saved as: ~/$BACKUP_FILE"
    echo "Migration dump: ~/$DUMP_FILE"
}

# Method 2: Import from uploaded file
method_file() {
    echo -e "${YELLOW}Method 2: Import from SQL dump file${NC}"
    echo ""
    echo "Available SQL files in home directory:"
    ls -la ~/*.sql 2>/dev/null || echo "No SQL files found"
    echo ""
    read -p "Enter filename (or full path): " DUMP_FILE
    
    # Check if file exists
    if [ ! -f "$DUMP_FILE" ]; then
        if [ -f ~/"$DUMP_FILE" ]; then
            DUMP_FILE=~/"$DUMP_FILE"
        else
            echo -e "${RED}Error: File not found${NC}"
            exit 1
        fi
    fi
    
    # Stop CMS
    echo -e "${YELLOW}Stopping CMS service...${NC}"
    pm2 stop skynet-cms 2>/dev/null || true
    
    # Backup current database
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}Backing up current database...${NC}"
    sudo -u postgres pg_dump $LOCAL_DB > ~/$BACKUP_FILE 2>/dev/null || echo "No existing data to backup"
    
    # Import dump
    echo -e "${YELLOW}Importing database dump...${NC}"
    PGPASSWORD=$LOCAL_PASS psql -U $LOCAL_USER -d $LOCAL_DB -h localhost < $DUMP_FILE
    
    # Verify
    echo -e "${YELLOW}Verifying import...${NC}"
    PGPASSWORD=$LOCAL_PASS psql -U $LOCAL_USER -d $LOCAL_DB -h localhost -c "\dt" | head -20
    
    # Restart services
    echo -e "${YELLOW}Restarting services...${NC}"
    pm2 restart skynet-cms
    pm2 restart skynet-frontend
    
    echo -e "${GREEN}✓ Import completed!${NC}"
}

# Method 3: Quick migration from common sources
method_quick() {
    echo -e "${YELLOW}Method 3: Quick Migration Templates${NC}"
    echo ""
    echo "Select your source:"
    echo "1) Local development (localhost)"
    echo "2) Docker container"
    echo "3) Another cloud server"
    echo "4) Railway/Render/Heroku PostgreSQL"
    echo ""
    read -p "Select option (1-4): " OPTION
    
    case $OPTION in
        1)
            echo "Migrating from localhost..."
            SOURCE_HOST="localhost"
            SOURCE_PORT="5432"
            ;;
        2)
            echo "Migrating from Docker..."
            read -p "Container name or ID: " CONTAINER
            # Create dump from docker
            docker exec $CONTAINER pg_dump -U postgres skynet_cms > ~/docker_dump.sql
            DUMP_FILE=~/docker_dump.sql
            method_file
            return
            ;;
        3)
            method_direct
            return
            ;;
        4)
            echo "For Railway/Render/Heroku:"
            echo "1. Get your database URL from the platform"
            echo "2. It looks like: postgres://user:pass@host:port/database"
            read -p "Enter database URL: " DB_URL
            # Parse URL and use pg_dump
            DUMP_FILE="cloud_dump_$(date +%Y%m%d).sql"
            pg_dump "$DB_URL" --clean --if-exists --no-owner --no-acl > ~/$DUMP_FILE
            DUMP_FILE=~/$DUMP_FILE
            method_file
            return
            ;;
    esac
    
    read -p "Source Database [skynet_cms]: " SOURCE_DB
    SOURCE_DB=${SOURCE_DB:-skynet_cms}
    read -p "Source Username [postgres]: " SOURCE_USER
    SOURCE_USER=${SOURCE_USER:-postgres}
    read -sp "Source Password: " SOURCE_PASS
    echo ""
    
    # Use direct method with these values
    method_direct
}

# Main menu
echo "How do you want to migrate data?"
echo ""
echo "1) Direct migration from another PostgreSQL server"
echo "2) Import from SQL dump file"  
echo "3) Quick templates (localhost/Docker/Cloud)"
echo ""
read -p "Select method (1-3): " METHOD

case $METHOD in
    1)
        method_direct
        ;;
    2)
        method_file
        ;;
    3)
        method_quick
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Testing site access...${NC}"
curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "CMS HTTP Status: %{http_code}\n" http://localhost:1337/admin
echo ""
echo -e "${GREEN}Migration complete! Check your site at:${NC}"
echo "  http://152.67.4.226"
echo "  http://152.67.4.226/admin"