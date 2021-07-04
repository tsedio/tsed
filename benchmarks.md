# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2116    | 592.94KB  | -            | -              |
| Ts.ED Koa      | 2335    | 465.09KB  | -            | -              |
| Nest-Express   | 3514    | 820.28KB  | -            | -              |
| Nest-Fastify   | 9826    | 1.65MB    | -            | -              |
| Express        | 3691    | 861.50KB  | -            | -              |
| Express Router | 3718    | 867.70KB  | -            | -              |
| Koa            | 8831    | 1.48MB    | -            | -              |
| Fastify        | 10933   | 1.84MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).