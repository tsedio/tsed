# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2187    | 613.01KB  | -            | -              |
| Ts.ED Koa      | 2404    | 478.98KB  | -            | -              |
| Nest-Express   | 3452    | 805.76KB  | -            | -              |
| Nest-Fastify   | 8003    | 1.34MB    | -            | -              |
| Express        | 3833    | 0.87MB    | -            | -              |
| Express Router | 3693    | 861.97KB  | -            | -              |
| Koa            | 9202    | 1.54MB    | -            | -              |
| Fastify        | 10523   | 1.77MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).