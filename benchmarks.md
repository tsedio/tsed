# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1869    | 523.88KB  | -            | -              |
| Ts.ED Koa      | 2110    | 420.42KB  | -            | -              |
| Nest-Express   | 2966    | 692.17KB  | -            | -              |
| Nest-Fastify   | 7184    | 1.21MB    | -            | -              |
| Express        | 3200    | 746.90KB  | -            | -              |
| Express Router | 3167    | 739.26KB  | -            | -              |
| Koa            | 6548    | 1.10MB    | -            | -              |
| Fastify        | 6977    | 1.17MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).