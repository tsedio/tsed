# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2426    | 680.05KB  | -            | -              |
| Ts.ED Koa      | 2730    | 543.82KB  | -            | -              |
| Nest-Express   | 4141    | 0.94MB    | -            | -              |
| Nest-Fastify   | 11843   | 1.99MB    | -            | -              |
| Express        | 4545    | 1.04MB    | -            | -              |
| Express Router | 4424    | 1.01MB    | -            | -              |
| Koa            | 11497   | 1.93MB    | -            | -              |
| Fastify        | 12319   | 2.07MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).