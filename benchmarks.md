# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1760    | 493.21KB  | -            | -              |
| Ts.ED Koa      | 2046    | 407.51KB  | -            | -              |
| Nest-Express   | 2759    | 644.00KB  | -            | -              |
| Nest-Fastify   | 6683    | 1.12MB    | -            | -              |
| Express        | 2966    | 692.35KB  | -            | -              |
| Express Router | 2936    | 685.26KB  | -            | -              |
| Koa            | 6691    | 1.12MB    | -            | -              |
| Fastify        | 7440    | 1.25MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).