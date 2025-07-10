"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, CheckCircle, Circle, Clock, Terminal, TrendingUp, XCircle } from "lucide-react";

// Mock data
const jobsOverTime = [
  { date: "Jan 4", jobs: 12 },
  { date: "Jan 5", jobs: 19 },
  { date: "Jan 6", jobs: 8 },
  { date: "Jan 7", jobs: 15 },
  { date: "Jan 8", jobs: 22 },
  { date: "Jan 9", jobs: 18 },
  { date: "Jan 10", jobs: 25 },
];

const resourceUsage = [
  { job: "Job 1", cpu: 45, memory: 32 },
  { job: "Job 2", cpu: 78, memory: 56 },
  { job: "Job 3", cpu: 23, memory: 18 },
  { job: "Job 4", cpu: 67, memory: 43 },
  { job: "Job 5", cpu: 89, memory: 71 },
];

export default function DashboardPage() {
  const [stats] = useState({
    totalJobs: 1247,
    successfulJobs: 1089,
    failedJobs: 158,
    avgExecutionTime: 42.3,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Circle className="h-2 w-2 shadow-lg shadow-green-300 bg-green-500 text-green-500 rounded-full" />
          Main Server
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.successfulJobs / stats.totalJobs) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.failedJobs / stats.totalJobs) * 100).toFixed(1)}% failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgExecutionTime}s</div>
            <p className="text-xs text-muted-foreground">-2.1s from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jobs Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                jobs: {
                  label: "Jobs",
                  color: "#1570EF",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={jobsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="jobs" stroke="var(--color-jobs)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage (Recent Jobs)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cpu: {
                  label: "CPU %",
                  color: "#1570EF",
                },
                memory: {
                  label: "Memory %",
                  color: "#83B4FF",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart className="rounded-md" data={resourceUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="job" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cpu" fill="#1570EF" className="rounded-md" />
                  <Bar dataKey="memory" fill="#1570EF" className="rounded-md" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
