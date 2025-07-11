export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

export interface JobStreamResponse {
  jobId: String;
  output: JobResponse;
  type: "stdout" | "stderr";
  timestamp: string;
  exitCode?: number;
}

export interface Job {
  id: string;
  command: string;
  params: string[];
  timeout: number;
  priority: number;
  output: JobResponse[];
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "CANCELED";
  exitCode: number;
  retries: number;
  signal: string | null;
  startedAt: Date;
  endedAt: Date;
  duration: number | null;
  cpuUsage: number;
  memoryUsage: number;
  workerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
