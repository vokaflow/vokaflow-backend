#!/bin/bash
# setup_services.sh - Script to set up and configure services for Vokaflow 2.0
# Run this script after configuring environment variables

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Log functions
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root"
  exit 1
fi

# Environment file path
ENV_FILE="/opt/vokaflow/.env"

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
  error "Environment file not found at $ENV_FILE"
  info "Please run the configure_environment.sh script first"
  exit 1
fi

# Load environment variables
source "$ENV_FILE"

# Function to prompt for confirmation
confirm() {
  local prompt="$1"
  local default="$2"
  
  if [ "$default" = "Y" ]; then
    local options="[Y/n]"
  else
    local options="[y/N]"
  fi
  
  read -p "$prompt $options " response
  
  if [ -z "$response" ]; then
    response="$default"
  fi
  
  if [[ "$response" =~ ^[Yy]$ ]]; then
    return 0
  else
    return 1
  fi
}

# Main script
log "Starting Vokaflow 2.0 Service Setup"
echo

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
  info "Changing to Vokaflow directory..."
  cd /opt/vokaflow || { error "Could not change to /opt/vokaflow directory"; exit 1; }
fi

# 1. Set up PostgreSQL
if confirm "Would you like to set up PostgreSQL?" "Y"; then
  log "Setting up PostgreSQL..."
  
  # Wait for PostgreSQL to be ready
  info "Waiting for PostgreSQL to be ready..."
  for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U vokaflow > /dev/null 2>&1; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo
  
  if docker-compose exec -T postgres pg_isready -U vokaflow > /dev/null 2>&1; then
    log "PostgreSQL is ready"
    
    # Create initial database schema
    info "Creating initial database schema..."
    docker-compose exec -T postgres psql -U vokaflow -c "
    CREATE TABLE IF NOT EXISTS version (
      id SERIAL PRIMARY KEY,
      version VARCHAR(50) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO version (version) VALUES ('2.0.0') ON CONFLICT DO NOTHING;
    " > /dev/null
    
    log "PostgreSQL setup completed"
  else
    warning "PostgreSQL is not ready. Skipping setup."
  fi
fi

# 2. Set up RabbitMQ
if confirm "Would you like to set up RabbitMQ?" "Y"; then
  log "Setting up RabbitMQ..."
  
  # Wait for RabbitMQ to be ready
  info "Waiting for RabbitMQ to be ready..."
  for i in {1..60}; do
    if docker-compose exec -T rabbitmq rabbitmqctl status > /dev/null 2>&1; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo
  
  if docker-compose exec -T rabbitmq rabbitmqctl status > /dev/null 2>&1; then
    log "RabbitMQ is ready"
    
    # Create vhost and queues
    info "Creating RabbitMQ vhost and queues..."
    docker-compose exec -T rabbitmq rabbitmqctl add_vhost vokaflow || true
    docker-compose exec -T rabbitmq rabbitmqctl set_permissions -p vokaflow "$RABBITMQ_DEFAULT_USER" ".*" ".*" ".*" || true
    
    # Check if rabbitmqadmin is available
    if docker-compose exec -T rabbitmq which rabbitmqadmin > /dev/null 2>&1; then
      docker-compose exec -T rabbitmq rabbitmqadmin declare exchange name=vokaflow.events type=topic || true
      docker-compose exec -T rabbitmq rabbitmqadmin declare queue name=vokaflow.transcription || true
      docker-compose exec -T rabbitmq rabbitmqadmin declare queue name=vokaflow.translation || true
      docker-compose exec -T rabbitmq rabbitmqadmin declare queue name=vokaflow.synthesis || true
    else
      warning "rabbitmqadmin not found. Skipping queue creation."
    fi
    
    log "RabbitMQ setup completed"
  else
    warning "RabbitMQ is not ready. Skipping setup."
  fi
fi

# 3. Set up MinIO
if confirm "Would you like to set up MinIO?" "Y"; then
  log "Setting up MinIO..."
  
  # Wait for MinIO to be ready
  info "Waiting for MinIO to be ready..."
  for i in {1..30}; do
    if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo
  
  if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    log "MinIO is ready"
    
    # Check if mc (MinIO Client) is installed
    if command -v mc > /dev/null; then
      info "Configuring MinIO using mc..."
      
      # Configure MinIO Client
      mc alias set vokaflow-local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" > /dev/null 2>&1 || true
      
      # Create buckets
      mc mb --ignore-existing vokaflow-local/voices > /dev/null 2>&1 || true
      mc mb --ignore-existing vokaflow-local/recordings > /dev/null 2>&1 || true
      mc mb --ignore-existing vokaflow-local/transcriptions > /dev/null 2>&1 || true
      mc mb --ignore-existing vokaflow-local/backups > /dev/null 2>&1 || true
      
      log "MinIO buckets created"
    else
      warning "MinIO Client (mc) not found. Skipping bucket creation."
      info "You can install mc with: wget https://dl.min.io/client/mc/release/linux-amd64/mc && chmod +x mc && sudo mv mc /usr/local/bin/"
    fi
    
    log "MinIO setup completed"
  else
    warning "MinIO is not ready. Skipping setup."
  fi
fi

# 4. Set up Vault
if confirm "Would you like to set up HashiCorp Vault?" "Y"; then
  log "Setting up HashiCorp Vault..."
  
  # Check if Vault is running
  if curl -s "$VAULT_ADDR/v1/sys/health" > /dev/null 2>&1; then
    log "Vault is running"
    
    # Check if Vault CLI is installed
    if command -v vault > /dev/null; then
      info "Configuring Vault..."
      
      # Set environment variables for Vault CLI
      export VAULT_ADDR="$VAULT_ADDR"
      export VAULT_TOKEN="$VAULT_TOKEN"
      
      # Create Vault policy
      mkdir -p /opt/vokaflow/config/vault
      cat > /opt/vokaflow/config/vault/vokaflow-policy.hcl << EOF
path "prod/data/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF
      
      # Check if KV secrets engine is enabled
      if ! vault secrets list | grep -q "^prod/"; then
        info "Enabling KV secrets engine at 'prod'"
        vault secrets enable -path=prod kv-v2 || true
      fi
      
      info "Creating Vault policy"
      vault policy write vokaflow /opt/vokaflow/config/vault/vokaflow-policy.hcl || true
      
      # Store initial secrets
      info "Storing initial secrets in Vault"
      vault kv put prod/database/postgres username="$POSTGRES_USER" password="$POSTGRES_PASSWORD" || true
      vault kv put prod/rabbitmq username="$RABBITMQ_DEFAULT_USER" password="$RABBITMQ_DEFAULT_PASS" || true
      vault kv put prod/minio access_key="$MINIO_ROOT_USER" secret_key="$MINIO_ROOT_PASSWORD" || true
      
      log "Vault configuration completed"
    else
      warning "Vault CLI not found. Skipping Vault configuration."
      info "You can install Vault with: curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - && sudo apt-add-repository \"deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main\" && sudo apt-get update && sudo apt-get install vault"
    fi
  else
    warning "Vault is not running. Skipping setup."
  fi
fi

# 5. Set up SSL certificates
if confirm "Would you like to set up SSL certificates with Let's Encrypt?" "Y"; then
  log "Setting up SSL certificates..."
  
  # Check if certbot is installed
  if command -v certbot > /dev/null; then
    info "Certbot is installed"
    
    # Prompt for domain
    read -p "Enter your domain name (e.g., vokaflow.example.com): " domain_name
    
    if [ -n "$domain_name" ]; then
      # Create webroot directory
      mkdir -p /opt/vokaflow/config/certbot/www
      
      # Get SSL certificates
      info "Getting SSL certificates for $domain_name..."
      certbot certonly --webroot -w /opt/vokaflow/config/certbot/www -d "$domain_name" || true
      
      # Update Nginx configuration
      if [ -f "/opt/vokaflow/config/nginx/default.conf" ]; then
        sed -i "s/your-domain.com/$domain_name/g" /opt/vokaflow/config/nginx/default.conf
        log "Updated Nginx configuration with domain: $domain_name"
      fi
      
      # Set up automatic renewal
      if ! crontab -l | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null || echo "") | { cat; echo "0 0 * * * certbot renew --quiet"; } | crontab -
        log "Set up automatic renewal cron job"
      fi
      
      log "SSL certificate setup completed"
    else
      warning "No domain provided. Skipping SSL certificate setup."
    fi
  else
    warning "Certbot is not installed. Skipping SSL certificate setup."
    info "You can install Certbot with: sudo apt-get update && sudo apt-get install certbot python3-certbot-nginx"
  fi
