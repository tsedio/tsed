import {inject, injectable} from "@tsed/di";
import {RetryPolicy} from "./RetryPolicy.js";

export class MyService {
  private readonly retryPolicy = inject(RetryPolicy);

}

injectable(MyService);

