import { Request } from "express";

export interface CustomRequest extends Request {
  userId?: any;
  value?: any;
}
export type JOB_STREAM_LINE_TYPE = "stdout" | "stderr";

export interface IStreamType {
  jobId: string;
  output: {
    response: string;
    timestamp: string;
    success: boolean;
  };
  type: JOB_STREAM_LINE_TYPE;
  timestamp: Date;
}

export type SubscribePayload = {
  jobId: string;
  priority: number;
  queueKey?: string;
};

export type JobCancelPayload = {
  jobId: string;
};

export interface JobCanceledResponse extends JobCancelPayload {
  success: boolean;
}
