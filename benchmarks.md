# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2422    | 678.74KB  | -            | -              |
| Ts.ED Koa      | 2633    | 524.48KB  | -            | -              |
| Nest-Express   | 4002    | 0.91MB    | -            | -              |
| Nest-Fastify   | 9813    | 1.65MB    | -            | -              |
| Express        | 4231    | 0.96MB    | -            | -              |
| Express Router | 4258    | 0.97MB    | -            | -              |
| Koa            | 11343   | 1.90MB    | -            | -              |
| Fastify        | 12224   | 2.05MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).