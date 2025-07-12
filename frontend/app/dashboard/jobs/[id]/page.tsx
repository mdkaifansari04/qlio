"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"
import { Job, JobResponse, JobStreamResponse } from "@/hooks/data-type"
import { useParams } from "next/navigation"
import { getJobById } from "@/hooks/queries"
import { DefaultLoader } from "@/components/shared/wrapper"
import { useSocket } from "@/provider/socket-provider"
import withAuth from "@/provider/auth-provider"

function getStatusBadge(status: Job["status"]) {
  const variants = {
    PENDING: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-gray-500",
    },
    RUNNING: {
      variant: "default" as const,
      icon: Loader2,
      color: "text-yellow-500",
    },
    SUCCESS: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-500",
    },
    FAILED: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-500",
    },
    CANCELED: { variant: "outline" as const, icon: X, color: "text-slate-500" },
  }

  const config = variants[status as keyof typeof variants]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon
        className={`h-3 w-3 ${config.color} ${
          status === "RUNNING" ? "animate-spin" : ""
        }`}
      />
      {status}
    </Badge>
  )
}

function formatTimestamp(timestamp: string) {
  return format(new Date(timestamp), "dd MMM HH:mm:ss")
}

const page = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [outputLogs, setOutputLogs] = useState<JobResponse[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [implicitStatus, setImplicitStatus] = useState<Job["status"] | null>(
    null
  )
  const socket = useSocket()

  const { id } = useParams()
  const { data: job, isLoading, isError } = getJobById(id as string)

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [outputLogs])

  const handleCancelJob = () => {
    console.log("Canceling job:", job?.id)
    // TODO: Implement WebSocket job cancellation
  }

  useEffect(() => {
    if (!job?.id || !socket?.connected) return
    if (job.status !== "PENDING") return
    socket.emit("job:subscribe", { jobId: job.id, priority: job.priority })

    const handleUpdate = (data: JobStreamResponse) => {
      if (data.jobId === job.id) {
        if (data.output) {
          setOutputLogs((prev) => [...prev, data.output])
        }
      }
    }

    const handleDone = (data: JobStreamResponse) => {
      if (data.jobId === job.id) {
        setImplicitStatus(data.exitCode === 0 ? "SUCCESS" : "FAILED")
        const lastLog = {
          success: data.exitCode === 0,
          response:
            data.exitCode === 0
              ? "Your job executed successfully 🎉"
              : "Your job failed 💀",
          timestamp: new Date().toISOString(),
        }
        setOutputLogs((prev) => [...prev, lastLog])
      }
    }

    socket.on("job:update", handleUpdate)
    socket.on("job:done", handleDone)

    setIsStreaming(true)

    return () => {
      socket.off("job:update", handleUpdate)
      socket.off("job:done", handleUpdate)
      socket.emit("job:unsubscribe", job.id)
    }
  }, [job?.id, socket?.connected])

  if (!job && isLoading) return <DefaultLoader className="h-screen" />
  if (!job)
    return (
      <div className="flex items-center justify-center h-screen">
        Job not found
      </div>
    )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Details</h1>
          <p className="text-muted-foreground font-mono">#{job.id}</p>
        </div>
        {getStatusBadge(implicitStatus || job.status)}
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
            <label className="text-sm font-medium text-muted-foreground">
              Command
            </label>
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
              <div className="text-sm font-medium">
                {(job.timeout / 1000).toFixed(0)}s
              </div>
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
                <div className="text-sm font-medium font-mono">
                  {job.workerId}
                </div>
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
            <div className="bg-secondary p-4 font-mono text-sm">
              {job.output.length === 0 && implicitStatus !== "PENDING" ? (
                <div className="text-gray-700">Waiting for output...</div>
              ) : (
                job.output.map((log, index) => (
                  <OutputLog log={log} index={index} />
                ))
              )}
              {implicitStatus === "PENDING" && <JobRunningStatus />}
              {job.status === "PENDING" &&
                isStreaming &&
                outputLogs.map((log, index) => (
                  <OutputLog log={log} index={index} />
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Control Panel */}
      {job.status === "RUNNING" && (
        <JobCancel handleCancelJob={handleCancelJob} />
      )}
    </div>
  )
}

function JobCancel({ handleCancelJob }: { handleCancelJob: () => void }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span className="text-sm">Job is currently running...</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleCancelJob}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Cancel Job
        </Button>
      </CardContent>
    </Card>
  )
}

function OutputLog({ log, index }: { log: JobResponse; index: number }) {
  return (
    <div key={index} className="flex gap-2 py-0.5">
      <span className="text-gray-400 shrink-0 select-none">
        {formatTimestamp(log?.timestamp || "")} ==&gt;
      </span>
      <span
        className={`whitespace-pre-wrap ${
          log.success ? "text-gray-100" : "text-red-400"
        }`}
      >
        {log.response.trim()}
      </span>
    </div>
  )
}

function JobRunningStatus() {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="text-gray-400 shrink-0">
        {formatTimestamp(new Date().toISOString())} ==&gt;
      </span>
      <span className="text-yellow-400 animate-pulse">Job is running...</span>
    </div>
  )
}

export default withAuth(page)
