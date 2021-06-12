# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2223    | 623.09KB  | -            | -              |
| Ts.ED Koa      | 2409    | 479.94KB  | -            | -              |
| Nest-Express   | 3680    | 858.94KB  | -            | -              |
| Nest-Fastify   | 10450   | 1.75MB    | -            | -              |
| Express        | 4026    | 0.92MB    | -            | -              |
| Express Router | 3929    | 0.90MB    | -            | -              |
| Koa            | 10502   | 1.76MB    | -            | -              |
| Fastify        | 11185   | 1.88MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).