# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2202    | 617.10KB  | -            | -              |
| Ts.ED Koa      | 2458    | 489.60KB  | -            | -              |
| Nest-Express   | 3459    | 807.33KB  | -            | -              |
| Nest-Fastify   | 8106    | 1.36MB    | -            | -              |
| Express        | 3838    | 0.87MB    | -            | -              |
| Express Router | 3714    | 866.95KB  | -            | -              |
| Koa            | 9756    | 1.64MB    | -            | -              |
| Fastify        | 10138   | 1.70MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).