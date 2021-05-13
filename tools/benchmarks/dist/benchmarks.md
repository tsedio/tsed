# Benchmark result

tsed vs tsed-koa: Performance decreased by -0.23% on average, be careful!.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|               | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| ------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express | 2194    | 615.02KB  | -28.73%      | -28.73%        |
| Ts.ED Koa     | 4903    | 1.05MB    | -16.77%      | -16.67%        |
| Nest-Express  | 8096    | 1.85MB    | -44.47%      | -44.53%        |
| Nest-Fastify  | 27016   | 4.53MB    | +1.39%       | +1.52%         |
| Express       | 8125    | 1.84MB    | -2.59%       | -2.22%         |
| Koa           | 24717   | 4.13MB    | -12.35%      | -12.53%        |
| Fastify       | 33830   | 5.65MB    | -16.90%      | -16.98%        |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).