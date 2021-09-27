# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2074    | 581.31KB  | -            | -              |
| Ts.ED Koa      | 2280    | 454.28KB  | -            | -              |
| Nest-Express   | 3451    | 805.44KB  | -            | -              |
| Nest-Fastify   | 9951    | 1.67MB    | -            | -              |
| Express        | 3323    | 775.68KB  | -            | -              |
| Express Router | 3552    | 829.15KB  | -            | -              |
| Koa            | 9814    | 1.65MB    | -            | -              |
| Fastify        | 10566   | 1.77MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).