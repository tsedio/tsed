# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2097    | 587.73KB  | -            | -              |
| Ts.ED Koa      | 2461    | 490.31KB  | -            | -              |
| Nest-Express   | 3549    | 828.38KB  | -            | -              |
| Nest-Fastify   | 8793    | 1.48MB    | -            | -              |
| Express        | 3851    | 0.88MB    | -            | -              |
| Express Router | 3768    | 0.86MB    | -            | -              |
| Koa            | 9097    | 1.53MB    | -            | -              |
| Fastify        | 11079   | 1.86MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).