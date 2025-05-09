#!/bin/bash
# configure_environment.sh - Interactive script to configure environment variables for Vokaflow 2.0
# Run this script after the complete installation of the backend

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

# Environment file path
ENV_FILE="/opt/vokaflow/.env"
BACKUP_FILE="/opt/vokaflow/.env.backup.$(date +%Y%m%d%H%M%S)"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root"
  exit 1
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
  error "Environment file not found at $ENV_FILE"
  info "Creating a new environment file"
  touch "$ENV_FILE"
else
  # Backup existing environment file
  log "Backing up existing environment file to $BACKUP_FILE"
  cp "$ENV_FILE" "$BACKUP_FILE"
fi

# Function to update environment variable
update_env_var() {
  local var_name="$1"
  local var_value="$2"
  local description="$3"
  
  # Check if variable already exists in the file
  if grep -q "^${var_name}=" "$ENV_FILE"; then
    # Update existing variable
    sed -i "s|^${var_name}=.*|${var_name}=${var_value}|" "$ENV_FILE"
  else
    # Add new variable with description as comment
    echo -e "\n# ${description}" >> "$ENV_FILE"
    echo "${var_name}=${var_value}" >> "$ENV_FILE"
  fi
  
  log "Updated ${var_name} in environment file"
}

# Function to get current value of environment variable
get_env_var() {
  local var_name="$1"
  local default_value="$2"
  
  # Check if variable exists in the file
  if grep -q "^${var_name}=" "$ENV_FILE"; then
    grep "^${var_name}=" "$ENV_FILE" | cut -d '=' -f2
  else
    echo "$default_value"
  fi
}

# Function to prompt for variable
prompt_variable() {
  local var_name="$1"
  local description="$2"
  local default_value="$3"
  local is_password="$4"
  local current_value=""
  
  # Check if variable already exists in the file
  if grep -q "^${var_name}=" "$ENV_FILE"; then
    current_value=$(grep "^${var_name}=" "$ENV_FILE" | cut -d '=' -f2)
  fi
  
  # Display prompt
  echo
  echo -e "${BLUE}=== ${var_name} ===${NC}"
  echo -e "${description}"
  
  if [ -n "$current_value" ]; then
    if [ "$is_password" = "true" ]; then
      echo -e "Current value: [hidden]"
    else
      echo -e "Current value: ${current_value}"
    fi
  fi
  
  if [ -n "$default_value" ] && [ -z "$current_value" ]; then
    echo -e "Default value: ${default_value}"
  fi
  
  # Prompt for input
  local prompt_text="Enter value for ${var_name}"
  if [ -n "$current_value" ]; then
    prompt_text="${prompt_text} (press Enter to keep current value)"
  elif [ -n "$default_value" ]; then
    prompt_text="${prompt_text} (press Enter for default)"
  fi
  prompt_text="${prompt_text}: "
  
  local input=""
  if [ "$is_password" = "true" ]; then
    read -s -p "$prompt_text" input
    echo # Add newline after password input
  else
    read -p "$prompt_text" input
  fi
  
  # Use current value if input is empty
  if [ -z "$input" ] && [ -n "$current_value" ]; then
    input="$current_value"
  # Use default value if input is empty and no current value
  elif [ -z "$input" ] && [ -n "$default_value" ]; then
    input="$default_value"
  fi
  
  # Return the input
  echo "$input"
}

# Function to validate input
validate_not_empty() {
  local input="$1"
  local var_name="$2"
  
  if [ -z "$input" ]; then
    error "${var_name} cannot be empty"
    return 1
  fi
  
  return 0
}

# Function to test connection
test_connection() {
  local service="$1"
  local url="$2"
  local success_msg="$3"
  local error_msg="$4"
  
  info "Testing connection to ${service}..."
  if curl -s --connect-timeout 5 "${url}" > /dev/null; then
    log "${success_msg}"
    return 0
  else
    warning "${error_msg}"
    return 1
  fi
}

# Main script
log "Starting Vokaflow 2.0 Environment Configuration"
log "This script will guide you through setting up the required environment variables"
echo

