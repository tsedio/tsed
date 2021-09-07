# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2429    | 680.82KB  | -            | -              |
| Ts.ED Koa      | 2773    | 552.38KB  | -            | -              |
| Nest-Express   | 4317    | 0.98MB    | -            | -              |
| Nest-Fastify   | 9782    | 1.64MB    | -            | -              |
| Express        | 4542    | 1.04MB    | -            | -              |
| Express Router | 4430    | 1.01MB    | -            | -              |
| Koa            | 11495   | 1.93MB    | -            | -              |
| Fastify        | 12565   | 2.11MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).