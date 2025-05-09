#!/bin/bash
# verify_installation.sh - Script to verify the Vokaflow 2.0 installation
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

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
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

# Function to check if a service is running
check_service() {
  local service_name="$1"
  
  if docker-compose ps | grep -q "$service_name" | grep -q "Up"; then
    success "$service_name is running"
    return 0
  else
    warning "$service_name is not running"
    return 1
  fi
}

# Function to check if a port is open
check_port() {
  local port="$1"
  local service_name="$2"
  
  if nc -z localhost "$port"; then
    success "$service_name port $port is open"
    return 0
  else
    warning "$service_name port $port is not open"
    return 1
  fi
}

# Function to check disk space
check_disk_space() {
  local mount_point="$1"
  local threshold="$2"
  
  local usage=$(df -h "$mount_point" | awk 'NR==2 {print $5}' | sed 's/%//')
  
  if [ "$usage" -lt "$threshold" ]; then
    success "$mount_point has adequate disk space (${usage}% used)"
    return 0
  else
    warning "$mount_point is running low on disk space (${usage}% used)"
    return 1
  fi
}

# Main script
log "Starting Vokaflow 2.0 Installation Verification"
echo

# Check Docker and Docker Compose
info "Checking Docker and Docker Compose..."
if command -v docker > /dev/null && command -v docker-compose > /dev/null; then
  success "Docker and Docker Compose are installed"
  docker --version
  docker-compose --version
else
  error "Docker and/or Docker Compose are not installed"
  exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
  info "Changing to Vokaflow directory..."
  cd /opt/vokaflow || { error "Could not change to /opt/vokaflow directory"; exit 1; }
fi

# Check services
info "Checking Docker services..."
check_service "vokaflow-api"
check_service "vokaflow-postgres"
check_service "vokaflow-redis"
check_service "vokaflow-rabbitmq"
check_service "vokaflow-minio"
check_service "vokaflow-nginx"
check_service "vokaflow-whisper"
check_service "vokaflow-xtts"
check_service "vokaflow-qwen"

# Check ports
info "Checking service ports..."
check_port "8000" "API"
check_port "5432" "PostgreSQL"
check_port "6379" "Redis"
check_port "5672" "RabbitMQ"
check_port "9000" "MinIO"
check_port "80" "Nginx HTTP"
check_port "443" "Nginx HTTPS"

# Check disk space
info "Checking disk space..."
check_disk_space "/opt/vokaflow" "80"
check_disk_space "/var/lib/docker" "80"
check_disk_space "/mnt/backup" "80"

# Check API health
info "Checking API health..."
if curl -s http://localhost:8000/health > /dev/null; then
  success "API health check successful"
  curl -s http://localhost:8000/health | jq || echo "API health check returned successfully but jq is not installed to format the output"
else
  warning "API health check failed"
fi

# Check AI models
info "Checking AI models..."
if [ -d "/opt/vokaflow/models/whisper" ] && [ "$(ls -A /opt/vokaflow/models/whisper)" ]; then
  success "Whisper models are installed"
else
  warning "Whisper models are not installed"
fi

if [ -d "/opt/vokaflow/models/qwen" ] && [ "$(ls -A /opt/vokaflow/models/qwen)" ]; then
  success "Qwen models are installed"
else
  warning "Qwen models are not installed"
fi

if [ -d "/opt/vokaflow/models/nllb" ] && [ "$(ls -A /opt/vokaflow/models/nllb)" ]; then
  success "NLLB models are installed"
else
  warning "NLLB models are not installed"
fi

# Check SSL certificates
info "Checking SSL certificates..."
if [ -d "/opt/vokaflow/config/certbot/conf/live" ]; then
  success "SSL certificates are installed"
  find /opt/vokaflow/config/certbot/conf/live -type f -name "fullchain.pem" | while read -r cert; do
    domain=$(echo "$cert" | sed -E 's|.*/live/([^/]+)/fullchain.pem|\1|')
    expiry=$(openssl x509 -enddate -noout -in "$cert" | cut -d= -f2)
    echo "  - $domain expires on $expiry"
  done
else
  warning "SSL certificates are not installed"
fi

# Check database
info "Checking database..."
if docker-compose exec -T postgres psql -U vokaflow -c "SELECT 1" > /dev/null 2>&1; then
  success "Database connection successful"
  
  # Check if tables exist
  tables=$(docker-compose exec -T postgres psql -U vokaflow -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" -t | tr -d ' ')
  echo "  - Database has $tables tables"
  
  # Check users
  users=$(docker-compose exec -T postgres psql -U vokaflow -c "SELECT COUNT(*) FROM \"user\"" -t 2>/dev/null || echo "0" | tr -d ' ')
  if [ "$users" -gt "0" ]; then
    echo "  - Database has $users users"
  else
    warning "  - No users found in the database"
  fi
else
  warning "Database connection failed"
fi

# Verificar voces
info "Verificando voces..."
if [ -d "/opt/vokaflow/voices" ] && [ "$(ls -A /opt/vokaflow/voices)" ]; then
  success "Directorio de voces encontrado"
  
  # Contar voces por idioma
  echo "  - Español: $(find /opt/vokaflow/voices/es -type f -name \"*.mp3\" | wc -l) voces"
  echo "  - Inglés: $(find /opt/vokaflow/voices/en -type f -name \"*.mp3\" | wc -l) voces"
  echo "  - Alemán: $(find /opt/vokaflow/voices/de -type f -name \"*.mp3\" | wc -l) voces"
else
  warning "Directorio de voces no encontrado o vacío"
fi

# Summary
echo
log "Verification Summary"
echo "===================="
echo "The Vokaflow 2.0 installation has been verified."
echo "Please review any warnings above and take appropriate action."
echo

# Next steps
log "Next Steps:"
echo "1. If any services are not running, restart them: docker-compose restart [service_name]"
echo "2. If AI models are not installed, run: ./scripts/download_models.sh"
echo "3. If SSL certificates are not installed, run: sudo certbot certonly --webroot -w /opt/vokaflow/config/certbot/www -d your-domain.com"
echo "4. If no users are found in the database, create an admin user:"
echo "   docker-compose exec api python -c \"from db.session import SessionLocal; from models.user import User; from core.auth.password import get_password_hash; db = SessionLocal(); admin = User(email='admin@vokaflow.com', hashed_password=get_password_hash('admin'), full_name='Admin User', is_active=True, is_superuser=True); db.add(admin); db.commit(); db.close(); print('Admin user created')\""

log "Vokaflow 2.0 installation verification completed"
exit 0