# Display already configured variables
log "The following variables are already configured:"
echo "- ENVIRONMENT: $(get_env_var 'ENVIRONMENT' 'production')"
echo "- LOG_LEVEL: $(get_env_var 'LOG_LEVEL' 'INFO')"
echo "- API_WORKERS: $(get_env_var 'API_WORKERS' '4')"
echo "- GOOGLE_CLOUD_API_KEY: [hidden]"
echo "- GOOGLE_CLOUD_PROJECT_ID: $(get_env_var 'GOOGLE_CLOUD_PROJECT_ID' 'vokaflow-c1061')"
echo "- FIREBASE_STORAGE_BUCKET: $(get_env_var 'FIREBASE_STORAGE_BUCKET' 'vokaflow-c1061.appspot.com')"
echo "- FIREBASE_SERVICE_ACCOUNT_PATH: $(get_env_var 'FIREBASE_SERVICE_ACCOUNT_PATH' '/app/config/firebase/service-account.json')"
echo "- WHISPER_MODEL: $(get_env_var 'WHISPER_MODEL' 'medium')"
echo "- QWEN_MODEL: $(get_env_var 'QWEN_MODEL' 'Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4')"
echo "- VAULT_ADDR: $(get_env_var 'VAULT_ADDR' 'http://vault:8200')"
echo "- VAULT_TOKEN: [hidden]"
echo "- VAULT_MOUNT_POINT: $(get_env_var 'VAULT_MOUNT_POINT' 'prod')"
echo "- REDIS_URL: $(get_env_var 'REDIS_URL' 'redis://redis:6379/0')"
echo "- HUGGINGFACE_TOKEN: [hidden]"
echo

# Ensure the directory exists
mkdir -p "$(dirname "$ENV_FILE")"

# Update existing variables
update_env_var "ENVIRONMENT" "$(get_env_var 'ENVIRONMENT' 'production')" "Environment (production, development, staging)"
update_env_var "LOG_LEVEL" "$(get_env_var 'LOG_LEVEL' 'INFO')" "Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)"
update_env_var "API_WORKERS" "$(get_env_var 'API_WORKERS' '4')" "Number of API workers"
update_env_var "GOOGLE_CLOUD_API_KEY" "$(get_env_var 'GOOGLE_CLOUD_API_KEY' 'AIzaSyArwQWi-6QbXja0FWZrVx5p3RsBKGjSxl4')" "Google Cloud API Key"
update_env_var "GOOGLE_CLOUD_PROJECT_ID" "$(get_env_var 'GOOGLE_CLOUD_PROJECT_ID' 'vokaflow-c1061')" "Google Cloud Project ID"
update_env_var "FIREBASE_STORAGE_BUCKET" "$(get_env_var 'FIREBASE_STORAGE_BUCKET' 'vokaflow-c1061.appspot.com')" "Firebase Storage Bucket"
update_env_var "FIREBASE_SERVICE_ACCOUNT_PATH" "$(get_env_var 'FIREBASE_SERVICE_ACCOUNT_PATH' '/app/config/firebase/service-account.json')" "Firebase Service Account Path"
update_env_var "WHISPER_MODEL" "$(get_env_var 'WHISPER_MODEL' 'medium')" "Whisper model size"
update_env_var "QWEN_MODEL" "$(get_env_var 'QWEN_MODEL' 'Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4')" "Qwen model name"
update_env_var "VAULT_ADDR" "$(get_env_var 'VAULT_ADDR' 'http://vault:8200')" "HashiCorp Vault server address"
update_env_var "VAULT_TOKEN" "$(get_env_var 'VAULT_TOKEN' 'your-vault-token')" "HashiCorp Vault token"
update_env_var "VAULT_MOUNT_POINT" "$(get_env_var 'VAULT_MOUNT_POINT' 'prod')" "HashiCorp Vault mount point"
update_env_var "REDIS_URL" "$(get_env_var 'REDIS_URL' 'redis://redis:6379/0')" "Redis URL"
update_env_var "HUGGINGFACE_TOKEN" "$(get_env_var 'HUGGINGFACE_TOKEN' '')" "Hugging Face token for downloading models"

# Prompt for missing variables
log "Now we'll configure the remaining required environment variables"
echo

# 1. PostgreSQL Password (if not already set)
if ! grep -q "^POSTGRES_PASSWORD=" "$ENV_FILE"; then
  POSTGRES_PASSWORD=$(prompt_variable "POSTGRES_PASSWORD" "PostgreSQL database password" "" "true")
  if validate_not_empty "$POSTGRES_PASSWORD" "POSTGRES_PASSWORD"; then
    update_env_var "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD" "PostgreSQL database password"
    
    # Update other PostgreSQL related variables
    update_env_var "POSTGRES_USER" "vokaflow" "PostgreSQL database user"
    update_env_var "POSTGRES_DB" "vokaflow" "PostgreSQL database name"
  else
    warning "Skipping PostgreSQL password configuration"
  fi
else
  log "PostgreSQL password is already configured"
fi

