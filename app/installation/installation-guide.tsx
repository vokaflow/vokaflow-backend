"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, HardDrive, Server, Shield, BarChart, Download, CheckCircle, AlertTriangle } from "lucide-react"

export default function InstallationGuide() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vokaflow 2.0 Installation Guide</h1>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Modified Storage Configuration</AlertTitle>
        <AlertDescription>
          This installation guide has been adapted for your storage configuration: 1TB primary NVMe SSD and 500GB
          secondary NVMe SSD.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Installation Overview</CardTitle>
              <CardDescription>Key steps for deploying Vokaflow 2.0 backend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">1. System Preparation</h3>
                    <p className="text-muted-foreground">
                      Prepare the hardware, install Ubuntu Server 24.04 LTS, and configure storage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">2. Base Installation</h3>
                    <p className="text-muted-foreground">
                      Install Docker, NVIDIA drivers, CUDA, and configure networking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">3. Security Configuration</h3>
                    <p className="text-muted-foreground">Set up firewall, Vault, and security measures</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Terminal className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">4. Services Deployment</h3>
                    <p className="text-muted-foreground">
                      Deploy core services, AI services, and additional components
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">5. Verification and Monitoring</h3>
                    <p className="text-muted-foreground">Verify deployment, set up monitoring, and configure backups</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("preparation")}>Start Installation</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preparation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preparation</CardTitle>
              <CardDescription>Hardware setup and initial system configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Hardware Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>CPU:</strong> Intel Xeon E5-2683 v4 (16 cores, 32 threads)
                    </li>
                    <li>
                      <strong>RAM:</strong> 128GB DDR4 ECC
                    </li>
                    <li>
                      <strong>GPU:</strong> NVIDIA RTX 5060Ti 16GB VRAM
                    </li>
                    <li>
                      <strong>Storage:</strong> 1TB NVMe SSD (primary) + 500GB NVMe SSD (secondary)
                    </li>
                    <li>
                      <strong>Network:</strong> 10Gbps Ethernet
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Storage Configuration</h3>
                  <p className="mb-4">For optimal performance with your storage configuration:</p>

                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Primary Drive (1TB NVMe SSD)</h4>
                      <ul className="list-disc pl-6 mt-2">
                        <li>
                          Mount point: <code>/</code> (root filesystem)
                        </li>
                        <li>
                          Partition 1: 100GB for <code>/</code> (operating system)
                        </li>
                        <li>
                          Partition 2: 900GB for <code>/opt/vokaflow</code> (application data)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Secondary Drive (500GB NVMe SSD)</h4>
                      <ul className="list-disc pl-6 mt-2">
                        <li>
                          Mount point: <code>/var/lib/docker</code> (Docker data)
                        </li>
                        <li>Single partition: 500GB</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Operating System Installation</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Download Ubuntu Server 24.04 LTS ISO</li>
                    <li>Create bootable USB drive</li>
                    <li>Boot from USB and start installation</li>
                    <li>Select "Manual" partitioning and create partitions as described above</li>
                    <li>Complete installation with minimal server profile</li>
                    <li>Install OpenSSH server for remote access</li>
                  </ol>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Initial System Configuration</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim htop net-tools

# Configure timezone
sudo timedatectl set-timezone UTC

# Configure NTP
sudo apt install -y systemd-timesyncd
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd

# Create Vokaflow directory
sudo mkdir -p /opt/vokaflow
sudo mkdir -p /opt/vokaflow/scripts
sudo mkdir -p /opt/vokaflow/config
sudo mkdir -p /opt/vokaflow/logs
sudo mkdir -p /var/log/vokaflow

# Set up secondary drive for Docker
sudo mkfs.ext4 /dev/nvme1n1
sudo mkdir -p /var/lib/docker
echo "/dev/nvme1n1 /var/lib/docker ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a

# Verify mounts
df -h`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("installation")}>Next: Base Installation</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Base Installation</CardTitle>
              <CardDescription>Installing Docker, NVIDIA drivers, and CUDA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Download Installation Scripts</h3>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Clone installation scripts repository
cd /opt
sudo git clone https://github.com/vokaflow/installer.git vokaflow
cd vokaflow

# Make scripts executable
sudo chmod +x scripts/*.sh
sudo chmod +x scripts/utils/*.sh
sudo chmod +x scripts/maintenance/*.sh`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Install Docker and Docker Compose</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run Docker installation script
sudo ./scripts/02_install_docker.sh

# Verify Docker installation
docker --version
docker-compose --version

# Add current user to docker group
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Install NVIDIA Drivers and CUDA</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run NVIDIA installation script
sudo ./scripts/03_install_nvidia.sh

