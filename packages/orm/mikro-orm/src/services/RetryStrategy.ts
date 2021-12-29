export interface RetryStrategy {
  acquire<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>>;
}

export const RetryStrategy: unique symbol = Symbol("RetryStrategy");
