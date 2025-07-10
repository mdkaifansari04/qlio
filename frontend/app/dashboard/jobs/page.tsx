"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Cpu,
  ExternalLink,
  Loader2,
  MemoryStick,
  Plus,
  Search,
  Terminal,
  XCircle,
} from "lucide-react";

interface Job {
  id: string;
  command: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "CANCELED";
  cpuUsage: number | null;
  memoryUsage: number | null;
  duration: number | null;
  createdAt: string;
}

const mockJobs: Job[] = [
  {
    id: "87f408b5-6f3b-4760-9780-53b1f9615d77",
    command: "npm run build && npm run deploy",
    status: "SUCCESS",
    cpuUsage: 45,
    memoryUsage: 128,
    duration: 142,
    createdAt: "2025-01-11T10:30:00Z",
  },
  {
    id: "92a518c6-7g4c-5871-a891-64c2g0726e88",
    command: "docker build -t myapp:latest .",
    status: "RUNNING",
    cpuUsage: 78,
    memoryUsage: 256,
    duration: null,
    createdAt: "2025-01-11T11:15:00Z",
  },
  {
    id: "a3b629d7-8h5d-6982-b9a2-75d3h1837f99",
    command: "python data_processing.py --batch-size=1000",
    status: "FAILED",
    cpuUsage: 23,
    memoryUsage: 64,
    duration: 89,
    createdAt: "2025-01-11T09:45:00Z",
  },
  {
    id: "b4c73ae8-9i6e-7a93-ca3-86e4i2948gaa",
    command: "git clone https://github.com/user/repo.git",
    status: "PENDING",
    cpuUsage: null,
    memoryUsage: null,
    duration: null,
    createdAt: "2025-01-11T11:45:00Z",
  },
];

function getStatusBadge(status: Job["status"]) {
  const variants = {
    PENDING: { variant: "secondary" as const, icon: Clock, color: "text-gray-500" },
    RUNNING: { variant: "default" as const, icon: Loader2, color: "text-yellow-500" },
    SUCCESS: { variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
    FAILED: { variant: "destructive" as const, icon: XCircle, color: "text-red-500" },
    CANCELED: { variant: "outline" as const, icon: XCircle, color: "text-slate-500" },
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

export default function JobsPage() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.command.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Manage and monitor your job executions</p>
        </div>
        <Link href="/dashboard/create-job">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RUNNING">Running</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono text-sm truncate max-w-md">{job.command}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(job.status)}
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {job.cpuUsage && (
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      {job.cpuUsage}%
                    </div>
                  )}
                  {job.memoryUsage && (
                    <div className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3" />
                      {job.memoryUsage}MB
                    </div>
                  )}
                  {job.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.duration}s
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(job.createdAt), "MMM dd, HH:mm")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first job"}
            </p>
            <Link href="/dashboard/create-job">
              <Button>Create Your First Job</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
