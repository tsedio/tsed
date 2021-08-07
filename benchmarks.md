# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2600    | 728.74KB  | -            | -              |
| Ts.ED Koa      | 2931    | 584.00KB  | -            | -              |
| Nest-Express   | 4198    | 0.96MB    | -            | -              |
| Nest-Fastify   | 11870   | 1.99MB    | -            | -              |
| Express        | 4609    | 1.05MB    | -            | -              |
| Express Router | 4481    | 1.02MB    | -            | -              |
| Koa            | 12027   | 2.02MB    | -            | -              |
| Fastify        | 13050   | 2.19MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).