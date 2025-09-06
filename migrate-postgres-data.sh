#!/bin/bash

set -e

# =====================================================
#   PostgreSQL Data Migration Script
#   Migrates data from source DB to Ubuntu server DB
# =====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   PostgreSQL Data Migration Tool${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Configuration
UBUNTU_SERVER="152.67.4.226"
UBUNTU_USER="ubuntu"
TARGET_DB="skynet_cms"
TARGET_USER="skynet"
TARGET_PASS="skynet2024"

# Function to display usage
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  local-export    - Export from local PostgreSQL"
    echo "  remote-export   - Export from remote PostgreSQL"
    echo "  import-only     - Import existing dump file to Ubuntu server"
    echo "  full-migration  - Complete migration (export + import)"
    echo ""
    echo "Example:"
    echo "  $0 local-export"
    echo "  $0 remote-export"
}

# Function to export from local PostgreSQL
export_local() {
    echo -e "${YELLOW}Exporting from local PostgreSQL...${NC}"
    
    # Get local database details
    read -p "Enter local database name [skynet_cms]: " LOCAL_DB
    LOCAL_DB=${LOCAL_DB:-skynet_cms}
    
    read -p "Enter local database user [postgres]: " LOCAL_USER
    LOCAL_USER=${LOCAL_USER:-postgres}
    
    read -sp "Enter local database password (press Enter if none): " LOCAL_PASS
    echo ""
    
    # Export database
    DUMP_FILE="skynet_cms_dump_$(date +%Y%m%d_%H%M%S).sql"
    
    echo -e "${YELLOW}Creating database dump: ${DUMP_FILE}${NC}"
    
    if [ -z "$LOCAL_PASS" ]; then
        pg_dump -U $LOCAL_USER -d $LOCAL_DB -h localhost --clean --if-exists --no-owner --no-acl -f $DUMP_FILE
    else
        PGPASSWORD=$LOCAL_PASS pg_dump -U $LOCAL_USER -d $LOCAL_DB -h localhost --clean --if-exists --no-owner --no-acl -f $DUMP_FILE
    fi
    
    echo -e "${GREEN}✓ Database exported to: ${DUMP_FILE}${NC}"
    echo "  File size: $(du -h $DUMP_FILE | cut -f1)"
    echo ""
    
    # Ask if user wants to transfer and import
    read -p "Transfer and import to Ubuntu server? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        transfer_and_import $DUMP_FILE
    else
        echo -e "${YELLOW}To manually transfer and import:${NC}"
        echo "  1. Transfer: scp $DUMP_FILE $UBUNTU_USER@$UBUNTU_SERVER:~/"
        echo "  2. Import: ssh $UBUNTU_USER@$UBUNTU_SERVER 'PGPASSWORD=$TARGET_PASS psql -U $TARGET_USER -d $TARGET_DB -f ~/$DUMP_FILE'"
    fi
}

# Function to export from remote PostgreSQL
export_remote() {
    echo -e "${YELLOW}Exporting from remote PostgreSQL...${NC}"
    
    # Get remote database details
    read -p "Enter remote host/IP: " REMOTE_HOST
    read -p "Enter remote database name [skynet_cms]: " REMOTE_DB
    REMOTE_DB=${REMOTE_DB:-skynet_cms}
    
    read -p "Enter remote database user [postgres]: " REMOTE_USER
    REMOTE_USER=${REMOTE_USER:-postgres}
    
    read -sp "Enter remote database password: " REMOTE_PASS
    echo ""
    
    read -p "Enter remote database port [5432]: " REMOTE_PORT
    REMOTE_PORT=${REMOTE_PORT:-5432}
    
    # Export database
    DUMP_FILE="skynet_cms_dump_$(date +%Y%m%d_%H%M%S).sql"
    
    echo -e "${YELLOW}Creating database dump from remote: ${DUMP_FILE}${NC}"
    
    PGPASSWORD=$REMOTE_PASS pg_dump -U $REMOTE_USER -d $REMOTE_DB -h $REMOTE_HOST -p $REMOTE_PORT \
        --clean --if-exists --no-owner --no-acl -f $DUMP_FILE
    
    echo -e "${GREEN}✓ Database exported to: ${DUMP_FILE}${NC}"
    echo "  File size: $(du -h $DUMP_FILE | cut -f1)"
    echo ""
    
    # Transfer and import
    transfer_and_import $DUMP_FILE
}

