"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, CheckCircle } from "lucide-react"

export default function BackendImplementation() {
  const [activeTab, setActiveTab] = useState("installation")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vokaflow 2.0 Backend Implementation</h1>

      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Complete Backend Implementation</AlertTitle>
        <AlertDescription>
          Follow these steps to install and configure the Vokaflow 2.0 backend on your three-drive storage setup.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="installation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Installation Steps</CardTitle>
              <CardDescription>Setting up the Vokaflow 2.0 backend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">1. Clone the Repository</h3>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Clone the Vokaflow repository
git clone https://github.com/vokaflow/vokaflow.git /opt/vokaflow
cd /opt/vokaflow

# Create necessary directories
mkdir -p models data logs config scripts
mkdir -p models/whisper models/xtts models/qwen models/nllb models/ocr
mkdir -p data/postgres data/redis data/rabbitmq data/minio
mkdir -p logs/api logs/services logs/nginx
mkdir -p config/nginx config/prometheus config/grafana config/loki config/promtail`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">2. Set Up Storage Drives</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Format drives (if needed)
# WARNING: This will erase all data on the drives
# Replace /dev/nvme0n1, /dev/nvme1n1, and /dev/sda1 with your actual device names

# Primary Drive (1TB NVMe SSD)
sudo mkfs.ext4 /dev/nvme0n1
sudo mount /dev/nvme0n1 /opt/vokaflow

# Secondary Drive (500GB NVMe SSD)
sudo mkfs.ext4 /dev/nvme1n1
sudo mount /dev/nvme1n1 /var/lib/docker

# Backup Drive (1TB SSD)
sudo mkfs.ext4 /dev/sda1
sudo mount /dev/sda1 /mnt/backup
sudo mkdir -p /mnt/backup/logs /mnt/backup/database /mnt/backup/system

# Add to fstab for automatic mounting
echo "/dev/nvme0n1 /opt/vokaflow ext4 defaults 0 2" | sudo tee -a /etc/fstab
echo "/dev/nvme1n1 /var/lib/docker ext4 defaults 0 2" | sudo tee -a /etc/fstab
echo "/dev/sda1 /mnt/backup ext4 defaults 0 2" | sudo tee -a /etc/fstab`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">3. Install Dependencies</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install NVIDIA drivers and CUDA
sudo apt install -y nvidia-driver-535 nvidia-cuda-toolkit

# Install other dependencies
sudo apt install -y python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools
sudo apt install -y git curl wget htop net-tools

# Add current user to docker group
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">4. Create Environment File</h3>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create .env file
cat > /opt/vokaflow/.env << 'EOF'
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
SENTRY_DSN=your-sentry-dsn
EOF

# Set proper permissions
chmod 600 /opt/vokaflow/.env`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Steps</CardTitle>
              <CardDescription>Configuring the Vokaflow 2.0 backend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">1. Configure Docker Compose</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create docker-compose.yml file
# Use the docker-compose configuration from the previous section
# Make sure to update the volume paths to match your three-drive setup

# Primary Drive (1TB NVMe SSD): /opt/vokaflow
# Secondary Drive (500GB NVMe SSD): /var/lib/docker
# Backup Drive (1TB SSD): /mnt/backup

# Test Docker Compose configuration
cd /opt/vokaflow
docker-compose config`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">2. Configure Nginx</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create Nginx configuration
cat > /opt/vokaflow/config/nginx/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Redirect to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl;
    server_name _;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    
    # API
    location /api/ {
        proxy_pass http://api:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://api:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Grafana
    location /grafana/ {
        proxy_pass http://grafana:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static/ {
        alias /usr/share/nginx/html/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # Root
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Replace your-domain.com with your actual domain
sed -i 's/your-domain.com/your-actual-domain.com/g' /opt/vokaflow/config/nginx/default.conf`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">3. Configure Prometheus and Grafana</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create Prometheus configuration
mkdir -p /opt/vokaflow/config/prometheus
cat > /opt/vokaflow/config/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'api'
    static_configs:
      - targets: ['api:8000']
EOF

# Create Grafana datasources
mkdir -p /opt/vokaflow/config/grafana/datasources
cat > /opt/vokaflow/config/grafana/datasources/datasources.yaml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
EOF

# Create Grafana dashboards
mkdir -p /opt/vokaflow/config/grafana/dashboards
cat > /opt/vokaflow/config/grafana/dashboards/dashboards.yaml << 'EOF'
apiVersion: 1

providers:
  - name: 'Default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
      foldersFromFilesStructure: true
EOF`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">4. Configure Logging</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create Loki configuration
mkdir -p /opt/vokaflow/config/loki
cat > /opt/vokaflow/config/loki/loki-config.yaml << 'EOF'
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/index
    cache_location: /loki/cache
    cache_ttl: 24h
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  retention_period: 168h

chunk_store_config:
  max_look_back_period: 168h

table_manager:
  retention_deletes_enabled: true
  retention_period: 168h
EOF

# Create Promtail configuration
mkdir -p /opt/vokaflow/config/promtail
cat > /opt/vokaflow/config/promtail/promtail-config.yaml << 'EOF'
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log

  - job_name: vokaflow
    static_configs:
      - targets:
          - localhost
        labels:
          job: vokaflow
          __path__: /app/logs/**/*.log
EOF`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Steps</CardTitle>
              <CardDescription>Deploying the Vokaflow 2.0 backend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">1. Build and Start Services</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Build and start services
cd /opt/vokaflow
docker-compose build
docker-compose up -d

# Check if services are running
docker-compose ps

# Check logs
docker-compose logs -f api`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">2. Initialize Database</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Wait for PostgreSQL to be ready
sleep 10

# Initialize database
docker-compose exec api python -c "from db.session import create_db_and_tables; create_db_and_tables()"

# Create admin user
docker-compose exec api python -c "
from db.session import SessionLocal
from models.user import User
from core.auth.password import get_password_hash

db = SessionLocal()
admin = User(
    email='admin@vokaflow.com',
    hashed_password=get_password_hash('admin'),
    full_name='Admin User',
    is_active=True,
    is_superuser=True
)
db.add(admin)
db.commit()
db.close()
print('Admin user created')
"`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">3. Download AI Models</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run the model download script
cd /opt/vokaflow
./scripts/download_models.sh

# Check if models are downloaded
ls -la /opt/vokaflow/models/whisper
ls -la /opt/vokaflow/models/qwen
ls -la /opt/vokaflow/models/nllb`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">4. Set Up SSL Certificates</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot certonly --webroot -w /opt/vokaflow/config/certbot/www -d your-domain.com

# Update Nginx configuration
sed -i 's/your-domain.com/your-actual-domain.com/g' /opt/vokaflow/config/nginx/default.conf

# Restart Nginx
docker-compose restart nginx

# Set up automatic renewal
echo "0 0 * * * certbot renew --quiet" | sudo tee -a /etc/crontab`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">5. Run Authentication Script</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run the authentication script
cd /opt/vokaflow
./scripts/auth_services.sh

# Restart services to apply changes
docker-compose restart`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Steps</CardTitle>
              <CardDescription>Verifying the Vokaflow 2.0 backend deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">1. Check Service Status</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Check if all services are running
cd /opt/vokaflow
docker-compose ps

# Check service logs
docker-compose logs -f api
docker-compose logs -f whisper
docker-compose logs -f xtts
docker-compose logs -f qwen`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">2. Test API Endpoints</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Test health endpoint
curl -s http://localhost:8000/health | jq

# Get access token
curl -s -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@vokaflow.com&password=admin" | jq

# Save token for later use
TOKEN=$(curl -s -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@vokaflow.com&password=admin" | jq -r .access_token)

# Test protected endpoint
curl -s http://localhost:8000/users/me \
  -H "Authorization: Bearer $TOKEN" | jq`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">3. Test AI Services</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Test Whisper service
curl -s http://localhost:8000/health/services | jq .services.whisper

# Test XTTS service
curl -s http://localhost:8000/health/services | jq .services.xtts

# Test Qwen service
curl -s http://localhost:8000/health/services | jq .services.qwen

# Test NLLB service
curl -s http://localhost:8000/health/services | jq .services.nllb`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">4. Check Storage Usage</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Check disk usage
df -h

# Check storage usage by directory
du -sh /opt/vokaflow/*
du -sh /var/lib/docker/*
du -sh /mnt/backup/*

# Check Docker volume usage
docker system df -v`}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">5. Set Up Monitoring Dashboard</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Access Grafana
# Open http://localhost:3000 in your browser
# Login with admin/admin (or your configured credentials)

# Import dashboards
# 1. Node Exporter dashboard (ID: 1860)
# 2. Docker dashboard (ID: 893)
# 3. PostgreSQL dashboard (ID: 9628)
# 4. Redis dashboard (ID: 763)

# Create custom dashboard for Vokaflow
# Add panels for:
# - API requests per second
# - API response time
# - AI service processing time
# - Storage usage
# - Memory usage
# - CPU usage`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col w-full">
                <Alert variant="default" className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Deployment Complete</AlertTitle>
                  <AlertDescription>
                    Your Vokaflow 2.0 backend is now fully deployed and ready to use. The system is optimized for your
                    three-drive storage setup and configured for optimal performance.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Complete Guide
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
