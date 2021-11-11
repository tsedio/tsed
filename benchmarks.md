# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1772    | 496.55KB  | -            | -              |
| Ts.ED Koa      | 1862    | 371.04KB  | -            | -              |
| Nest-Express   | 2918    | 681.02KB  | -            | -              |
| Nest-Fastify   | 7014    | 1.18MB    | -            | -              |
| Express        | 3206    | 748.31KB  | -            | -              |
| Express Router | 3064    | 715.21KB  | -            | -              |
| Koa            | 6726    | 1.13MB    | -            | -              |
| Fastify        | 9099    | 1.53MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).