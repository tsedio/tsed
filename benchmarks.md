# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2169    | 607.83KB  | -            | -              |
| Ts.ED Koa      | 2503    | 498.67KB  | -            | -              |
| Nest-Express   | 3731    | 0.85MB    | -            | -              |
| Nest-Fastify   | 10433   | 1.75MB    | -            | -              |
| Express        | 4021    | 0.92MB    | -            | -              |
| Express Router | 3979    | 0.91MB    | -            | -              |
| Koa            | 10171   | 1.71MB    | -            | -              |
| Fastify        | 11747   | 1.97MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).