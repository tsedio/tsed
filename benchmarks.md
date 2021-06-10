# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2555    | 716.10KB  | -            | -              |
| Ts.ED Koa      | 2830    | 563.83KB  | -            | -              |
| Nest-Express   | 4215    | 0.96MB    | -            | -              |
| Nest-Fastify   | 11857   | 1.99MB    | -            | -              |
| Express        | 4551    | 1.04MB    | -            | -              |
| Express Router | 4540    | 1.03MB    | -            | -              |
| Koa            | 11934   | 2.00MB    | -            | -              |
| Fastify        | 12768   | 2.14MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).