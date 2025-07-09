export function getBackoffDelay(retry: number): number {
  return [5000, 10000, 20000][retry] || 30000; // 5s, 10s, 20s
}
