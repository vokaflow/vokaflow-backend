"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, HardDrive, Server, Shield, CheckCircle } from "lucide-react"

export default function FinalConfiguration() {
  const [activeTab, setActiveTab] = useState("storage")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vokaflow 2.0 Final Configuration</h1>

      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Updated Configuration</AlertTitle>
        <AlertDescription>
          This is the final configuration with your updated storage setup and environment variables.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="storage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Updated Storage Configuration</CardTitle>
              <CardDescription>Optimized for your three-drive setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <HardDrive className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Primary Drive</h3>
                    </div>
                    <p className="text-sm mb-2">1TB NVMe SSD (ADATA Legend 960 Max)</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Operating System (100GB)</li>
                      <li>Application Code (50GB)</li>
                      <li>AI Models (600GB)</li>
                      <li>Databases (200GB)</li>
                      <li>Reserved (50GB)</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <HardDrive className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Secondary Drive</h3>
                    </div>
                    <p className="text-sm mb-2">500GB NVMe SSD</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Docker Data (100GB)</li>
                      <li>Container Images (50GB)</li>
                      <li>Media Storage (300GB)</li>
                      <li>Reserved (50GB)</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <HardDrive className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Backup Drive</h3>
                    </div>
                    <p className="text-sm mb-2">1TB SSD</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>System Backups (400GB)</li>
                      <li>Database Backups (300GB)</li>
                      <li>Log Archives (200GB)</li>
                      <li>Reserved (100GB)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Storage Mount Configuration</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# /etc/fstab configuration

# Primary Drive (1TB NVMe SSD)
/dev/nvme0n1p1  /               ext4    defaults        0       1
/dev/nvme0n1p2  /opt/vokaflow   ext4    defaults        0       2

# Secondary Drive (500GB NVMe SSD)
/dev/nvme1n1    /var/lib/docker ext4    defaults        0       2

# Backup Drive (1TB SSD)
/dev/sda1       /mnt/backup     ext4    defaults        0       2

# Create necessary directories
mkdir -p /opt/vokaflow/models
mkdir -p /opt/vokaflow/data
mkdir -p /opt/vokaflow/logs
mkdir -p /opt/vokaflow/backups
mkdir -p /mnt/backup/system
mkdir -p /mnt/backup/database
mkdir -p /mnt/backup/logs`}
                    </pre>
                  </ScrollArea>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Improved Storage Configuration</AlertTitle>
                  <AlertDescription>
                    With the addition of the 1TB backup SSD, your storage configuration is now much more robust and
                    provides adequate space for backups, logs, and system recovery.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Updated with your provided values</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-xs">
                  {`# .env file for Vokaflow 2.0

# System Configuration
ENVIRONMENT=production
LOG_LEVEL=INFO
API_WORKERS=4

# Google Cloud & Firebase
GOOGLE_CLOUD_API_KEY=AIzaSyArwQWi-6QbXja0FWZrVx5p3RsBKGjSxl4
GOOGLE_CLOUD_PROJECT_ID=vokaflow-c1061
FIREBASE_STORAGE_BUCKET=vokaflow-c1061.appspot.com
FIREBASE_SERVICE_ACCOUNT_PATH=/app/config/firebase/service-account.json

# AI Models
WHISPER_MODEL=medium
QWEN_MODEL=Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4
HUGGINGFACE_TOKEN=your-huggingface-token

# Vault
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=your-vault-token
VAULT_MOUNT_POINT=prod

# Databases
REDIS_URL=redis://redis:6379/0
POSTGRES_USER=vokaflow
POSTGRES_PASSWORD=your-secure-postgres-password
POSTGRES_DB=vokaflow

# Message Queue
RABBITMQ_DEFAULT_USER=vokaflow
RABBITMQ_DEFAULT_PASS=your-secure-rabbitmq-password

# Object Storage
MINIO_ROOT_USER=vokaflow
MINIO_ROOT_PASSWORD=your-secure-minio-password

# Monitoring
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-grafana-password

# Cloudflare
CLOUDFLARE_ZONE_ID=your-cloudflare-zone-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Vokaflow <your-email@gmail.com>

# Sentry
SENTRY_DSN=your-sentry-dsn`}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Configuration</CardTitle>
              <CardDescription>Overview of all services and their requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Service</th>
                      <th className="px-4 py-2 text-left">Free</th>
                      <th className="px-4 py-2 text-left">Registration</th>
                      <th className="px-4 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2">PostgreSQL</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">RabbitMQ</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">MinIO</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">ClickHouse</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">OCR (Languages/GPU)</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Depends on local configuration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">MQTT Broker</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation (Mosquitto)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">SMTP (Gmail, etc.)</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">Limited free tier</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Grafana</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Local installation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Sentry</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">Limited free tier</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">SSL (Let's Encrypt)</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">❌</td>
                      <td className="px-4 py-2">Free SSL certificates</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Hugging Face</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">For AI model downloads</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Cloudflare</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">✅</td>
                      <td className="px-4 py-2">Free tier for DNS and basic protection</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Docker Compose Configuration</h3>
                <Alert className="mb-4">
                  <Server className="h-4 w-4" />
                  <AlertTitle>Updated for Three-Drive Setup</AlertTitle>
                  <AlertDescription>
                    The Docker Compose configuration has been updated to utilize your three-drive setup optimally.
                  </AlertDescription>
                </Alert>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <pre className="text-xs">
                    {`# Updated volume configuration in docker-compose.yml

volumes:
  # Primary Drive (1TB NVMe SSD)
  models_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/vokaflow/models
  
  # Secondary Drive (500GB NVMe SSD)
  media_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/media
  
  # Backup Drive (1TB SSD)
  backup_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup
  logs_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup/logs`}
                  </pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Script</CardTitle>
              <CardDescription>Final script to authenticate all services</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">
                  {`#!/bin/bash
# auth_services.sh - Script to authenticate and configure all Vokaflow 2.0 services
# This script should be run after the initial installation

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Log function
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root"
  exit 1
fi

# Load environment variables
if [ -f /opt/vokaflow/.env ]; then
  log "Loading environment variables from /opt/vokaflow/.env"
  source /opt/vokaflow/.env
else
  error "Environment file not found at /opt/vokaflow/.env"
  exit 1
fi

# Create directories if they don't exist
log "Creating necessary directories"
mkdir -p /opt/vokaflow/config/firebase
mkdir -p /opt/vokaflow/config/ssl
mkdir -p /opt/vokaflow/config/vault
mkdir -p /opt/vokaflow/secrets

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
log "Checking for required tools"
for cmd in curl jq docker docker-compose openssl; do
  if ! command_exists $cmd; then
    error "$cmd is not installed. Please install it and try again."
    exit 1
  fi
done

# 1. Configure Hugging Face token for model downloads
log "Configuring Hugging Face token"
if [ -z "$HUGGINGFACE_TOKEN" ]; then
  warning "HUGGINGFACE_TOKEN is not set. Some models may not be downloadable."
else
  echo "HUGGINGFACE_TOKEN=$HUGGINGFACE_TOKEN" > /opt/vokaflow/secrets/huggingface.env
  log "Hugging Face token configured"
fi

# 2. Set up Firebase service account
log "Setting up Firebase service account"
if [ -z "$GOOGLE_CLOUD_PROJECT_ID" ] || [ -z "$FIREBASE_STORAGE_BUCKET" ]; then
  warning "Google Cloud or Firebase variables are not set. Firebase integration will not work."
else
  # Create a minimal service account JSON if it doesn't exist
  if [ ! -f "/opt/vokaflow/config/firebase/service-account.json" ]; then
    cat > /opt/vokaflow/config/firebase/service-account.json << EOF
{
  "type": "service_account",
  "project_id": "${GOOGLE_CLOUD_PROJECT_ID}",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "firebase-adminsdk@${GOOGLE_CLOUD_PROJECT_ID}.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40${GOOGLE_CLOUD_PROJECT_ID}.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
EOF
    warning "Created a placeholder Firebase service account. Please replace with your actual service account JSON."
  else
    log "Firebase service account already exists"
  fi
fi

# 3. Initialize HashiCorp Vault
log "Initializing HashiCorp Vault"
if [ -z "$VAULT_ADDR" ] || [ -z "$VAULT_TOKEN" ]; then
  warning "Vault variables are not set. Vault integration will not work."
else
  # Check if Vault is running
  if curl -s "$VAULT_ADDR/v1/sys/health" > /dev/null; then
    log "Vault is running. Configuring..."
    
    # Set up Vault token
    echo "$VAULT_TOKEN" > /opt/vokaflow/secrets/vault-token
    chmod 600 /opt/vokaflow/secrets/vault-token
    
    # Create Vault policy for Vokaflow
    cat > /opt/vokaflow/config/vault/vokaflow-policy.hcl << EOF
path "prod/data/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF
    
    # Apply policy using Vault CLI (assuming it's installed)
    if command_exists vault; then
      export VAULT_ADDR="$VAULT_ADDR"
      export VAULT_TOKEN="$VAULT_TOKEN"
      
      # Check if KV secrets engine is enabled
      if ! vault secrets list | grep -q "^prod/"; then
        log "Enabling KV secrets engine at 'prod'"
        vault secrets enable -path=prod kv-v2
      fi
      
      log "Creating Vault policy"
      vault policy write vokaflow /opt/vokaflow/config/vault/vokaflow-policy.hcl
      
      # Store initial secrets
      log "Storing initial secrets in Vault"
      vault kv put prod/database/postgres username="$POSTGRES_USER" password="$POSTGRES_PASSWORD"
      vault kv put prod/rabbitmq username="$RABBITMQ_DEFAULT_USER" password="$RABBITMQ_DEFAULT_PASS"
      vault kv put prod/minio access_key="$MINIO_ROOT_USER" secret_key="$MINIO_ROOT_PASSWORD"
      
      log "Vault configuration completed"
    else
      warning "Vault CLI not found. Manual Vault configuration will be needed."
    fi
  else
    warning "Vault is not running. Please start Vault and run this script again."
  fi
fi

# 4. Set up SSL certificates with Let's Encrypt
log "Setting up SSL certificates"
if command_exists certbot; then
  log "Certbot is installed. You can generate certificates with:"
  log "certbot certonly --webroot -w /var/www/certbot -d your-domain.com"
else
  warning "Certbot is not installed. SSL certificate generation will need to be done manually."
fi

# 5. Configure PostgreSQL
log "Configuring PostgreSQL"
if docker ps | grep -q vokaflow-postgres; then
  log "PostgreSQL is running. Setting up initial database..."
  
  # Wait for PostgreSQL to be ready
  sleep 5
  
  # Create initial database schema
  docker exec vokaflow-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
  CREATE TABLE IF NOT EXISTS version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  INSERT INTO version (version) VALUES ('2.0.0') ON CONFLICT DO NOTHING;
  "
  
  log "PostgreSQL initial setup completed"
else
  warning "PostgreSQL container is not running. Database setup will need to be done later."
fi

# 6. Configure MinIO
log "Configuring MinIO"
if docker ps | grep -q vokaflow-minio; then
  log "MinIO is running. Setting up initial buckets..."
  
  # Wait for MinIO to be ready
  sleep 5
  
  # Use MinIO Client to configure
  if command_exists mc; then
    # Configure MinIO Client
    mc alias set vokaflow-local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
    
    # Create buckets
    mc mb --ignore-existing vokaflow-local/voices
    mc mb --ignore-existing vokaflow-local/recordings
    mc mb --ignore-existing vokaflow-local/transcriptions
    mc mb --ignore-existing vokaflow-local/backups
    
    log "MinIO buckets created"
  else
    warning "MinIO Client (mc) not found. Manual MinIO configuration will be needed."
  fi
else
  warning "MinIO container is not running. Object storage setup will need to be done later."
fi

# 7. Configure RabbitMQ
log "Configuring RabbitMQ"
if docker ps | grep -q vokaflow-rabbitmq; then
  log "RabbitMQ is running. Setting up initial queues..."
  
  # Wait for RabbitMQ to be ready
  sleep 10
  
  # Create vhost and queues
  docker exec vokaflow-rabbitmq rabbitmqctl add_vhost vokaflow
  docker exec vokaflow-rabbitmq rabbitmqctl set_permissions -p vokaflow "$RABBITMQ_DEFAULT_USER" ".*" ".*" ".*"
  
  # Create exchanges and queues using rabbitmqadmin
  docker exec vokaflow-rabbitmq rabbitmqadmin declare exchange name=vokaflow.events type=topic
  docker exec vokaflow-rabbitmq rabbitmqadmin declare queue name=vokaflow.transcription
  docker exec vokaflow-rabbitmq rabbitmqadmin declare queue name=vokaflow.translation
  docker exec vokaflow-rabbitmq rabbitmqadmin declare queue name=vokaflow.synthesis
  
  log "RabbitMQ initial setup completed"
else
  warning "RabbitMQ container is not running. Message queue setup will need to be done later."
fi

# 8. Configure MQTT (Mosquitto)
log "Configuring MQTT (Mosquitto)"
if docker ps | grep -q vokaflow-mosquitto; then
  log "Mosquitto is running. Setting up configuration..."
  
  # Create Mosquitto configuration
  mkdir -p /opt/vokaflow/config/mosquitto
  cat > /opt/vokaflow/config/mosquitto/mosquitto.conf << EOF
listener 1883
allow_anonymous false
password_file /mosquitto/config/passwd

persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
EOF
  
  # Create password file
  docker exec vokaflow-mosquitto mosquitto_passwd -c /mosquitto/config/passwd vokaflow
  
  log "MQTT (Mosquitto) configuration completed"
else
  warning "Mosquitto container is not running. MQTT setup will need to be done later."
fi

# 9. Download AI models
log "Setting up AI models"
mkdir -p /opt/vokaflow/models/whisper
mkdir -p /opt/vokaflow/models/qwen
mkdir -p /opt/vokaflow/models/nllb
mkdir -p /opt/vokaflow/models/ocr

# Create a model download script
cat > /opt/vokaflow/scripts/download_models.sh << 'EOF'
#!/bin/bash

# Download essential AI models
# This script requires Hugging Face CLI to be installed

set -e

# Load environment variables
source /opt/vokaflow/.env

# Set Hugging Face token if available
if [ -n "$HUGGINGFACE_TOKEN" ]; then
  huggingface-cli login --token $HUGGINGFACE_TOKEN
fi

# Download Whisper model
echo "Downloading Whisper model..."
if [ "$WHISPER_MODEL" = "medium" ]; then
  mkdir -p /opt/vokaflow/models/whisper/medium
  huggingface-cli download --resume openai/whisper-medium --local-dir /opt/vokaflow/models/whisper/medium
elif [ "$WHISPER_MODEL" = "small" ]; then
  mkdir -p /opt/vokaflow/models/whisper/small
  huggingface-cli download --resume openai/whisper-small --local-dir /opt/vokaflow/models/whisper/small
fi

# Download Qwen model
echo "Downloading Qwen model..."
MODEL_DIR=$(echo $QWEN_MODEL | tr '/' '_')
mkdir -p /opt/vokaflow/models/qwen/$MODEL_DIR
huggingface-cli download --resume $QWEN_MODEL --local-dir /opt/vokaflow/models/qwen/$MODEL_DIR

# Download NLLB model
echo "Downloading NLLB model..."
mkdir -p /opt/vokaflow/models/nllb/nllb-200-1.3B
huggingface-cli download --resume facebook/nllb-200-1.3B --local-dir /opt/vokaflow/models/nllb/nllb-200-1.3B

# Download OCR models
echo "Downloading OCR models..."
mkdir -p /opt/vokaflow/models/ocr
python -c "
import easyocr
reader = easyocr.Reader(['en', 'es', 'fr', 'de', 'it', 'pt'])
"

echo "Model downloads completed"
EOF

chmod +x /opt/vokaflow/scripts/download_models.sh
log "AI model download script created at /opt/vokaflow/scripts/download_models.sh"

# 10. Set up backup script
log "Setting up backup system"
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
(crontab -l 2>/dev/null || echo "") | grep -v "/opt/vokaflow/scripts/maintenance/backup.sh" | { cat; echo "0 2 * * * /opt/vokaflow/scripts/maintenance/backup.sh >> /opt/vokaflow/logs/backup.log 2>&1"; } | crontab -

log "Backup system configured with daily backups at 2 AM"

# 11. Final verification
log "Performing final verification"

# Check if all required directories exist
for dir in /opt/vokaflow/models /opt/vokaflow/data /opt/vokaflow/logs /opt/vokaflow/config /mnt/backup; do
  if [ ! -d "$dir" ]; then
    warning "Directory $dir does not exist"
  fi
done

# Check if Docker services are running
if docker ps | grep -q vokaflow; then
  log "Vokaflow services are running"
  docker ps --format "table {{.Names}}\t{{.Status}}" | grep vokaflow
else
  warning "No Vokaflow services are running"
fi

# Final message
log "Authentication and configuration script completed"
log "Please review any warnings above and take appropriate action"
log "You may need to restart some services for changes to take effect"
log "Run 'docker-compose restart' in the /opt/vokaflow directory to apply all changes"

exit 0`}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Authentication Script
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Final Implementation Steps</CardTitle>
          <CardDescription>Complete these steps to finalize your Vokaflow 2.0 backend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Prepare Storage Drives</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Format and mount your three drives according to the storage configuration.
                </p>
              </li>

              <li>
                <strong>Install Base System</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Install Ubuntu Server 24.04 LTS and configure the base system.
                </p>
              </li>

              <li>
                <strong>Clone Installation Repository</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Clone the Vokaflow installer repository to /opt/vokaflow.
                </p>
              </li>

              <li>
                <strong>Create Environment File</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Create the .env file with all the environment variables provided.
                </p>
              </li>

              <li>
                <strong>Run Installation Scripts</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Execute the installation scripts in sequence to set up the system.
                </p>
              </li>

              <li>
                <strong>Deploy Docker Services</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Deploy all services using the updated Docker Compose configuration.
                </p>
              </li>

              <li>
                <strong>Run Authentication Script</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Execute the authentication script to configure all services.
                </p>
              </li>

              <li>
                <strong>Download AI Models</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Run the model download script to fetch all required AI models.
                </p>
              </li>

              <li>
                <strong>Verify Deployment</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Run the verification script to ensure all components are working correctly.
                </p>
              </li>

              <li>
                <strong>Set Up Monitoring</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure Grafana dashboards for system and storage monitoring.
                </p>
              </li>
            </ol>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Security Reminder</AlertTitle>
              <AlertDescription>
                After installation, make sure to secure your system by changing default passwords, restricting access,
                and enabling firewall rules.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full">
            <Alert variant="default" className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Ready for Implementation</AlertTitle>
              <AlertDescription>
                Your Vokaflow 2.0 backend is now fully configured and ready for implementation with your three-drive
                storage setup.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Complete Implementation Guide
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
