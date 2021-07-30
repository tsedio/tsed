# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2671    | 748.73KB  | -            | -              |
| Ts.ED Koa      | 2938    | 585.34KB  | -            | -              |
| Nest-Express   | 4346    | 0.99MB    | -            | -              |
| Nest-Fastify   | 12550   | 2.11MB    | -            | -              |
| Express        | 4646    | 1.06MB    | -            | -              |
| Express Router | 4618    | 1.05MB    | -            | -              |
| Koa            | 12254   | 2.06MB    | -            | -              |
| Fastify        | 13666   | 2.29MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).