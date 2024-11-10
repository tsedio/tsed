export interface RetryPolicy {
  retry<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>>;
}

export const RetryPolicy: unique symbol = Symbol("RetryPolicy");

class TokenBucket implements RetryPolicy {
  public retry<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>> {
    // ...
  }
}

injectable(RetryPolicy).class(TokenBucket);
