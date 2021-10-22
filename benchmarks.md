# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1545    | 433.13KB  | -            | -              |
| Ts.ED Koa      | 1792    | 357.07KB  | -            | -              |
| Nest-Express   | 2355    | 549.75KB  | -            | -              |
| Nest-Fastify   | 5238    | 0.88MB    | -            | -              |
| Express        | 2585    | 603.26KB  | -            | -              |
| Express Router | 2493    | 581.90KB  | -            | -              |
| Koa            | 5304    | 0.89MB    | -            | -              |
| Fastify        | 5522    | 0.93MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).