fi

# 6. Set up AI models
if confirm "Would you like to download AI models?" "Y"; then
  log "Setting up AI models..."
  
  # Check if Hugging Face token is set
  if [ -z "$HUGGINGFACE_TOKEN" ]; then
    warning "HUGGINGFACE_TOKEN is not set. Some models may not be downloadable."
    read -s -p "Enter your Hugging Face token (or press Enter to skip): " huggingface_token
    echo
    
    if [ -n "$huggingface_token" ]; then
      export HUGGINGFACE_TOKEN="$huggingface_token"
      update_env_var "HUGGINGFACE_TOKEN" "$huggingface_token" "Hugging Face token for downloading models"
    fi
  fi
  
  # Create model directories
  mkdir -p /opt/vokaflow/models/whisper
  mkdir -p /opt/vokaflow/models/qwen
  mkdir -p /opt/vokaflow/models/nllb
  mkdir -p /opt/vokaflow/models/ocr
  
  # Check if download_models.sh exists
  if [ -f "/opt/vokaflow/scripts/download_models.sh" ]; then
    info "Running model download script..."
    bash /opt/vokaflow/scripts/download_models.sh
    log "AI models setup completed"
  else
    warning "Model download script not found. Skipping AI models setup."
    info "You can create a model download script at /opt/vokaflow/scripts/download_models.sh"
  fi
