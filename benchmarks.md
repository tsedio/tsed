# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1520    | 426.06KB  | -            | -              |
| Ts.ED Koa      | 1777    | 353.99KB  | -            | -              |
| Nest-Express   | 2321    | 541.81KB  | -            | -              |
| Nest-Fastify   | 5712    | 0.96MB    | -            | -              |
| Express        | 2590    | 604.39KB  | -            | -              |
| Express Router | 2565    | 598.58KB  | -            | -              |
| Koa            | 5636    | 0.95MB    | -            | -              |
| Fastify        | 5926    | 0.99MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).