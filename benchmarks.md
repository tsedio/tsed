# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2309    | 647.03KB  | -            | -              |
| Ts.ED Koa      | 2531    | 504.25KB  | -            | -              |
| Nest-Express   | 3994    | 0.91MB    | -            | -              |
| Nest-Fastify   | 9535    | 1.60MB    | -            | -              |
| Express        | 4208    | 0.96MB    | -            | -              |
| Express Router | 4206    | 0.96MB    | -            | -              |
| Koa            | 10954   | 1.84MB    | -            | -              |
| Fastify        | 10602   | 1.78MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).