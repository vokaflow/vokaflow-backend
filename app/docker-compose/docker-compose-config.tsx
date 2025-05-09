"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, AlertTriangle, Server, Database, Cpu } from "lucide-react"

export default function DockerComposeConfig() {
  const [activeTab, setActiveTab] = useState("main")

  // Declare environment variables
  const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY || ""
  const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || ""
  const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || ""
  const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || ""
  const VAULT_ADDR = process.env.VAULT_ADDR || ""
  const VAULT_TOKEN = process.env.VAULT_TOKEN || ""
  const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || ""
  const MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD || ""
  const GRAFANA_ADMIN_USER = process.env.GRAFANA_ADMIN_USER || "admin"
  const GRAFANA_ADMIN_PASSWORD = process.env.GRAFANA_ADMIN_PASSWORD || "admin"

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Docker Compose Configuration</h1>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Updated Three-Drive Configuration</AlertTitle>
        <AlertDescription>
          This Docker Compose configuration has been optimized for your three-drive setup (1TB NVMe + 500GB NVMe + 1TB SSD).
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="main">Main Config</TabsTrigger>
          <TabsTrigger value="core">Core Services</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Main Docker Compose Configuration</CardTitle>
              <CardDescription>Modified for your three-drive storage configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">
{`# docker-compose.yml
version: '3.8'

# Three-drive storage-optimized configuration
# - 1TB NVMe SSD (Primary): OS, Application, AI Models
# - 500GB NVMe SSD (Secondary): Docker, Media
# - 1TB SSD (Backup): Backups, Logs

services:
  # === PROXY INVERSO ===
  nginx:
    image: nginx:1.26-alpine
    container_name: vokaflow-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx:/etc/nginx/conf.d:ro
      - static_data:/usr/share/nginx/html:ro
      - logs_data:/var/log/nginx
      - ./config/certbot/conf:/etc/letsencrypt:ro
      - ./config/certbot/www:/var/www/certbot:ro
    networks:
      - backend_network
    depends_on:
      - api
      - grafana
      - prometheus
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 60s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"

  certbot:
    image: certbot/certbot
    container_name: vokaflow-certbot
    volumes:
      - ./config/certbot/conf:/etc/letsencrypt
      - ./config/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    networks:
      - backend_network

  # === SERVICIOS CORE ===
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: vokaflow-api:latest
    container_name: vokaflow-api
    restart: unless-stopped
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
      - cache_data:/app/cache
      - static_data:/app/static
      - ./config:/app/config:ro
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=INFO
      - API_WORKERS=4
      - WHISPER_MODEL=medium
      - QWEN_MODEL=Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4
      - GOOGLE_CLOUD_API_KEY=${GOOGLE_CLOUD_API_KEY}
      - GOOGLE_CLOUD_PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID}
      - FIREBASE_SERVICE_ACCOUNT_PATH=/app/config/firebase/service-account.json
      - FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
      - REDIS_URL=redis://redis:6379/0
      - POSTGRES_URL=postgresql://vokaflow:\${POSTGRES_PASSWORD}@postgres:5432/vokaflow
      - VAULT_ADDR=${VAULT_ADDR}
      - VAULT_TOKEN=${VAULT_TOKEN}
      - VAULT_MOUNT_POINT=prod
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
    networks:
      - backend_network
      - redis_network
      - postgres_network
      - rabbitmq_network
      - minio_network

networks:
  backend_network:
    driver: bridge
  redis_network:
    driver: bridge
  postgres_network:
    driver: bridge
  rabbitmq_network:
    driver: bridge
  minio_network:
    driver: bridge
  monitoring_network:
    driver: bridge

volumes:
  # Primary Drive (1TB NVMe SSD)
  models_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/vokaflow/models
  static_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/vokaflow/static
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/vokaflow/data/postgres
  redis_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/vokaflow/data/redis
  
  # Secondary Drive (500GB NVMe SSD)
  cache_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/cache
  voice_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/voices
  rabbitmq_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/rabbitmq
  minio_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/minio
  
  # Backup Drive (1TB SSD)
  logs_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup/logs
  backup_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup
  prometheus_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup/prometheus
  grafana_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/backup/grafana`}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="core" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Services Configuration</CardTitle>
              <CardDescription>Database, cache, and storage services</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">
{`# === BASES DE DATOS Y ALMACENAMIENTO ===
  postgres:
    image: postgres:16-alpine
    container_name: vokaflow-postgres
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=vokaflow
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=vokaflow
    command: >
      postgres
        -c shared_buffers=2GB
        -c effective_cache_size=6GB
        -c maintenance_work_mem=512MB
        -c max_connections=100
        -c work_mem=32MB
        -c wal_buffers=16MB
        -c random_page_cost=1.1
    networks:
      - postgres_network
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "vokaflow"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7.2-alpine
    container_name: vokaflow-redis
    restart: unless-stopped
    command: redis-server --save 60 1 --loglevel warning --maxmemory 4gb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - redis_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: vokaflow-rabbitmq
    restart: unless-stopped
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER=vokaflow
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_PASSWORD}
    networks:
      - rabbitmq_network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "check_running"]
      interval: 30s
      timeout: 10s
      retries: 3

  minio:
    image: minio/minio:latest
    container_name: vokaflow-minio
    restart: unless-stopped
    volumes:
      - minio_data:/data
    environment:
      - MINIO_ROOT_USER=vokaflow
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    networks:
      - minio_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      
  clickhouse:
    image: clickhouse/clickhouse-server:23.8
    container_name: vokaflow-clickhouse
    restart: unless-stopped
    volumes:
      - ./config/clickhouse/config.xml:/etc/clickhouse-server/config.xml
      - ./config/clickhouse/users.xml:/etc/clickhouse-server/users.xml
      - clickhouse_data:/var/lib/clickhouse
    networks:
      - backend_network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--spider", "--tries=1", "http://localhost:8123/ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      
  mosquitto:
    image: eclipse-mosquitto:2.0
    container_name: vokaflow-mosquitto
    restart: unless-stopped
    volumes:
      - ./config/mosquitto/mosquitto.conf:/mosquitto/config/mosquitto.conf
      - mosquitto_data:/mosquitto/data
      - mosquitto_log:/mosquitto/log
    ports:
      - "127.0.0.1:1883:1883"
    networks:
      - backend_network`}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Storage-optimized database configurations</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Services Configuration</CardTitle>
              <CardDescription>Optimized for your storage constraints</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Storage Optimization</AlertTitle>
                <AlertDescription>
                  AI services are configured to use smaller, quantized models to reduce storage requirements.
                </AlertDescription>
              </Alert>
              
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">
{`# === SERVICIOS DE IA ===
  whisper:
    build:
      context: ./services/whisper
      dockerfile: Dockerfile
    image: vokaflow-whisper:latest
    container_name: vokaflow-whisper
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - MODEL_SIZE=medium
      - DEVICE=cuda
      - MAX_WORKERS=4
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api

  xtts:
    build:
      context: ./services/xtts
      dockerfile: Dockerfile
    image: vokaflow-xtts:latest
    container_name: vokaflow-xtts
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - MODEL_VERSION=v2
      - DEVICE=cuda
      - MAX_WORKERS=2
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api

  qwen:
    build:
      context: ./services/qwen
      dockerfile: Dockerfile
    image: vokaflow-qwen:latest
    container_name: vokaflow-qwen
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - MODEL_NAME=Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4
      - DEVICE=cuda
      - MAX_LENGTH=4096
      - MAX_NEW_TOKENS=1024
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api

  ocr:
    build:
      context: ./services/ocr
      dockerfile: Dockerfile
    image: vokaflow-ocr:latest
    container_name: vokaflow-ocr
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - LANGUAGES=en,es,fr,de,it,pt
      - DEVICE=cuda
      - MAX_WORKERS=2
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api

  translator:
    build:
      context: ./services/translator
      dockerfile: Dockerfile
    image: vokaflow-translator:latest
    container_name: vokaflow-translator
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - MODEL_NAME=facebook/nllb-200-1.3B
      - CONTEXT_MODEL=Qwen/Qwen1.5-1.8B-Chat-GPTQ-Int4
      - DEVICE=cuda
      - MAX_WORKERS=2
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api
      - qwen

  voice-clone:
    build:
      context: ./services/voice-clone
      dockerfile: Dockerfile
    image: vokaflow-voice-clone:latest
    container_name: vokaflow-voice-clone
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
      - voice_data:/app/voices
    environment:
      - MODEL_NAME=tts_models/multilingual/multi-dataset/your_tts
      - DEVICE=cuda
      - MAX_WORKERS=1
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api

  assistant:
    build:
      context: ./services/assistant
      dockerfile: Dockerfile
    image: vokaflow-assistant:latest
    container_name: vokaflow-assistant
    restart: unless-stopped
    volumes:
      - models_data:/app/models
      - logs_data:/app/logs
    environment:
      - MODEL_NAME=meta-llama/Llama-3-8b-chat-hf
      - DEVICE=cuda
      - MAX_LENGTH=4096
      - MAX_NEW_TOKENS=1024
      - STORAGE_OPTIMIZED=true
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - backend_network
    depends_on:
      - api`}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Using smaller, quantized models to save storage space</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Services Configuration</CardTitle>
              <CardDescription>Prometheus, Grafana, and logging services</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs">
{`# === SERVICIOS DE MONITORIZACIÓN ===
  prometheus:
    image: prom/prometheus:v2.51.1
    container_name: vokaflow-prometheus
    restart: unless-stopped
    volumes:
      - ./config/prometheus:/etc/prometheus:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    networks:
      - monitoring_network
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"

  grafana:
    image: grafana/grafana:10.3.1
    container_name: vokaflow-grafana
    restart: unless-stopped
    volumes:
      - ./config/grafana:/etc/grafana/provisioning:ro
      - grafana_data:/var/lib/grafana
    environment:\
      - GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER:-admin}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel
      - GF_ANALYTICS_REPORTING_ENABLED=false
    networks:
      - monitoring_network
    depends_on:
      - prometheus
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"

  node-exporter:
    image: prom/node-exporter:v1.7.0
    container_name: vokaflow-node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring_network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    container_name: vokaflow-cadvisor
    restart: unless-stopped
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    devices:
      - /dev/kmsg
    networks:
      - monitoring_network

  loki:
    image: grafana/loki:2.9.5
    container_name: vokaflow-loki
    restart: unless-stopped
    volumes:
      - ./config/loki:/etc/loki:ro
      - loki_data:/loki
    command: -config.file=/etc/loki/loki-config.yaml
    # Storage optimization - reduced retention
    environment:
      - LOKI_RETENTION_PERIOD=168h
    networks:
      - monitoring_network

  promtail:
    image: grafana/promtail:2.9.5
    container_name: vokaflow-promtail
    restart: unless-stopped
    volumes:
      - ./config/promtail:/etc/promtail:ro
      - /var/log:/var/log:ro
      - logs_data:/app/logs:ro
    command: -config.file=/etc/promtail/promtail-config.yaml
    networks:
      - monitoring_network
    depends_on:
      - loki`}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Monitoring services with optimized storage settings</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
