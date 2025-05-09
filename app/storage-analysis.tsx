"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HardDrive, Database, FileText, Music, Film, Package, AlertTriangle, CheckCircle } from "lucide-react"

export default function StorageAnalysis() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Storage Analysis for Vokaflow 2.0</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Original Storage Configuration</CardTitle>
            <CardDescription>As specified in the technical report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Primary NVMe SSD</span>
                </div>
                <span className="font-medium">2TB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Secondary HDD (RAID 1)</span>
                </div>
                <span className="font-medium">4TB (2TB usable)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Total Usable Storage</span>
                </div>
                <span className="font-medium">4TB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Storage Configuration</CardTitle>
            <CardDescription>Modified storage specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Primary NVMe SSD</span>
                </div>
                <span className="font-medium">1TB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Secondary NVMe SSD</span>
                </div>
                <span className="font-medium">500GB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Total Usable Storage</span>
                </div>
                <span className="font-medium">1.5TB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="data">Data & Media</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Requirements Overview</CardTitle>
              <CardDescription>Estimated storage needs for Vokaflow 2.0</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">AI Models</span>
                    <span className="text-sm">650GB / 1.5TB</span>
                  </div>
                  <Progress value={43} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Database Storage</span>
                    <span className="text-sm">200GB / 1.5TB</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Media Files</span>
                    <span className="text-sm">300GB / 1.5TB</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">System & Containers</span>
                    <span className="text-sm">100GB / 1.5TB</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Reserved Space</span>
                    <span className="text-sm">150GB / 1.5TB</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Used</span>
                    <span className="text-sm">1.4TB / 1.5TB</span>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Limited Growth Capacity</AlertTitle>
                <AlertDescription>
                  Your configuration will work but leaves only about 100GB for future growth. Consider implementing a
                  storage expansion plan.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Models Storage Requirements</CardTitle>
              <CardDescription>Detailed breakdown of AI model storage needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Whisper (large-v3)</span>
                  </div>
                  <span className="font-medium">3GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>XTTS v2</span>
                  </div>
                  <span className="font-medium">5GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Qwen 14B (GPTQ-Int4)</span>
                  </div>
                  <span className="font-medium">8GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>NLLB-200-3.3B</span>
                  </div>
                  <span className="font-medium">7GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>LLaMA 3 (70B)</span>
                  </div>
                  <span className="font-medium">35GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>YourTTS</span>
                  </div>
                  <span className="font-medium">2GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>EasyOCR Models</span>
                  </div>
                  <span className="font-medium">2GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Custom Voice Models (estimated)</span>
                  </div>
                  <span className="font-medium">500GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Other AI Models</span>
                  </div>
                  <span className="font-medium">88GB</span>
                </div>
                <div className="border-t pt-4 flex items-center justify-between font-medium">
                  <span>Total AI Models</span>
                  <span>650GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data & Media Storage</CardTitle>
              <CardDescription>Database and media file storage requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Database Storage (200GB)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        <span>PostgreSQL</span>
                      </div>
                      <span className="font-medium">150GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        <span>Redis</span>
                      </div>
                      <span className="font-medium">10GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        <span>ClickHouse</span>
                      </div>
                      <span className="font-medium">40GB</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Media Files (300GB)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Music className="mr-2 h-4 w-4" />
                        <span>Voice Recordings</span>
                      </div>
                      <span className="font-medium">150GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Film className="mr-2 h-4 w-4" />
                        <span>Generated Audio</span>
                      </div>
                      <span className="font-medium">100GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Other Media</span>
                      </div>
                      <span className="font-medium">50GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Storage</CardTitle>
              <CardDescription>Operating system and container storage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="mr-2 h-4 w-4" />
                    <span>Operating System</span>
                  </div>
                  <span className="font-medium">30GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Docker Images</span>
                  </div>
                  <span className="font-medium">40GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Logs</span>
                  </div>
                  <span className="font-medium">20GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="mr-2 h-4 w-4" />
                    <span>Other System Files</span>
                  </div>
                  <span className="font-medium">10GB</span>
                </div>
                <div className="border-t pt-4 flex items-center justify-between font-medium">
                  <span>Total System Storage</span>
                  <span>100GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Storage Sufficiency Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Sufficient for Initial Deployment</AlertTitle>
              <AlertDescription>
                Your 1.5TB storage configuration (1TB + 500GB NVMe SSDs) is sufficient for the initial deployment of
                Vokaflow 2.0.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Limited Growth Capacity</AlertTitle>
              <AlertDescription>
                With approximately 93% of storage used at deployment, you'll have limited room for growth. Consider
                implementing a storage expansion plan or external storage solution for backups and less frequently
                accessed data.
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Recommendations:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the 1TB drive for the operating system, databases, and AI models</li>
                <li>Use the 500GB drive for media storage, logs, and backups</li>
                <li>Implement a regular cleanup policy for logs and temporary files</li>
                <li>Consider adding external storage for long-term backups</li>
                <li>Monitor storage usage closely and plan for expansion when reaching 90% capacity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
