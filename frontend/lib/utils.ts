import { Job } from "@/hooks/data-type";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: Error) => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "Something went wrong, Please try again";
};

export function calculateJobStats(jobs: Job[]): {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  successRate: string;
  failureRate: string;
  avgExecutionTimeSec: number;
} {
  const totalJobs = jobs.length;

  const successfulJobs = jobs.filter((job) => job.status === "SUCCESS").length;

  const failedJobs = totalJobs - successfulJobs;

  const successRate = ((successfulJobs / totalJobs) * 100).toFixed(1) + "%";
  const failureRate = ((failedJobs / totalJobs) * 100).toFixed(1) + "%";

  // calculate execution time for jobs that have both startedAt and endedAt
  const durations: number[] = jobs
    .filter((job) => job.startedAt && job.endedAt)
    .map((job) => {
      const start = new Date(job.startedAt!).getTime();
      const end = new Date(job.endedAt!).getTime();
      return (end - start) / 1000; // in seconds
    });

  const avgExecutionTimeSec = durations.reduce((sum, d) => sum + d, 0) / durations.length || 0;

  return {
    totalJobs,
    successfulJobs,
    failedJobs,
    successRate,
    failureRate,
    avgExecutionTimeSec: parseFloat(avgExecutionTimeSec.toFixed(1)),
  };
}

type JobsOverTime = { date: string; jobs: number }[];
type ResourceUsage = { job: string; cpu: number; memory: number }[];

export function extractJobGraphs(jobs: Job[]): {
  jobsOverTime: JobsOverTime;
  resourceUsage: ResourceUsage;
} {
  const jobsByDateMap = new Map<string, number>();
  const resourceUsage: ResourceUsage = [];

  jobs.forEach((job, index) => {
    // Group by day
    const date = format(new Date(job.createdAt), "MMM d");
    jobsByDateMap.set(date, (jobsByDateMap.get(date) || 0) + 1);

    // Push CPU/mem usage if present
    if (job.cpuUsage != null && job.memoryUsage != null) {
      resourceUsage.push({
        job: `Job ${index + 1}`,
        cpu: job.cpuUsage,
        memory: job.memoryUsage,
      });
    }
  });

  // Convert map to sorted array
  const jobsOverTime: JobsOverTime = Array.from(jobsByDateMap.entries())
    .map(([date, jobs]) => ({ date, jobs }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { jobsOverTime, resourceUsage };
}
