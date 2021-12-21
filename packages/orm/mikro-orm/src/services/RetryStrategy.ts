export interface RetryStrategy {
  acquire<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>>;
}
