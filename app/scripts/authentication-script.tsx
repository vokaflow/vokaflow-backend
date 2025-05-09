"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Copy, CheckCircle, Terminal } from "lucide-react"

export default function AuthenticationScript() {
  const [activeTab, setActiveTab] = useState("script")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vokaflow 2.0 Authentication Script</h1>

      <Alert className="mb-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Final Authentication Script</AlertTitle>
        <AlertDescription>
          This script configures and authenticates all services for your Vokaflow 2.0 backend.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="script">Full Script</TabsTrigger>
          <TabsTrigger value="usage">Usage Instructions</TabsTrigger>
          <TabsTrigger value="services">Services Configured</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Script</CardTitle>
              <CardDescription>Complete script to authenticate all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(authScript)}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">{authScript}</pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Script
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>How to use the authentication script</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Prerequisites</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ubuntu Server 24.04 LTS installed</li>
                    <li>Docker and Docker Compose installed</li>
                    <li>All Vokaflow services deployed</li>
                    <li>
                      Environment variables configured in <code>/opt/vokaflow/.env</code>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Installation Steps</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Save the script to <code>/opt/vokaflow/scripts/auth_services.sh</code>
                      <div className="bg-muted p-2 rounded-md mt-1">
                        <code className="text-xs">sudo nano /opt/vokaflow/scripts/auth_services.sh</code>
                      </div>
                    </li>
                    <li>
                      Make the script executable
                      <div className="bg-muted p-2 rounded-md mt-1">
                        <code className="text-xs">sudo chmod +x /opt/vokaflow/scripts/auth_services.sh</code>
                      </div>
                    </li>
                    <li>
                      Run the script
                      <div className="bg-muted p-2 rounded-md mt-1">
                        <code className="text-xs">sudo /opt/vokaflow/scripts/auth_services.sh</code>
                      </div>
                    </li>
                    <li>Check the output for any warnings or errors</li>
                    <li>
                      Restart services to apply changes
                      <div className="bg-muted p-2 rounded-md mt-1">
                        <code className="text-xs">cd /opt/vokaflow && docker-compose restart</code>
                      </div>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Troubleshooting</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Script fails with permission errors:</strong> Make sure you're running as root (sudo)
                    </li>
                    <li>
                      <strong>Services not found:</strong> Ensure all Docker containers are running before executing the
                      script
                    </li>
                    <li>
                      <strong>Environment variables missing:</strong> Check that your .env file is properly configured
                    </li>
                    <li>
                      <strong>Vault not accessible:</strong> Verify Vault is running and the address is correct
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Configured</CardTitle>
              <CardDescription>Overview of services configured by the script</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Hugging Face</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Configures token for model downloads</li>
                      <li>Sets up environment for AI model access</li>
                      <li>Enables downloading of protected models</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Firebase</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Sets up service account configuration</li>
                      <li>Configures storage bucket access</li>
                      <li>Enables Firebase integration</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">HashiCorp Vault</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Initializes Vault if running</li>
                      <li>Creates policies for secure access</li>
                      <li>Stores sensitive credentials</li>
                      <li>Sets up token authentication</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">SSL Certificates</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Provides instructions for Let's Encrypt</li>
                      <li>Sets up directories for certificates</li>
                      <li>Prepares for secure HTTPS access</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">PostgreSQL</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates initial database schema</li>
                      <li>Sets up version tracking</li>
                      <li>Configures database access</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">MinIO</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates required buckets</li>
                      <li>Configures object storage</li>
                      <li>Sets up access credentials</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">RabbitMQ</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates virtual host</li>
                      <li>Sets up exchanges and queues</li>
                      <li>Configures permissions</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">MQTT (Mosquitto)</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates broker configuration</li>
                      <li>Sets up authentication</li>
                      <li>Configures persistence</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">AI Models</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates download script for models</li>
                      <li>Sets up directory structure</li>
                      <li>Prepares for model deployment</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Backup System</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Creates backup script</li>
                      <li>Sets up daily cron job</li>
                      <li>Configures backup rotation</li>
                      <li>Utilizes dedicated backup drive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Authentication script content
const authScript = `#!/bin/bash
# auth_services.sh - Script to authenticate and configure all Vokaflow 2.0 services
# This script should be run after the initial installation

set -e

# Colors for output
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
NC='\\033[0m' # No Color

# Log function
log() {
  echo -e "\${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "\${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning() {
  echo -e "\${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
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
  "project_id": "\${GOOGLE_CLOUD_PROJECT_ID}",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "firebase-adminsdk@\${GOOGLE_CLOUD_PROJECT_ID}.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40\${GOOGLE_CLOUD_PROJECT_ID}.iam.gserviceaccount.com",
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

exit 0
`