# 2. RabbitMQ Password (if not already set)
if ! grep -q "^RABBITMQ_DEFAULT_PASS=" "$ENV_FILE"; then
  RABBITMQ_PASSWORD=$(prompt_variable "RABBITMQ_DEFAULT_PASS" "RabbitMQ password" "" "true")
  if validate_not_empty "$RABBITMQ_PASSWORD" "RABBITMQ_DEFAULT_PASS"; then
    update_env_var "RABBITMQ_DEFAULT_USER" "vokaflow" "RabbitMQ username"
    update_env_var "RABBITMQ_DEFAULT_PASS" "$RABBITMQ_PASSWORD" "RabbitMQ password"
  else
    warning "Skipping RabbitMQ password configuration"
  fi
else
  log "RabbitMQ password is already configured"
fi

# 3. MinIO Root Password (if not already set)
if ! grep -q "^MINIO_ROOT_PASSWORD=" "$ENV_FILE"; then
  MINIO_ROOT_PASSWORD=$(prompt_variable "MINIO_ROOT_PASSWORD" "MinIO root password" "" "true")
  if validate_not_empty "$MINIO_ROOT_PASSWORD" "MINIO_ROOT_PASSWORD"; then
    update_env_var "MINIO_ROOT_USER" "vokaflow" "MinIO root username"
    update_env_var "MINIO_ROOT_PASSWORD" "$MINIO_ROOT_PASSWORD" "MinIO root password"
  else
    warning "Skipping MinIO root password configuration"
  fi
else
  log "MinIO root password is already configured"
fi

# 4. Grafana Admin User (if not already set)
if ! grep -q "^GRAFANA_ADMIN_USER=" "$ENV_FILE"; then
  GRAFANA_ADMIN_USER=$(prompt_variable "GRAFANA_ADMIN_USER" "Grafana admin username" "admin")
  if validate_not_empty "$GRAFANA_ADMIN_USER" "GRAFANA_ADMIN_USER"; then
    update_env_var "GRAFANA_ADMIN_USER" "$GRAFANA_ADMIN_USER" "Grafana admin username"
  else
    warning "Skipping Grafana admin username configuration"
  fi
else
  log "Grafana admin username is already configured"
fi

# 5. Grafana Admin Password (if not already set)
if ! grep -q "^GRAFANA_ADMIN_PASSWORD=" "$ENV_FILE"; then
  GRAFANA_ADMIN_PASSWORD=$(prompt_variable "GRAFANA_ADMIN_PASSWORD" "Grafana admin password" "" "true")
  if validate_not_empty "$GRAFANA_ADMIN_PASSWORD" "GRAFANA_ADMIN_PASSWORD"; then
    update_env_var "GRAFANA_ADMIN_PASSWORD" "$GRAFANA_ADMIN_PASSWORD" "Grafana admin password"
  else
    warning "Skipping Grafana admin password configuration"
  fi
else
  log "Grafana admin password is already configured"
fi

# Additional environment variables
echo
info "Would you like to configure additional environment variables? (y/n)"
read -p "Enter your choice: " configure_additional