# Function to transfer and import
transfer_and_import() {
    local DUMP_FILE=$1
    
    echo -e "${YELLOW}Transferring dump file to Ubuntu server...${NC}"
    scp $DUMP_FILE $UBUNTU_USER@$UBUNTU_SERVER:~/
    
    echo -e "${GREEN}✓ File transferred${NC}"
    echo ""
    
    echo -e "${YELLOW}Importing data to Ubuntu server PostgreSQL...${NC}"
    
    # Create import script on server
    ssh $UBUNTU_USER@$UBUNTU_SERVER << 'REMOTE_SCRIPT'
#!/bin/bash
DUMP_FILE=$(ls -t ~/skynet_cms_dump_*.sql | head -1)
TARGET_DB="skynet_cms"
TARGET_USER="skynet"
TARGET_PASS="skynet2024"

echo "Preparing database for import..."

# Stop services to prevent conflicts
pm2 stop skynet-cms 2>/dev/null || true

# Backup current database (just in case)
BACKUP_FILE="skynet_cms_backup_$(date +%Y%m%d_%H%M%S).sql"
echo "Creating backup of current database..."
sudo -u postgres pg_dump $TARGET_DB > ~/$BACKUP_FILE 2>/dev/null || echo "No existing data to backup"

# Import the dump
echo "Importing data..."
PGPASSWORD=$TARGET_PASS psql -U $TARGET_USER -d $TARGET_DB -h localhost -f $DUMP_FILE

# Verify import
echo ""
echo "Verifying import..."
PGPASSWORD=$TARGET_PASS psql -U $TARGET_USER -d $TARGET_DB -h localhost -c "\dt" | head -20

# Restart services
echo "Restarting services..."
pm2 restart skynet-cms
pm2 restart skynet-frontend

echo ""
echo "Migration completed!"
echo "Dump file: $DUMP_FILE"
echo "Backup file: $BACKUP_FILE (if any)"
REMOTE_SCRIPT
    
    echo -e "${GREEN}✓ Data migration completed!${NC}"
    echo ""
    echo -e "${YELLOW}Verify your site:${NC}"
    echo "  Frontend: http://$UBUNTU_SERVER"
    echo "  CMS Admin: http://$UBUNTU_SERVER/admin"
}

# Function to import existing dump
import_only() {
    echo -e "${YELLOW}Import existing dump file${NC}"
    
    # List available dump files
    echo "Available dump files:"
    ls -la *.sql 2>/dev/null || echo "No .sql files found in current directory"
    echo ""
    
    read -p "Enter dump file name: " DUMP_FILE
    
    if [ ! -f "$DUMP_FILE" ]; then
        echo -e "${RED}Error: File $DUMP_FILE not found${NC}"
        exit 1
    fi
    
    transfer_and_import $DUMP_FILE
}

# Function for full migration with guided steps
full_migration() {
    echo -e "${BLUE}Full Migration Process${NC}"
    echo ""
    echo "Where is your source PostgreSQL database?"
    echo "1) On this local machine"
    echo "2) On a remote server"
    echo "3) I have a dump file ready"
    echo ""
    read -p "Select option (1-3): " OPTION
    
    case $OPTION in
        1)
            export_local
            ;;
        2)
            export_remote
            ;;
        3)
            import_only
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            exit 1
            ;;
    esac
}

# Main script logic
case "${1:-}" in
    local-export)
        export_local
        ;;
    remote-export)
        export_remote
        ;;
    import-only)
        import_only
        ;;
    full-migration)
        full_migration
        ;;
    *)
        show_usage
        echo ""
        full_migration
        ;;
esac