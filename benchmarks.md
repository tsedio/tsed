# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1544    | 432.85KB  | -            | -              |
| Ts.ED Koa      | 1815    | 361.56KB  | -            | -              |
| Nest-Express   | 2361    | 551.05KB  | -            | -              |
| Nest-Fastify   | 5366    | 0.90MB    | -            | -              |
| Express        | 2639    | 615.91KB  | -            | -              |
| Express Router | 2568    | 599.33KB  | -            | -              |
| Koa            | 5456    | 0.92MB    | -            | -              |
| Fastify        | 6020    | 1.01MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).