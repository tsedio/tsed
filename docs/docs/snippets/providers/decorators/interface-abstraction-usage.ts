import {Inject, Injectable} from "@tsed/di";
import {RetryPolicy} from "./RetryPolicy.js";

@Injectable()
export class MyService {
  constructor(@Inject(RetryPolicy) private readonly retryPolicy: RetryPolicy) {
    // RetryPolicy will be automatically injected with its implementation (TokenBucket)
  }
}
