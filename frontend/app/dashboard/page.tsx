"use client"

import { StatsCardPendingView } from "@/components/shared/skeleton"
import QueryWrapper from "@/components/shared/wrapper"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetJobs } from "@/hooks/queries"
import { calculateJobStats, extractJobGraphs } from "@/lib/utils"
import withAuth from "@/provider/auth-provider"
import {
  CheckCircle,
  Circle,
  Clock,
  Terminal,
  TrendingUp,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

const page = () => {
  const { data: jobs, isError, isPending, error } = useGetJobs()
  const [currentTime, setCurrentTime] = useState(new Date())
  const stats = calculateJobStats(jobs || [])
  const graphs = extractJobGraphs(jobs || [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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
      <QueryWrapper
        data={jobs}
        isPending={isPending}
        isError={isError}
        error={error}
        pendingView={<StatsCardPendingView />}
        view={
          jobs && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Jobs
                  </CardTitle>
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3" /> +12% from last
                    month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Successful Jobs
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.successfulJobs}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.successRate}% success rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Failed Jobs
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.failedJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.failureRate}% failure rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Execution Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgExecutionTimeSec}s
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -2.1s from last week
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        }
      />

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
                <LineChart data={graphs.jobsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    stroke="var(--color-jobs)"
                    strokeWidth={2}
                  />
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
                <BarChart className="rounded-md" data={graphs.resourceUsage}>
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
  )
}

export default withAuth(page)
