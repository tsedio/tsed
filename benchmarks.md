# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2321    | 650.42KB  | -            | -              |
| Ts.ED Koa      | 2587    | 515.39KB  | -            | -              |
| Nest-Express   | 4038    | 0.92MB    | -            | -              |
| Nest-Fastify   | 9925    | 1.67MB    | -            | -              |
| Express        | 4439    | 1.01MB    | -            | -              |
| Express Router | 4347    | 0.99MB    | -            | -              |
| Koa            | 11293   | 1.90MB    | -            | -              |
| Fastify        | 12486   | 2.10MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).