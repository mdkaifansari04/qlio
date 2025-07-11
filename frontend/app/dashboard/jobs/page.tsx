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
import { useGetJobs } from "@/hooks/queries";
import QueryWrapper from "@/components/shared/wrapper";
import { JobCardPendingView, StatsCardPendingView } from "@/components/shared/skeleton";
import { Job } from "@/hooks/data-type";

function getStatusBadge(status: Job["status"]) {
  const variants = {
    PENDING: { variant: "secondary" as const, icon: Clock, color: "text-gray-500" },
    RUNNING: { variant: "default" as const, icon: Loader2, color: "text-yellow-500" },
    SUCCESS: { variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
    FAILED: { variant: "destructive" as const, icon: XCircle, color: "text-red-500" },
    CANCELED: { variant: "outline" as const, icon: XCircle, color: "text-slate-500" },
  };

  const config = variants[status as keyof typeof variants];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color} ${status === "RUNNING" ? "animate-spin" : ""}`} />
      {status}
    </Badge>
  );
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: jobs, isError, isPending, error } = useGetJobs();

  const filteredJobs = jobs?.filter((job) => {
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

      <QueryWrapper
        data={filteredJobs}
        isPending={isPending}
        isError={isError}
        error={error}
        pendingView={<JobCardPendingView />}
        view={
          <div className="grid gap-4">
            {filteredJobs &&
              filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Terminal className="h-4 w-4" />
                        <span className="font-mono text-sm truncate max-w-md">{job.command}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status as Job["status"])}
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
        }
      />

      {filteredJobs?.length === 0 && (
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
