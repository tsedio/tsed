# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1449    | 405.98KB  | -            | -              |
| Ts.ED Koa      | 1700    | 338.59KB  | -            | -              |
| Nest-Express   | 2131    | 497.47KB  | -            | -              |
| Nest-Fastify   | 4704    | 808.42KB  | -            | -              |
| Express        | 2383    | 556.18KB  | -            | -              |
| Express Router | 2335    | 545.06KB  | -            | -              |
| Koa            | 4913    | 844.43KB  | -            | -              |
| Fastify        | 5243    | 0.88MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).