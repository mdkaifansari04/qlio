import { Request } from "express";

export interface CustomRequest extends Request {
  userId?: any;
  value?: any;
}
export type JOB_STREAM_LINE_TYPE = "stdout" | "stderr";

export interface IStreamType {
  jobId: string;
  line: string;
  type: JOB_STREAM_LINE_TYPE;
}