if [[ "$configure_additional" =~ ^[Yy]$ ]]; then
  # 6. Cloudflare variables (if not already set)
  if ! grep -q "^CLOUDFLARE_ZONE_ID=" "$ENV_FILE"; then
    CLOUDFLARE_ZONE_ID=$(prompt_variable "CLOUDFLARE_ZONE_ID" "Cloudflare Zone ID" "")
    if [ -n "$CLOUDFLARE_ZONE_ID" ]; then
      update_env_var "CLOUDFLARE_ZONE_ID" "$CLOUDFLARE_ZONE_ID" "Cloudflare Zone ID"
    fi
  else
    log "Cloudflare Zone ID is already configured"
  fi
  
  if ! grep -q "^CLOUDFLARE_API_TOKEN=" "$ENV_FILE"; then
    CLOUDFLARE_API_TOKEN=$(prompt_variable "CLOUDFLARE_API_TOKEN" "Cloudflare API Token" "" "true")
    if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
      update_env_var "CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_API_TOKEN" "Cloudflare API Token"
    fi
  else
    log "Cloudflare API Token is already configured"
  fi
  
  if ! grep -q "^CLOUDFLARE_ACCOUNT_ID=" "$ENV_FILE"; then
    CLOUDFLARE_ACCOUNT_ID=$(prompt_variable "CLOUDFLARE_ACCOUNT_ID" "Cloudflare Account ID" "")
    if [ -n "$CLOUDFLARE_ACCOUNT_ID" ]; then
      update_env_var "CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_ACCOUNT_ID" "Cloudflare Account ID"
    fi
  else
    log "Cloudflare Account ID is already configured"
  fi
  
  # 7. Sentry DSN (if not already set)
  if ! grep -q "^SENTRY_DSN=" "$ENV_FILE"; then
    SENTRY_DSN=$(prompt_variable "SENTRY_DSN" "Sentry DSN for error tracking" "")
    if [ -n "$SENTRY_DSN" ]; then
      update_env_var "SENTRY_DSN" "$SENTRY_DSN" "Sentry DSN for error tracking"
    fi
  else
    log "Sentry DSN is already configured"
  fi
  
  # 8. SMTP Configuration (if not already set)
  if ! grep -q "^SMTP_HOST=" "$ENV_FILE"; then
    configure_smtp=$(prompt_variable "CONFIGURE_SMTP" "Would you like to configure SMTP for email notifications? (yes/no)" "no")
    if [[ "$configure_smtp" =~ ^[Yy][Ee][Ss]$ ]]; then
      SMTP_HOST=$(prompt_variable "SMTP_HOST" "SMTP server host" "smtp.gmail.com")
      SMTP_PORT=$(prompt_variable "SMTP_PORT" "SMTP server port" "587")
      SMTP_USER=$(prompt_variable "SMTP_USER" "SMTP username (email)" "")
      SMTP_PASSWORD=$(prompt_variable "SMTP_PASSWORD" "SMTP password or app password" "" "true")
      SMTP_FROM=$(prompt_variable "SMTP_FROM" "Email sender name and address" "Vokaflow <noreply@example.com>")
      
      update_env_var "SMTP_HOST" "$SMTP_HOST" "SMTP server host"
      update_env_var "SMTP_PORT" "$SMTP_PORT" "SMTP server port"
      update_env_var "SMTP_USER" "$SMTP_USER" "SMTP username"
      update_env_var "SMTP_PASSWORD" "$SMTP_PASSWORD" "SMTP password"
      update_env_var "SMTP_FROM" "$SMTP_FROM" "Email sender"
    fi
  else
    log "SMTP configuration is already set"
  fi
fi

# Set proper permissions for the environment file
chmod 600 "$ENV_FILE"
log "Environment file permissions set to 600 (read/write for owner only)"

# Restart services to apply changes
echo
info "Would you like to restart services to apply the changes? (y/n)"
read -p "Enter your choice: " restart_services

if [[ "$restart_services" =~ ^[Yy]$ ]]; then
  log "Restarting Docker services..."
  cd /opt/vokaflow
  docker-compose down
  docker-compose up -d
  log "Services restarted successfully"
else
  info "Remember to restart services manually to apply the changes:"
  echo "cd /opt/vokaflow && docker-compose down && docker-compose up -d"
fi

# Final steps
log "Environment configuration completed successfully"
info "Your environment variables have been configured and saved to $ENV_FILE"
info "A backup of your previous configuration has been saved to $BACKUP_FILE"

# Test connections
echo
info "Would you like to test connections to configured services? (y/n)"
read -p "Enter your choice: " test_connections

if [[ "$test_connections" =~ ^[Yy]$ ]]; then
  log "Testing connections to services..."
  
  # Test PostgreSQL
  if docker-compose exec postgres pg_isready -U vokaflow > /dev/null 2>&1; then
    log "PostgreSQL connection successful"
  else
    warning "Could not connect to PostgreSQL"
  fi
  
  # Test RabbitMQ
  if curl -s -u "vokaflow:$RABBITMQ_PASSWORD" http://localhost:15672/api/overview > /dev/null 2>&1; then
    log "RabbitMQ connection successful"
  else
    warning "Could not connect to RabbitMQ"
  fi
  
  # Test MinIO
  if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    log "MinIO connection successful"
  else
    warning "Could not connect to MinIO"
  fi
  
  # Test Vault
  if curl -s "$VAULT_ADDR/v1/sys/health" > /dev/null 2>&1; then
    log "Vault connection successful"
  else
    warning "Could not connect to Vault"
  fi
  
  # Test Grafana
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    log "Grafana connection successful"
  else
    warning "Could not connect to Grafana"
  fi
fi

# Display next steps
echo
log "Next Steps:"
echo "1. Verify all services are running: docker-compose ps"
echo "2. Check service logs: docker-compose logs -f [service_name]"
echo "3. Access the API at: http://your-domain.com/api"
echo "4. Access Grafana at: http://your-domain.com/grafana"
echo "5. Run the model download script: ./scripts/download_models.sh"

log "Vokaflow 2.0 environment configuration completed"
exit 0
