"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Loader2,
  MemoryStick,
  Play,
  Terminal,
  X,
  XCircle,
} from "lucide-react";

interface Job {
  id: string;
  command: string;
  params: string[] | null;
  timeout: number;
  priority: number;
  output: {
    success: boolean;
    response: string;
    timestamp: string;
  }[];
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "CANCELED";
  exitCode: number | null;
  retries: number;
  signal: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cpuUsage: number | null;
  duration: number | null;
  memoryUsage: number | null;
  workerId: string | null;
}

// Sample job data
const sampleJob: Job = {
  id: "87f408b5-6f3b-4760-9780-53b1f9615d77",
  command: "for i in {1..10}; do echo Number: $i; sleep 1; done",
  params: null,
  timeout: 500000,
  priority: 1,
  output: [
    { success: true, response: "Starting job execution...", timestamp: "2025-01-11T19:28:50.695Z" },
    { success: true, response: "Number: 1", timestamp: "2025-01-11T19:28:51.695Z" },
    { success: true, response: "Number: 2", timestamp: "2025-01-11T19:28:52.455Z" },
    { success: true, response: "Number: 3", timestamp: "2025-01-11T19:28:53.464Z" },
    {
      success: false,
      response: "Permission denied: /tmp/restricted",
      timestamp: "2025-01-11T19:28:53.999Z",
    },
    {
      success: false,
      response: "Job terminated with exit code 1",
      timestamp: "2025-01-11T19:28:54.100Z",
    },
  ],
  status: "FAILED",
  exitCode: 1,
  retries: 2,
  signal: null,
  startedAt: "2025-01-11T19:28:40.000Z",
  endedAt: "2025-01-11T19:28:54.000Z",
  createdAt: "2025-01-11T19:28:39.580Z",
  updatedAt: "2025-01-11T19:28:54.200Z",
  userId: "42450a0b-b8c3-431a-9d93-dabc9289d2ba",
  cpuUsage: 8,
  duration: 14,
  memoryUsage: 12,
  workerId: "worker-node-01",
};

function getStatusBadge(status: Job["status"]) {
  const variants = {
    PENDING: { variant: "secondary" as const, icon: Clock, color: "text-gray-500" },
    RUNNING: { variant: "default" as const, icon: Loader2, color: "text-yellow-500" },
    SUCCESS: { variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
    FAILED: { variant: "destructive" as const, icon: XCircle, color: "text-red-500" },
    CANCELED: { variant: "outline" as const, icon: X, color: "text-slate-500" },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color} ${status === "RUNNING" ? "animate-spin" : ""}`} />
      {status}
    </Badge>
  );
}

function formatTimestamp(timestamp: string) {
  return format(new Date(timestamp), "dd MMM HH:mm:ss");
}

export default function JobDetailPage() {
  const [job] = useState<Job>(sampleJob);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [job.output]);

  const handleCancelJob = () => {
    console.log("Canceling job:", job.id);
    // TODO: Implement WebSocket job cancellation
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Details</h1>
          <p className="text-muted-foreground font-mono">#{job.id}</p>
        </div>
        {getStatusBadge(job.status)}
      </div>

      {/* Job Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Command Execution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Command */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Command</label>
            <div className="mt-1 rounded-md bg-muted p-3 font-mono text-sm break-all">
              {job.command}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                Priority
              </div>
              <div className="text-sm font-medium">{job.priority}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Timeout
              </div>
              <div className="text-sm font-medium">{(job.timeout / 1000).toFixed(0)}s</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                Retries
              </div>
              <div className="text-sm font-medium">{job.retries}</div>
            </div>

            {job.duration && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Duration
                </div>
                <div className="text-sm font-medium">{job.duration}s</div>
              </div>
            )}

            {job.cpuUsage && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Cpu className="h-3 w-3" />
                  CPU
                </div>
                <div className="text-sm font-medium">{job.cpuUsage}%</div>
              </div>
            )}

            {job.memoryUsage && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MemoryStick className="h-3 w-3" />
                  Memory
                </div>
                <div className="text-sm font-medium">{job.memoryUsage}MB</div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {job.workerId && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Database className="h-3 w-3" />
                  Worker ID
                </div>
                <div className="text-sm font-medium font-mono">{job.workerId}</div>
              </div>
            )}

            {job.exitCode !== null && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Terminal className="h-3 w-3" />
                  Exit Code
                </div>
                <div className="text-sm font-medium">{job.exitCode}</div>
              </div>
            )}

            {job.startedAt && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Play className="h-3 w-3" />
                  Started At
                </div>
                <div className="text-sm font-medium">
                  {format(new Date(job.startedAt), "dd MMM yyyy HH:mm:ss")}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Console Output */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Console Output
            </CardTitle>
            <Badge variant="outline">{job.output.length} lines</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] w-full" ref={scrollAreaRef}>
            <div className="bg-black p-4 font-mono text-sm">
              {job.output.length === 0 ? (
                <div className="text-gray-500">Waiting for output...</div>
              ) : (
                job.output.map((log, index) => (
                  <div key={index} className="flex gap-2 py-0.5">
                    <span className="text-gray-400 shrink-0 select-none">
                      {formatTimestamp(log.timestamp)} ==&gt;
                    </span>
                    <span className={log.success ? "text-gray-100" : "text-red-400"}>
                      {log.response.trim()}
                    </span>
                  </div>
                ))
              )}
              {job.status === "RUNNING" && (
                <div className="flex gap-2 py-0.5">
                  <span className="text-gray-400 shrink-0">
                    {formatTimestamp(new Date().toISOString())} ==&gt;
                  </span>
                  <span className="text-yellow-400 animate-pulse">Job is running...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Control Panel */}
      {job.status === "RUNNING" && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
              <span className="text-sm">Job is currently running...</span>
            </div>
            <Button variant="destructive" size="sm" onClick={handleCancelJob} className="gap-2">
              <X className="h-4 w-4" />
              Cancel Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
