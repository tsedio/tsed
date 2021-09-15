# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1699    | 476.19KB  | -            | -              |
| Ts.ED Koa      | 2016    | 401.58KB  | -            | -              |
| Nest-Express   | 2635    | 615.05KB  | -            | -              |
| Nest-Fastify   | 6165    | 1.03MB    | -            | -              |
| Express        | 2870    | 669.79KB  | -            | -              |
| Express Router | 2828    | 659.99KB  | -            | -              |
| Koa            | 6287    | 1.06MB    | -            | -              |
| Fastify        | 6665    | 1.12MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).