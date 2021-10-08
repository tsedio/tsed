# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2375    | 665.67KB  | -            | -              |
| Ts.ED Koa      | 2705    | 538.83KB  | -            | -              |
| Nest-Express   | 3825    | 0.87MB    | -            | -              |
| Nest-Fastify   | 10622   | 1.78MB    | -            | -              |
| Express        | 4251    | 0.97MB    | -            | -              |
| Express Router | 4169    | 0.95MB    | -            | -              |
| Koa            | 9935    | 1.67MB    | -            | -              |
| Fastify        | 9616    | 1.61MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).