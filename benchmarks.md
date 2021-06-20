# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1986    | 556.75KB  | -            | -              |
| Ts.ED Koa      | 2177    | 433.64KB  | -            | -              |
| Nest-Express   | 3172    | 740.31KB  | -            | -              |
| Nest-Fastify   | 8815    | 1.48MB    | -            | -              |
| Express        | 3557    | 830.27KB  | -            | -              |
| Express Router | 3436    | 801.88KB  | -            | -              |
| Koa            | 8108    | 1.36MB    | -            | -              |
| Fastify        | 9933    | 1.67MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).