# Verify NVIDIA installation
nvidia-smi
nvcc --version

# Test NVIDIA with Docker
docker run --rm --gpus all nvidia/cuda:12.3.0-base-ubuntu24.04 nvidia-smi`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Configure Network</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run network configuration script
sudo ./scripts/04_setup_network.sh

# Verify network configuration
ip addr
netstat -tuln`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("preparation")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("configuration")}>Next: Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Security, services, and AI models configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Configure Security</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run security configuration script
sudo ./scripts/05_setup_security.sh

# Set up Vault for secrets management
sudo ./scripts/06_setup_vault.sh

# Verify security configuration
sudo ufw status
sudo systemctl status fail2ban`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Deploy Core Services</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Deploy core services
sudo ./scripts/07_deploy_core.sh

# Verify core services
docker ps --filter "name=vokaflow-*"
curl -s http://localhost:8000/health`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Deploy AI Services</h3>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Storage Optimization</AlertTitle>
                    <AlertDescription>
                      Due to your limited storage, we'll modify the AI model deployment to use quantized models where
                      possible.
                    </AlertDescription>
                  </Alert>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Create .env file with optimized model settings
cat > /opt/vokaflow/.env.local << 'EOF'
# AI Models - Optimized for storage
WHISPER_MODEL=medium
QWEN_MODEL=Qwen/Qwen1.5-7B-Chat-GPTQ-Int4
LLAMA_MODEL=meta-llama/Llama-3-8b-chat-hf
NLLB_MODEL=facebook/nllb-200-1.3B
OCR_LANGUAGES=en,es,fr,de,it,pt
EOF

# Deploy AI services with optimized settings
sudo ./scripts/08_deploy_ai.sh --optimized-storage

# Download essential models only
sudo ./scripts/12_download_models.sh --essential-only`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Deploy Additional Services</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Deploy monitoring services
sudo ./scripts/09_deploy_monitoring.sh

# Deploy additional services
sudo ./scripts/10_deploy_additional.sh

# Configure all services
sudo ./scripts/11_configure_services.sh`}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("installation")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("verification")}>Next: Verification</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification and Monitoring</CardTitle>
              <CardDescription>Verify deployment and set up monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Verify Deployment</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Run verification script
sudo ./scripts/14_verify_deployment.sh

# Check all services
docker ps

# Test API
curl -s http://localhost:8000/health | jq`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Set Up Backups</h3>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>External Backup Recommended</AlertTitle>
                    <AlertDescription>
                      Due to limited storage, configure backups to an external storage device or cloud storage.
                    </AlertDescription>
                  </Alert>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    <pre className="text-xs">
                      {`# Configure external backup location
sudo mkdir -p /mnt/backup
# Mount your external backup device to /mnt/backup

# Configure backups to external storage
sudo ./scripts/13_setup_backups.sh --external-path=/mnt/backup

# Test backup
sudo ./scripts/maintenance/backup.sh`}
                    </pre>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Access Services</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">API Documentation</h4>
                      <p className="mt-2">
                        Access at: <code>http://localhost:8000/docs</code>
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Monitoring Dashboard</h4>
                      <p className="mt-2">
                        Access Grafana at: <code>http://localhost:3000</code>
                      </p>
                      <p>Default credentials: admin / admin</p>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Admin Dashboard</h4>
                      <p className="mt-2">
                        Access at: <code>http://localhost/admin</code>
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Storage Management</h3>
                  <div className="space-y-4">
                    <p>Implement these storage management practices:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Configure log rotation with shorter retention periods</li>
                      <li>Set up automatic cleanup of temporary files</li>
                      <li>Monitor storage usage with Grafana dashboards</li>
                      <li>Set up alerts for storage usage above 85%</li>
                      <li>Implement a data archiving policy for older data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("configuration")}>
                Back
              </Button>
              <Button variant="default" className="gap-2">
                <Download className="h-4 w-4" />
                Download Complete Guide
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Final Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Implementation Ready</AlertTitle>
              <AlertDescription>
                Your hardware configuration with 1TB + 500GB NVMe SSDs is sufficient for implementing Vokaflow 2.0 with
                the optimizations outlined in this guide.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Storage Expansion Plan</AlertTitle>
              <AlertDescription>
                Develop a storage expansion plan for when your system reaches 85% capacity, which may happen within 6-12
                months depending on usage patterns.
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Key Optimizations:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Using smaller, quantized AI models where possible</li>
                <li>Configuring external backup storage</li>
                <li>Implementing aggressive log rotation</li>
                <li>Optimizing database storage with regular maintenance</li>
                <li>Monitoring storage usage closely</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
