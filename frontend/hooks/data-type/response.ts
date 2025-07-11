export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: string;
}
