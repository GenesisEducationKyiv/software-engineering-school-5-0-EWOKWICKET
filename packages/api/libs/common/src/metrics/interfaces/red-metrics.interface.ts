export interface REDMetricsService {
  onRequestStart(transport: string, route: string): void;
  onRequestEnd(transport: string, route: string, durationMs: number): void;
  onRequestError(transport: string, route: string): void;
}
