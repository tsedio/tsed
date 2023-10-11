export interface Job {
  handle(payload: unknown): unknown;
}
