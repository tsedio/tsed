import {Inject, Injectable} from "@tsed/di";

export interface RetryPolicy {
  retry<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>>;
}

export const RetryPolicy: unique symbol = Symbol("RetryPolicy");

@Injectable({provide: RetryPolicy})
export class TokenBucket implements RetryPolicy {
  public retry<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>> {
    // ...
  }
}

@Injectable()
export class MyService {
  constructor(@Inject(RetryPolicy) private readonly retryPolicy: RetryPolicy) {
    // an instance of `TokenBucket`
  }
}
