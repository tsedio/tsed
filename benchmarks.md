# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2652    | 743.18KB  | -            | -              |
| Ts.ED Koa      | 2899    | 577.62KB  | -            | -              |
| Nest-Express   | 4375    | 1.00MB    | -            | -              |
| Nest-Fastify   | 10433   | 1.75MB    | -            | -              |
| Express        | 4707    | 1.07MB    | -            | -              |
| Express Router | 4652    | 1.06MB    | -            | -              |
| Koa            | 12021   | 2.02MB    | -            | -              |
| Fastify        | 13305   | 2.23MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).