fi

# 7. Create admin user
if confirm "Would you like to create an admin user?" "Y"; then
  log "Creating admin user..."
  
  # Prompt for admin email and password
  read -p "Enter admin email (default: admin@vokaflow.com): " admin_email
  admin_email=${admin_email:-admin@vokaflow.com}
  
  read -s -p "Enter admin password (default: admin): " admin_password
  echo
  admin_password=${admin_password:-admin}
  
  # Create admin user
  info "Creating admin user with email: $admin_email"
  docker-compose exec -T api python -c "
from db.session import SessionLocal
from models.user import User
from core.auth.password import get_password_hash

db = SessionLocal()
admin = User(
    email='$admin_email',
    hashed_password=get_password_hash('$admin_password'),
    full_name='Admin User',
    is_active=True,
    is_superuser=True
)
db.add(admin)
db.commit()
db.close()
print('Admin user created')
" || warning "Failed to create admin user"
  
  log "Admin user creation completed"
fi

# 8. Set up backup system
if confirm "Would you like to set up the backup system?" "Y"; then
  log "Setting up backup system..."
  
  # Create backup directories
  mkdir -p /mnt/backup/database
  mkdir -p /mnt/backup/system
  mkdir -p /mnt/backup/logs
  
  # Create backup script
  mkdir -p /opt/vokaflow/scripts/maintenance
  cat > /opt/vokaflow/scripts/maintenance/backup.sh << 'EOF'
#!/bin/bash
# Backup script for Vokaflow 2.0

set -e

# Backup timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/mnt/backup"
DB_BACKUP_DIR="$BACKUP_DIR/database"
SYSTEM_BACKUP_DIR="$BACKUP_DIR/system"
LOG_BACKUP_DIR="$BACKUP_DIR/logs"

# Create backup directories
mkdir -p $DB_BACKUP_DIR
mkdir -p $SYSTEM_BACKUP_DIR
mkdir -p $LOG_BACKUP_DIR

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker exec vokaflow-postgres pg_dump -U vokaflow -d vokaflow | gzip > "$DB_BACKUP_DIR/postgres_$TIMESTAMP.sql.gz"

# Backup Redis
echo "Backing up Redis..."
docker exec vokaflow-redis redis-cli SAVE
docker cp vokaflow-redis:/data/dump.rdb "$DB_BACKUP_DIR/redis_$TIMESTAMP.rdb"

# Backup configuration
echo "Backing up configuration..."
tar -czf "$SYSTEM_BACKUP_DIR/config_$TIMESTAMP.tar.gz" -C /opt/vokaflow config

# Backup environment variables
cp /opt/vokaflow/.env "$SYSTEM_BACKUP_DIR/env_$TIMESTAMP.backup"

# Backup logs (last 7 days)
echo "Backing up logs..."
find /opt/vokaflow/logs -type f -mtime -7 -name "*.log" | tar -czf "$LOG_BACKUP_DIR/logs_$TIMESTAMP.tar.gz" -T -

# Cleanup old backups (keep last 30 days)
find $DB_BACKUP_DIR -type f -mtime +30 -delete
find $SYSTEM_BACKUP_DIR -type f -mtime +30 -delete
find $LOG_BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed at $(date)"
EOF
  
  chmod +x /opt/vokaflow/scripts/maintenance/backup.sh
  
  # Set up cron job for daily backups
  if ! crontab -l | grep -q "/opt/vokaflow/scripts/maintenance/backup.sh"; then
    (crontab -l 2>/dev/null || echo "") | { cat; echo "0 2 * * * /opt/vokaflow/scripts/maintenance/backup.sh >> /opt/vokaflow/logs/backup.log 2>&1"; } | crontab -
    log "Set up daily backup cron job at 2 AM"
  fi
  
  log "Backup system setup completed"
fi

# 9. Restart services
if confirm "Would you like to restart services to apply all changes?" "Y"; then
  log "Restarting services..."
  docker-compose restart
  log "Services restarted"
fi

# Summary
echo
log "Service Setup Summary"
echo "===================="
echo "The following services have been set up for Vokaflow 2.0:"
echo "- PostgreSQL: Database for storing application data"
echo "- RabbitMQ: Message queue for asynchronous processing"
echo "- MinIO: Object storage for files and media"
echo "- Vault: Secrets management"
echo "- SSL Certificates: Secure communication"
echo "- AI Models: Speech recognition, text-to-speech, and language models"
echo "- Admin User: Administrative access to the system"
echo "- Backup System: Regular backups of critical data"
echo

# Next steps
log "Next Steps:"
echo "1. Verify the installation with: ./scripts/verify_installation.sh"
echo "2. Access the API at: https://your-domain.com/api"
echo "3. Access Grafana at: https://your-domain.com/grafana"
echo "4. Check service logs with: docker-compose logs -f [service_name]"

log "Vokaflow 2.0 service setup completed"
exit 0
