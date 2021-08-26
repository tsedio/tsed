# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2599    | 728.30KB  | -            | -              |
| Ts.ED Koa      | 2902    | 578.23KB  | -            | -              |
| Nest-Express   | 4182    | 0.95MB    | -            | -              |
| Nest-Fastify   | 10312   | 1.73MB    | -            | -              |
| Express        | 4603    | 1.05MB    | -            | -              |
| Express Router | 4490    | 1.02MB    | -            | -              |
| Koa            | 11726   | 1.97MB    | -            | -              |
| Fastify        | 12590   | 2.11MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).